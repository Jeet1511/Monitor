const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Website = require('../models/Website');
const PingLog = require('../models/PingLog');

// ============ MIDDLEWARE ============

// Admin auth middleware
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        const admin = await Admin.findById(decoded.adminId);
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Admin not found' });
        }
        if (!admin.isActive) {
            return res.status(403).json({ success: false, message: 'Admin account is deactivated' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

// Permission check middleware factory
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.admin.hasPermission(permission)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Missing permission: ${permission}`
            });
        }
        next();
    };
};

// Super admin only middleware
const superAdminOnly = (req, res, next) => {
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super Admin only.'
        });
    }
    next();
};

// ============ AUTH ROUTES ============

// @route   POST /api/admin/login
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        if (!admin.isActive) {
            return res.status(403).json({ success: false, message: 'Admin account is deactivated' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }

        admin.lastLogin = new Date();
        await admin.save();

        const token = jwt.sign(
            { adminId: admin._id, type: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    permissions: admin.getAllPermissions(),
                    type: 'admin'
                }
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// @route   GET /api/admin/me
router.get('/me', adminAuth, async (req, res) => {
    res.json({
        success: true,
        data: {
            user: {
                id: req.admin._id,
                name: req.admin.name,
                email: req.admin.email,
                role: req.admin.role,
                permissions: req.admin.getAllPermissions(),
                type: 'admin',
                createdAt: req.admin.createdAt,
                lastLogin: req.admin.lastLogin
            }
        }
    });
});

// ============ ADMIN MANAGEMENT (Super Admin Only) ============

// @route   GET /api/admin/admins
router.get('/admins', adminAuth, superAdminOnly, async (req, res) => {
    try {
        const admins = await Admin.find()
            .select('-password')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { admins }
        });
    } catch (error) {
        console.error('Fetch admins error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/admin/admins
router.post('/admins', adminAuth, superAdminOnly, [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('permissions').isArray().withMessage('Permissions must be an array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, permissions } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            permissions,
            createdBy: req.admin._id
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                admin: {
                    id: newAdmin._id,
                    name: newAdmin.name,
                    email: newAdmin.email,
                    role: newAdmin.role,
                    permissions: newAdmin.permissions,
                    createdAt: newAdmin.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/admins/:id
router.put('/admins/:id', adminAuth, superAdminOnly, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Prevent modifying super admin (except themselves)
        if (admin.role === 'superadmin' && req.admin._id.toString() !== admin._id.toString()) {
            return res.status(403).json({ success: false, message: 'Cannot modify another super admin' });
        }

        const { name, email, password, permissions, isActive } = req.body;

        if (name) admin.name = name;

        // Allow email update
        if (email && email !== admin.email) {
            // Check if email already exists
            const existingAdmin = await Admin.findOne({ email, _id: { $ne: admin._id } });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'Email already in use by another admin' });
            }
            admin.email = email;
        }

        // Allow password update
        if (password && password.length >= 6) {
            admin.password = await bcrypt.hash(password, 10);
        }

        if (permissions && admin.role !== 'superadmin') admin.permissions = permissions;
        if (isActive !== undefined) admin.isActive = isActive;

        await admin.save();

        res.json({
            success: true,
            message: 'Admin updated successfully',
            data: { admin: { ...admin.toObject(), password: undefined } }
        });
    } catch (error) {
        console.error('Update admin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/admin/admins/:id
router.delete('/admins/:id', adminAuth, superAdminOnly, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        if (admin.role === 'superadmin') {
            return res.status(403).json({ success: false, message: 'Cannot delete super admin' });
        }

        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(403).json({ success: false, message: 'Cannot delete yourself' });
        }

        await admin.deleteOne();

        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ STATS ROUTES ============

// @route   GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const totalWebsites = await Website.countDocuments();
        const activeWebsites = await Website.countDocuments({ isActive: true });
        const upWebsites = await Website.countDocuments({ lastStatus: 'up' });
        const downWebsites = await Website.countDocuments({ lastStatus: 'down' });

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentPings = await PingLog.countDocuments({ createdAt: { $gte: oneDayAgo } });

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers, activeUsers, recentUsers,
                    totalWebsites, activeWebsites, upWebsites, downWebsites,
                    recentPings
                }
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ USER MANAGEMENT ============

// @route   GET /api/admin/users
router.get('/users', adminAuth, requirePermission('users.view'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        const usersWithStats = await Promise.all(users.map(async (user) => {
            const websiteCount = await Website.countDocuments({ userId: user._id });
            return { ...user.toObject(), websiteCount };
        }));

        res.json({
            success: true,
            data: {
                users: usersWithStats,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        });
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/admin/users/:id
router.get('/users/:id', adminAuth, requirePermission('users.view'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const websites = await Website.find({ userId: user._id }).sort({ createdAt: -1 });

        res.json({ success: true, data: { user, websites } });
    } catch (error) {
        console.error('Fetch user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/admin/users/:id/suspend
router.post('/users/:id/suspend', adminAuth, requirePermission('users.manage'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        res.json({ success: true, message: 'User suspended successfully' });
    } catch (error) {
        console.error('Suspend user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/admin/users/:id/activate
router.post('/users/:id/activate', adminAuth, requirePermission('users.manage'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isActive = true;
        await user.save();

        res.json({ success: true, message: 'User activated successfully' });
    } catch (error) {
        console.error('Activate user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/admin/users/:id/reset-password
router.post('/users/:id/reset-password', adminAuth, requirePermission('users.manage'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate random password
        const newPassword = Math.random().toString(36).slice(-10);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully',
            data: { temporaryPassword: newPassword }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', adminAuth, requirePermission('users.manage'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const websites = await Website.find({ userId: user._id });
        for (const website of websites) {
            await PingLog.deleteMany({ websiteId: website._id });
        }
        await Website.deleteMany({ userId: user._id });
        await user.deleteOne();

        res.json({ success: true, message: 'User and associated data deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ WEBSITE MANAGEMENT ============

// @route   GET /api/admin/websites
router.get('/websites', adminAuth, requirePermission('websites.view'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        const query = {};
        if (status && ['up', 'down', 'pending'].includes(status)) {
            query.lastStatus = status;
        }

        const websites = await Website.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Website.countDocuments(query);

        res.json({
            success: true,
            data: {
                websites,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        });
    } catch (error) {
        console.error('Fetch websites error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/admin/websites/:id/force-ping
router.post('/websites/:id/force-ping', adminAuth, requirePermission('websites.manage'), async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);
        if (!website) {
            return res.status(404).json({ success: false, message: 'Website not found' });
        }

        // Perform a quick ping
        const axios = require('axios');
        const startTime = Date.now();

        try {
            const response = await axios.get(website.url, {
                timeout: 30000,
                headers: { 'User-Agent': 'SiteMonitor-Admin/1.0' },
                validateStatus: () => true
            });

            const responseTime = Date.now() - startTime;
            const isUp = response.status >= 200 && response.status < 400;

            website.lastStatus = isUp ? 'up' : 'down';
            website.lastChecked = new Date();
            website.lastResponseTime = responseTime;
            await website.save();

            // Log the ping
            await PingLog.create({
                websiteId: website._id,
                status: isUp ? 'up' : 'down',
                responseTime,
                statusCode: response.status
            });

            res.json({
                success: true,
                message: `Ping complete: ${isUp ? 'UP' : 'DOWN'}`,
                data: { status: website.lastStatus, responseTime, statusCode: response.status }
            });
        } catch (pingError) {
            website.lastStatus = 'down';
            website.lastChecked = new Date();
            await website.save();

            res.json({
                success: true,
                message: 'Ping complete: DOWN (connection failed)',
                data: { status: 'down', error: pingError.message }
            });
        }
    } catch (error) {
        console.error('Force ping error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/admin/websites/:id
router.delete('/websites/:id', adminAuth, requirePermission('websites.manage'), async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);
        if (!website) {
            return res.status(404).json({ success: false, message: 'Website not found' });
        }

        await PingLog.deleteMany({ websiteId: website._id });
        await website.deleteOne();

        res.json({ success: true, message: 'Website deleted' });
    } catch (error) {
        console.error('Delete website error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ EXPORT ROUTES ============

// @route   GET /api/admin/export/:type
router.get('/export/:type', adminAuth, requirePermission('reports.view'), async (req, res) => {
    try {
        const { type } = req.params;
        let data;

        switch (type) {
            case 'users':
                data = await User.find().select('-password').lean();
                break;
            case 'websites':
                data = await Website.find().populate('userId', 'name email').lean();
                break;
            case 'activity':
                data = await PingLog.find()
                    .sort({ createdAt: -1 })
                    .limit(1000)
                    .populate('websiteId', 'name url')
                    .lean();
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid export type' });
        }

        res.json({
            success: true,
            data: {
                type,
                exportedAt: new Date().toISOString(),
                count: data.length,
                records: data
            }
        });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ ACTIVITY LOG ============

// @route   GET /api/admin/activity
router.get('/activity', adminAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        const recentPings = await PingLog.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('websiteId', 'name url');

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email createdAt');

        res.json({
            success: true,
            data: {
                pings: recentPings,
                newUsers: recentUsers
            }
        });
    } catch (error) {
        console.error('Activity error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
