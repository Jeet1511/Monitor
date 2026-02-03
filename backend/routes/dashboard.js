const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Website = require('../models/Website');
const PingLog = require('../models/PingLog');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics for current user
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get websites count
        const totalWebsites = await Website.countDocuments({ userId });
        const activeWebsites = await Website.countDocuments({ userId, isActive: true });
        const upWebsites = await Website.countDocuments({ userId, lastStatus: 'up' });
        const downWebsites = await Website.countDocuments({ userId, lastStatus: 'down' });

        // Get websites with details
        const websites = await Website.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Calculate average uptime
        const allWebsites = await Website.find({ userId });
        const averageUptime = allWebsites.length > 0
            ? allWebsites.reduce((acc, w) => acc + w.uptime, 0) / allWebsites.length
            : 100;

        // Get recent ping logs count (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const websiteIds = allWebsites.map(w => w._id);
        const recentPings = await PingLog.countDocuments({
            websiteId: { $in: websiteIds },
            createdAt: { $gte: oneDayAgo }
        });

        res.json({
            success: true,
            data: {
                stats: {
                    totalWebsites,
                    activeWebsites,
                    upWebsites,
                    downWebsites,
                    averageUptime: Math.round(averageUptime * 100) / 100,
                    recentPings
                },
                recentWebsites: websites
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/dashboard/activity
// @desc    Get recent activity (ping logs)
// @access  Private
router.get('/activity', auth, async (req, res) => {
    try {
        const websites = await Website.find({ userId: req.user._id });
        const websiteIds = websites.map(w => w._id);

        const logs = await PingLog.find({ websiteId: { $in: websiteIds } })
            .populate('websiteId', 'name url')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: { activity: logs }
        });
    } catch (error) {
        console.error('Activity fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
