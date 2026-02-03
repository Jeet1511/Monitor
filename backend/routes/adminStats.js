const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Website = require('../models/Website');
const PingLog = require('../models/PingLog');

// Admin auth middleware
const adminAuth = async (req, res, next) => {
    try {
        const jwt = require('jsonwebtoken');
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const admin = await Admin.findById(decoded.adminId);

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found or deactivated'
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

// @route   GET /api/admin/stats/comprehensive
// @desc    Get comprehensive admin statistics (48+ metrics)
// @access  Admin
router.get('/stats/comprehensive', adminAuth, async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // User Stats
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({
            lastLogin: { $gte: sevenDaysAgo }
        });
        const newUsersToday = await User.countDocuments({
            createdAt: { $gte: today }
        });
        const newUsersWeek = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });
        const newUsersMonth = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const unverifiedUsers = await User.countDocuments({ isVerified: false });

        // User plan distribution
        const usersByPlan = await User.aggregate([
            { $group: { _id: '$plan', count: { $sum: 1 } } }
        ]);

        // Website Stats
        const totalWebsites = await Website.countDocuments();
        const activeWebsites = await Website.countDocuments({ isActive: true });
        const inactiveWebsites = await Website.countDocuments({ isActive: false });
        const websitesUp = await Website.countDocuments({ lastStatus: 'up' });
        const websitesDown = await Website.countDocuments({ lastStatus: 'down' });
        const websitesPending = await Website.countDocuments({ lastStatus: 'pending' });
        const websitesMaintenance = await Website.countDocuments({ 'maintenance.enabled': true });

        // Keep-alive stats
        const keepAliveWebsites = await Website.countDocuments({ 'keepAlive.enabled': true });
        const keepAliveByPlatform = await Website.aggregate([
            { $match: { 'keepAlive.enabled': true } },
            { $group: { _id: '$keepAlive.platform', count: { $sum: 1 } } }
        ]);

        // Websites by category
        const websitesByCategory = await Website.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Websites by priority
        const websitesByPriority = await Website.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Performance score distribution
        const websitesByScore = await Website.aggregate([
            { $group: { _id: '$performanceScore', count: { $sum: 1 } } }
        ]);

        // Ping Stats (last 24 hours)
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const totalPings24h = await PingLog.countDocuments({
            timestamp: { $gte: oneDayAgo }
        });
        const successfulPings24h = await PingLog.countDocuments({
            timestamp: { $gte: oneDayAgo },
            status: 'up'
        });
        const failedPings24h = await PingLog.countDocuments({
            timestamp: { $gte: oneDayAgo },
            status: 'down'
        });

        // Average response time
        const avgResponseTime = await PingLog.aggregate([
            { $match: { timestamp: { $gte: oneDayAgo }, responseTime: { $gt: 0 } } },
            { $group: { _id: null, avg: { $avg: '$responseTime' } } }
        ]);

        // Total pings all time
        const totalPingsAllTime = await PingLog.countDocuments();

        // System Stats
        const systemStats = {
            serverUptime: process.uptime(),
            serverUptimeFormatted: formatUptime(process.uptime()),
            nodeVersion: process.version,
            platform: process.platform,
            memoryUsage: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem(),
                usedPercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
            },
            cpuUsage: os.loadavg()[0],
            cpuCores: os.cpus().length
        };

        // Database Stats
        const dbStats = {
            connected: mongoose.connection.readyState === 1,
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            collections: Object.keys(mongoose.connection.collections).length
        };

        // Recent activity
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt plan');

        const recentWebsites = await Website.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name url lastStatus createdAt')
            .populate('userId', 'name email');

        // Alerts and issues
        const websitesWithIssues = await Website.find({
            $or: [
                { lastStatus: 'down' },
                { 'alerting.currentFailures': { $gte: 2 } }
            ]
        }).select('name url lastStatus alerting.currentFailures');

        res.json({
            success: true,
            data: {
                // User metrics
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    newToday: newUsersToday,
                    newWeek: newUsersWeek,
                    newMonth: newUsersMonth,
                    verified: verifiedUsers,
                    unverified: unverifiedUsers,
                    byPlan: usersByPlan.reduce((acc, p) => ({ ...acc, [p._id || 'free']: p.count }), {})
                },
                // Website metrics
                websites: {
                    total: totalWebsites,
                    active: activeWebsites,
                    inactive: inactiveWebsites,
                    up: websitesUp,
                    down: websitesDown,
                    pending: websitesPending,
                    maintenance: websitesMaintenance,
                    keepAlive: keepAliveWebsites,
                    keepAliveByPlatform: keepAliveByPlatform.reduce((acc, p) => ({ ...acc, [p._id]: p.count }), {}),
                    byCategory: websitesByCategory.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {}),
                    byPriority: websitesByPriority.reduce((acc, p) => ({ ...acc, [p._id]: p.count }), {}),
                    byScore: websitesByScore.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
                },
                // Ping metrics
                pings: {
                    total24h: totalPings24h,
                    successful24h: successfulPings24h,
                    failed24h: failedPings24h,
                    successRate24h: totalPings24h > 0
                        ? Math.round((successfulPings24h / totalPings24h) * 100)
                        : 100,
                    avgResponseTime: Math.round(avgResponseTime[0]?.avg || 0),
                    totalAllTime: totalPingsAllTime
                },
                // System metrics
                system: systemStats,
                // Database metrics
                database: dbStats,
                // Recent activity
                recent: {
                    users: recentUsers,
                    websites: recentWebsites
                },
                // Issues requiring attention
                issues: {
                    websitesDown: websitesDown,
                    websitesWithIssues: websitesWithIssues
                },
                // Timestamp
                generatedAt: now.toISOString()
            }
        });
    } catch (error) {
        console.error('Comprehensive stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Helper function to format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

// @route   GET /api/admin/stats/system
// @desc    Get real-time system stats
// @access  Admin
router.get('/stats/system', adminAuth, async (req, res) => {
    try {
        const cpus = os.cpus();
        const cpuUsage = cpus.reduce((acc, cpu) => {
            const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
            const idle = cpu.times.idle;
            return acc + ((total - idle) / total) * 100;
        }, 0) / cpus.length;

        res.json({
            success: true,
            data: {
                cpu: {
                    usage: Math.round(cpuUsage),
                    cores: cpus.length,
                    model: cpus[0]?.model || 'Unknown',
                    loadAvg: os.loadavg()
                },
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    used: os.totalmem() - os.freemem(),
                    usedPercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
                },
                process: {
                    uptime: process.uptime(),
                    uptimeFormatted: formatUptime(process.uptime()),
                    memoryUsage: process.memoryUsage(),
                    pid: process.pid,
                    nodeVersion: process.version
                },
                os: {
                    platform: os.platform(),
                    release: os.release(),
                    hostname: os.hostname(),
                    type: os.type()
                },
                database: {
                    connected: mongoose.connection.readyState === 1,
                    readyState: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
                }
            }
        });
    } catch (error) {
        console.error('System stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/admin/audit-logs
// @desc    Get admin action audit logs (simulated)
// @access  Admin
router.get('/audit-logs', adminAuth, async (req, res) => {
    try {
        // In production, you'd store audit logs in a separate collection
        // For now, return recent admin actions based on user/website changes
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const recentUserChanges = await User.find()
            .sort({ updatedAt: -1 })
            .limit(10)
            .select('name email updatedAt createdAt');

        const recentWebsiteChanges = await Website.find()
            .sort({ updatedAt: -1 })
            .limit(10)
            .select('name url updatedAt createdAt userId')
            .populate('userId', 'name');

        // Combine and format as audit logs
        const logs = [
            ...recentUserChanges.map(u => ({
                type: 'user',
                action: u.createdAt.getTime() === u.updatedAt.getTime() ? 'created' : 'updated',
                target: u.name,
                targetId: u._id,
                timestamp: u.updatedAt
            })),
            ...recentWebsiteChanges.map(w => ({
                type: 'website',
                action: w.createdAt.getTime() === w.updatedAt.getTime() ? 'created' : 'updated',
                target: w.name,
                targetId: w._id,
                user: w.userId?.name || 'Unknown',
                timestamp: w.updatedAt
            }))
        ].sort((a, b) => b.timestamp - a.timestamp);

        res.json({
            success: true,
            data: {
                logs: logs.slice(skip, skip + limit),
                total: logs.length,
                page,
                totalPages: Math.ceil(logs.length / limit)
            }
        });
    } catch (error) {
        console.error('Audit logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/admin/users/:id/suspend
// @desc    Suspend a user account
// @access  Admin
router.post('/users/:id/suspend', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User suspended successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Suspend user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/admin/users/:id/activate
// @desc    Activate a suspended user
// @access  Admin
router.post('/users/:id/activate', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User activated successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Activate user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/admin/users/:id/reset-password
// @desc    Reset user password (generates random password)
// @access  Admin
router.post('/users/:id/reset-password', adminAuth, async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const newPassword = Math.random().toString(36).slice(-8) + 'A1!';
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                password: hashedPassword,
                'security.lastPasswordChange': new Date()
            },
            { new: true }
        ).select('name email');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Password reset successfully',
            data: {
                user,
                temporaryPassword: newPassword // In production, send via email instead
            }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/admin/websites/:id/force-ping
// @desc    Force ping a website immediately
// @access  Admin
router.post('/websites/:id/force-ping', adminAuth, async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({
                success: false,
                message: 'Website not found'
            });
        }

        // Perform ping
        const axios = require('axios');
        const startTime = Date.now();
        let status = 'up';
        let responseTime = 0;
        let statusCode = 0;
        let error = null;

        try {
            const response = await axios({
                method: website.monitoring.method || 'GET',
                url: website.url,
                timeout: (website.monitoring.timeout || 30) * 1000,
                validateStatus: () => true
            });

            responseTime = Date.now() - startTime;
            statusCode = response.status;

            if (!website.expected.statusCodes.includes(statusCode)) {
                status = 'down';
            }
        } catch (err) {
            status = 'down';
            error = err.message;
            responseTime = Date.now() - startTime;
        }

        // Update website
        website.lastStatus = status;
        website.lastChecked = new Date();
        website.lastResponseTime = responseTime;
        website.lastStatusCode = statusCode;
        website.stats.totalChecks += 1;
        await website.save();

        // Log ping
        await PingLog.create({
            websiteId: website._id,
            status,
            responseTime,
            statusCode,
            error,
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Ping completed',
            data: {
                status,
                responseTime,
                statusCode,
                error
            }
        });
    } catch (error) {
        console.error('Force ping error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/admin/bulk/websites
// @desc    Bulk actions on websites
// @access  Admin
router.post('/bulk/websites', adminAuth, async (req, res) => {
    try {
        const { action, websiteIds } = req.body;

        if (!action || !websiteIds || !Array.isArray(websiteIds)) {
            return res.status(400).json({
                success: false,
                message: 'Action and websiteIds array required'
            });
        }

        let result;

        switch (action) {
            case 'activate':
                result = await Website.updateMany(
                    { _id: { $in: websiteIds } },
                    { isActive: true }
                );
                break;
            case 'deactivate':
                result = await Website.updateMany(
                    { _id: { $in: websiteIds } },
                    { isActive: false }
                );
                break;
            case 'delete':
                // Delete ping logs first
                await PingLog.deleteMany({ websiteId: { $in: websiteIds } });
                result = await Website.deleteMany({ _id: { $in: websiteIds } });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid action'
                });
        }

        res.json({
            success: true,
            message: `Bulk ${action} completed`,
            data: {
                matchedCount: result.matchedCount || result.deletedCount,
                modifiedCount: result.modifiedCount || result.deletedCount
            }
        });
    } catch (error) {
        console.error('Bulk action error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/admin/export/users
// @desc    Export all users as JSON
// @access  Admin
router.get('/export/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -security.twoFactorSecret')
            .lean();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=users-export.json');
        res.json({
            exportedAt: new Date().toISOString(),
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/admin/export/websites
// @desc    Export all websites as JSON
// @access  Admin
router.get('/export/websites', adminAuth, async (req, res) => {
    try {
        const websites = await Website.find()
            .populate('userId', 'name email')
            .lean();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=websites-export.json');
        res.json({
            exportedAt: new Date().toISOString(),
            count: websites.length,
            websites
        });
    } catch (error) {
        console.error('Export websites error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
