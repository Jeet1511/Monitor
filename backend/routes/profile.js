const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/profile
// @desc    Get full user profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -security.twoFactorSecret');

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    body('company').optional().trim().isLength({ max: 100 }),
    body('bio').optional().trim().isLength({ max: 500 }),
    body('timezone').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, phone, company, bio, timezone, avatar } = req.body;
        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (company !== undefined) user.company = company;
        if (bio !== undefined) user.bio = bio;
        if (timezone) user.timezone = timezone;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    company: user.company,
                    bio: user.bio,
                    timezone: user.timezone,
                    avatar: user.avatar,
                    plan: user.plan,
                    type: 'user'
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/profile/password
// @desc    Change password
// @access  Private
router.put('/password', auth, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 12);
        user.security.lastPasswordChange = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/profile/notifications
// @desc    Update notification preferences
// @access  Private
router.put('/notifications', auth, async (req, res) => {
    try {
        const { email, webhook, alertThreshold } = req.body;
        const user = await User.findById(req.user._id);

        if (email) {
            user.notifications.email = { ...user.notifications.email, ...email };
        }
        if (webhook) {
            user.notifications.webhook = { ...user.notifications.webhook, ...webhook };
        }
        if (alertThreshold !== undefined) {
            user.notifications.alertThreshold = alertThreshold;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Notification preferences updated',
            data: { notifications: user.notifications }
        });
    } catch (error) {
        console.error('Update notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/profile/security
// @desc    Update security settings (2FA, etc.)
// @access  Private
router.put('/security', auth, async (req, res) => {
    try {
        const { twoFactorEnabled } = req.body;
        const user = await User.findById(req.user._id);

        if (twoFactorEnabled !== undefined) {
            user.security.twoFactorEnabled = twoFactorEnabled;
            // Note: In production, generate actual 2FA secret with speakeasy/otplib
            if (twoFactorEnabled) {
                user.security.twoFactorSecret = 'DEMO_SECRET_' + Date.now();
            } else {
                user.security.twoFactorSecret = null;
            }
        }

        await user.save();

        res.json({
            success: true,
            message: 'Security settings updated',
            data: {
                security: {
                    twoFactorEnabled: user.security.twoFactorEnabled,
                    lastPasswordChange: user.security.lastPasswordChange
                }
            }
        });
    } catch (error) {
        console.error('Update security error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/profile
// @desc    Delete user account
// @access  Private
router.delete('/', auth, [
    body('password').notEmpty().withMessage('Password is required to delete account')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { password } = req.body;
        const user = await User.findById(req.user._id);

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Password is incorrect'
            });
        }

        // Delete user's websites and logs
        const Website = require('../models/Website');
        const PingLog = require('../models/PingLog');

        const websites = await Website.find({ userId: user._id });
        for (const website of websites) {
            await PingLog.deleteMany({ websiteId: website._id });
        }
        await Website.deleteMany({ userId: user._id });
        await user.deleteOne();

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
