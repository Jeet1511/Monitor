const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const Website = require('../models/Website');

// Admin auth middleware
const adminAuth = async (req, res, next) => {
    try {
        const jwt = require('jsonwebtoken');
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin only' });
        }

        const admin = await Admin.findById(decoded.adminId);
        if (!admin || !admin.isActive) {
            return res.status(401).json({ success: false, message: 'Invalid admin' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token invalid' });
    }
};

// System Settings Model (in-memory for now, can be moved to DB)
let systemSettings = {
    // General
    siteName: 'Site Monitor Pro',
    siteDescription: 'Professional website monitoring platform',
    maintenanceMode: false,
    registrationEnabled: true,

    // Monitoring Defaults
    defaultPingInterval: 5,
    defaultTimeout: 30,
    maxWebsitesPerUser: {
        free: 5,
        starter: 15,
        pro: 50,
        enterprise: 999
    },

    // Rate Limiting
    rateLimitWindow: 15, // minutes
    rateLimitMax: 100,
    authRateLimitMax: 10,

    // Notifications
    emailEnabled: true,
    webhookEnabled: true,
    slackEnabled: true,
    discordEnabled: true,

    // Keep-Alive
    keepAliveEnabled: true,
    keepAliveInterval: 1, // minutes

    // API
    apiRateLimit: 1000, // requests per hour
    apiKeysEnabled: true,

    // UI
    defaultTheme: 'dark',
    compactMode: false,
    animationsEnabled: true
};

// @route   GET /api/admin/settings
// @desc    Get all system settings
// @access  Admin
router.get('/', adminAuth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: { settings: systemSettings }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Admin
router.put('/', adminAuth, async (req, res) => {
    try {
        const updates = req.body;

        // Merge updates into settings
        Object.keys(updates).forEach(key => {
            if (systemSettings.hasOwnProperty(key)) {
                systemSettings[key] = updates[key];
            }
        });

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: { settings: systemSettings }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings/maintenance
// @desc    Toggle maintenance mode
// @access  Admin
router.put('/maintenance', adminAuth, async (req, res) => {
    try {
        const { enabled, message } = req.body;
        systemSettings.maintenanceMode = enabled;
        systemSettings.maintenanceMessage = message || 'We are currently performing maintenance. Please check back soon.';

        res.json({
            success: true,
            message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`,
            data: {
                maintenanceMode: systemSettings.maintenanceMode,
                maintenanceMessage: systemSettings.maintenanceMessage
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings/registration
// @desc    Toggle user registration
// @access  Admin
router.put('/registration', adminAuth, async (req, res) => {
    try {
        const { enabled } = req.body;
        systemSettings.registrationEnabled = enabled;

        res.json({
            success: true,
            message: `Registration ${enabled ? 'enabled' : 'disabled'}`,
            data: { registrationEnabled: systemSettings.registrationEnabled }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings/limits
// @desc    Update user limits
// @access  Admin
router.put('/limits', adminAuth, async (req, res) => {
    try {
        const { plan, maxWebsites } = req.body;

        if (systemSettings.maxWebsitesPerUser.hasOwnProperty(plan)) {
            systemSettings.maxWebsitesPerUser[plan] = maxWebsites;
        }

        res.json({
            success: true,
            message: 'Limits updated',
            data: { maxWebsitesPerUser: systemSettings.maxWebsitesPerUser }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings/notifications
// @desc    Update notification settings
// @access  Admin
router.put('/notifications', adminAuth, async (req, res) => {
    try {
        const { emailEnabled, webhookEnabled, slackEnabled, discordEnabled } = req.body;

        if (emailEnabled !== undefined) systemSettings.emailEnabled = emailEnabled;
        if (webhookEnabled !== undefined) systemSettings.webhookEnabled = webhookEnabled;
        if (slackEnabled !== undefined) systemSettings.slackEnabled = slackEnabled;
        if (discordEnabled !== undefined) systemSettings.discordEnabled = discordEnabled;

        res.json({
            success: true,
            message: 'Notification settings updated',
            data: {
                emailEnabled: systemSettings.emailEnabled,
                webhookEnabled: systemSettings.webhookEnabled,
                slackEnabled: systemSettings.slackEnabled,
                discordEnabled: systemSettings.discordEnabled
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings/rate-limits
// @desc    Update rate limiting settings
// @access  Admin
router.put('/rate-limits', adminAuth, async (req, res) => {
    try {
        const { window, max, authMax, apiLimit } = req.body;

        if (window !== undefined) systemSettings.rateLimitWindow = window;
        if (max !== undefined) systemSettings.rateLimitMax = max;
        if (authMax !== undefined) systemSettings.authRateLimitMax = authMax;
        if (apiLimit !== undefined) systemSettings.apiRateLimit = apiLimit;

        res.json({
            success: true,
            message: 'Rate limits updated',
            data: {
                rateLimitWindow: systemSettings.rateLimitWindow,
                rateLimitMax: systemSettings.rateLimitMax,
                authRateLimitMax: systemSettings.authRateLimitMax,
                apiRateLimit: systemSettings.apiRateLimit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings/keep-alive
// @desc    Update keep-alive settings
// @access  Admin
router.put('/keep-alive', adminAuth, async (req, res) => {
    try {
        const { enabled, interval } = req.body;

        if (enabled !== undefined) systemSettings.keepAliveEnabled = enabled;
        if (interval !== undefined) systemSettings.keepAliveInterval = interval;

        res.json({
            success: true,
            message: 'Keep-alive settings updated',
            data: {
                keepAliveEnabled: systemSettings.keepAliveEnabled,
                keepAliveInterval: systemSettings.keepAliveInterval
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/admin/settings/ui-options
// @desc    Get UI customization options
// @access  Admin
router.get('/ui-options', adminAuth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                options: {
                    themes: ['dark', 'light', 'system'],
                    defaultViews: ['cards', 'table', 'compact'],
                    rowsPerPage: [10, 25, 50, 100],
                    refreshIntervals: [10, 30, 60, 300],
                    dateFormats: ['relative', 'absolute', 'iso'],
                    timezones: ['UTC', 'local', 'custom']
                },
                current: {
                    defaultTheme: systemSettings.defaultTheme,
                    compactMode: systemSettings.compactMode,
                    animationsEnabled: systemSettings.animationsEnabled
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/admin/settings/ui
// @desc    Update UI settings
// @access  Admin
router.put('/ui', adminAuth, async (req, res) => {
    try {
        const { defaultTheme, compactMode, animationsEnabled } = req.body;

        if (defaultTheme !== undefined) systemSettings.defaultTheme = defaultTheme;
        if (compactMode !== undefined) systemSettings.compactMode = compactMode;
        if (animationsEnabled !== undefined) systemSettings.animationsEnabled = animationsEnabled;

        res.json({
            success: true,
            message: 'UI settings updated',
            data: {
                defaultTheme: systemSettings.defaultTheme,
                compactMode: systemSettings.compactMode,
                animationsEnabled: systemSettings.animationsEnabled
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
