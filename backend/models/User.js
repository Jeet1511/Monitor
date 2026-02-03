const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Info
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },

    // Extended Profile
    avatar: {
        type: String,
        default: null // URL to avatar image
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters'],
        default: null
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: null
    },
    timezone: {
        type: String,
        default: 'UTC'
    },

    // Notification Preferences
    notifications: {
        email: {
            enabled: { type: Boolean, default: true },
            onDown: { type: Boolean, default: true },
            onUp: { type: Boolean, default: true },
            onSSLExpiry: { type: Boolean, default: true },
            dailyReport: { type: Boolean, default: false },
            weeklyReport: { type: Boolean, default: true }
        },
        webhook: {
            enabled: { type: Boolean, default: false },
            url: { type: String, default: null },
            type: { type: String, enum: ['discord', 'slack', 'custom'], default: 'custom' }
        },
        alertThreshold: {
            type: Number,
            default: 2, // Number of consecutive failures before alert
            min: 1,
            max: 10
        }
    },

    // Security Settings
    security: {
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorSecret: { type: String, default: null },
        lastPasswordChange: { type: Date, default: null },
        failedLoginAttempts: { type: Number, default: 0 },
        lockoutUntil: { type: Date, default: null }
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },

    // Plan & Limits
    plan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'free'
    },
    limits: {
        maxWebsites: { type: Number, default: 5 },
        minInterval: { type: Number, default: 5 }, // minutes
        maxTeamMembers: { type: Number, default: 1 }
    }
}, {
    timestamps: true,
    collection: 'users'
});

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ plan: 1 });

// Virtual for website count (populated when needed)
userSchema.virtual('websiteCount', {
    ref: 'Website',
    localField: '_id',
    foreignField: 'userId',
    count: true
});

module.exports = mongoose.model('User', userSchema);
