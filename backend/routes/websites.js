const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const Website = require('../models/Website');
const PingLog = require('../models/PingLog');
const auth = require('../middleware/auth');

// Helper function to ping a website immediately
const pingWebsiteNow = async (website) => {
    const startTime = Date.now();
    try {
        const response = await axios.get(website.url, {
            timeout: 30000,
            headers: { 'User-Agent': 'SiteMonitor/1.0' },
            validateStatus: () => true
        });

        const responseTime = Date.now() - startTime;
        const isUp = response.status >= 200 && response.status < 400;

        website.lastPinged = new Date();
        website.lastStatus = isUp ? 'up' : 'down';
        website.lastResponseTime = responseTime;
        website.totalPings += 1;
        if (isUp) website.successfulPings += 1;
        website.uptime = website.calculateUptime();
        await website.save();

        await PingLog.create({
            websiteId: website._id,
            status: isUp ? 'up' : 'down',
            statusCode: response.status,
            responseTime
        });

        console.log(`✅ Initial ping for ${website.url} - Status: ${isUp ? 'UP' : 'DOWN'} (${responseTime}ms)`);
        return { success: true, status: isUp ? 'up' : 'down', responseTime };
    } catch (error) {
        const responseTime = Date.now() - startTime;

        website.lastPinged = new Date();
        website.lastStatus = 'down';
        website.lastResponseTime = responseTime;
        website.totalPings += 1;
        website.uptime = website.calculateUptime();
        await website.save();

        await PingLog.create({
            websiteId: website._id,
            status: 'down',
            responseTime,
            errorMessage: error.message
        });

        console.log(`❌ Initial ping failed for ${website.url} - Error: ${error.message}`);
        return { success: false, status: 'down', error: error.message };
    }
};

// @route   GET /api/websites
// @desc    Get all websites for current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const websites = await Website.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { websites }
        });
    } catch (error) {
        console.error('Fetch websites error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/websites/:id
// @desc    Get single website with logs
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!website) {
            return res.status(404).json({
                success: false,
                message: 'Website not found'
            });
        }

        // Get recent ping logs
        const logs = await PingLog.find({ websiteId: website._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: { website, logs }
        });
    } catch (error) {
        console.error('Fetch website error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/websites
// @desc    Add new website
// @access  Private
router.post('/', auth, [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('url').isURL().withMessage('Please enter a valid URL'),
    body('pingInterval').isIn([5, 15, 30, 60]).withMessage('Invalid ping interval')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, url, pingInterval } = req.body;

        // Check for duplicate URL for this user
        const existingWebsite = await Website.findOne({
            userId: req.user._id,
            url
        });

        if (existingWebsite) {
            return res.status(400).json({
                success: false,
                message: 'This URL is already being monitored'
            });
        }

        const website = await Website.create({
            userId: req.user._id,
            name,
            url,
            pingInterval: pingInterval || 15
        });

        // Trigger immediate ping in background (don't wait for response)
        pingWebsiteNow(website).catch(err => console.error('Initial ping error:', err));

        res.status(201).json({
            success: true,
            message: 'Website added successfully',
            data: { website }
        });
    } catch (error) {
        console.error('Add website error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/websites/:id
// @desc    Update website
// @access  Private
router.put('/:id', auth, [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('pingInterval').optional().isIn([5, 15, 30, 60]).withMessage('Invalid ping interval'),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const website = await Website.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!website) {
            return res.status(404).json({
                success: false,
                message: 'Website not found'
            });
        }

        const { name, pingInterval, isActive } = req.body;

        if (name !== undefined) website.name = name;
        if (pingInterval !== undefined) website.pingInterval = pingInterval;
        if (isActive !== undefined) website.isActive = isActive;

        await website.save();

        res.json({
            success: true,
            message: 'Website updated',
            data: { website }
        });
    } catch (error) {
        console.error('Update website error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/websites/:id
// @desc    Delete website
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!website) {
            return res.status(404).json({
                success: false,
                message: 'Website not found'
            });
        }

        // Delete associated ping logs
        await PingLog.deleteMany({ websiteId: website._id });

        // Delete website
        await website.deleteOne();

        res.json({
            success: true,
            message: 'Website deleted'
        });
    } catch (error) {
        console.error('Delete website error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/websites/:id/ping
// @desc    Manually trigger ping for a website
// @access  Private
router.post('/:id/ping', auth, async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!website) {
            return res.status(404).json({
                success: false,
                message: 'Website not found'
            });
        }

        // Perform ping
        const axios = require('axios');
        const startTime = Date.now();

        try {
            const response = await axios.get(website.url, {
                timeout: 30000,
                validateStatus: () => true
            });

            const responseTime = Date.now() - startTime;
            const isUp = response.status >= 200 && response.status < 400;

            // Update website
            website.lastPinged = new Date();
            website.lastStatus = isUp ? 'up' : 'down';
            website.lastResponseTime = responseTime;
            website.totalPings += 1;
            if (isUp) website.successfulPings += 1;
            website.uptime = website.calculateUptime();
            await website.save();

            // Create log
            const log = await PingLog.create({
                websiteId: website._id,
                status: isUp ? 'up' : 'down',
                statusCode: response.status,
                responseTime
            });

            res.json({
                success: true,
                message: 'Ping completed',
                data: { website, log }
            });
        } catch (pingError) {
            const responseTime = Date.now() - startTime;

            website.lastPinged = new Date();
            website.lastStatus = 'down';
            website.lastResponseTime = responseTime;
            website.totalPings += 1;
            website.uptime = website.calculateUptime();
            await website.save();

            const log = await PingLog.create({
                websiteId: website._id,
                status: 'down',
                responseTime,
                errorMessage: pingError.message
            });

            res.json({
                success: true,
                message: 'Ping completed (site down)',
                data: { website, log }
            });
        }
    } catch (error) {
        console.error('Manual ping error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
