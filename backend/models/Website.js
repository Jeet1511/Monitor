const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Basic Info
    name: {
        type: String,
        required: [true, 'Website name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: null
    },

    // Monitoring Configuration
    monitoring: {
        interval: {
            type: Number,
            enum: [1, 5, 15, 30, 60], // minutes
            default: 5
        },
        timeout: {
            type: Number,
            min: 5,
            max: 60,
            default: 30 // seconds
        },
        method: {
            type: String,
            enum: ['GET', 'HEAD', 'POST'],
            default: 'GET'
        },
        followRedirects: {
            type: Boolean,
            default: true
        },
        maxRedirects: {
            type: Number,
            default: 5,
            max: 10
        }
    },

    // Expected Response
    expected: {
        statusCodes: {
            type: [Number],
            default: [200, 201, 204, 301, 302]
        },
        contentMatch: {
            type: String,
            default: null // Text to find in response body
        },
        maxResponseTime: {
            type: Number,
            default: 5000 // ms - warning threshold
        }
    },

    // Custom Headers
    headers: [{
        key: { type: String, required: true },
        value: { type: String, required: true }
    }],

    // SSL Monitoring
    ssl: {
        enabled: { type: Boolean, default: true },
        expiryDate: { type: Date, default: null },
        issuer: { type: String, default: null },
        daysUntilExpiry: { type: Number, default: null },
        warningThreshold: { type: Number, default: 14 } // days
    },

    // Tags & Organization
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['production', 'staging', 'development', 'api', 'other'],
        default: 'production'
    },
    priority: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium'
    },

    // Keep-Alive Mode (for Replit, Render, Railway, etc.)
    keepAlive: {
        enabled: { type: Boolean, default: false },
        platform: {
            type: String,
            enum: ['replit', 'render', 'railway', 'glitch', 'heroku', 'other'],
            default: 'other'
        },
        lastPing: { type: Date, default: null },
        pingCount: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['awake', 'sleeping', 'unknown'],
            default: 'unknown'
        },
        // Aggressive pinging for keep-alive (every 1-2 minutes)
        aggressiveMode: { type: Boolean, default: true }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastStatus: {
        type: String,
        enum: ['up', 'down', 'pending', 'maintenance'],
        default: 'pending'
    },
    lastChecked: {
        type: Date,
        default: null
    },
    lastResponseTime: {
        type: Number,
        default: null
    },
    lastResponseSize: {
        type: Number,
        default: null // bytes
    },
    lastStatusCode: {
        type: Number,
        default: null
    },

    // Uptime Statistics
    stats: {
        uptimePercent24h: { type: Number, default: 100 },
        uptimePercent7d: { type: Number, default: 100 },
        uptimePercent30d: { type: Number, default: 100 },
        avgResponseTime24h: { type: Number, default: 0 },
        avgResponseTime7d: { type: Number, default: 0 },
        totalChecks: { type: Number, default: 0 },
        totalDowntime: { type: Number, default: 0 }, // minutes
        lastIncident: { type: Date, default: null }
    },

    // Alert Configuration
    alerting: {
        enabled: { type: Boolean, default: true },
        consecutiveFailures: { type: Number, default: 2 },
        currentFailures: { type: Number, default: 0 },
        lastAlertSent: { type: Date, default: null },
        cooldownMinutes: { type: Number, default: 15 }
    },

    // Maintenance Mode
    maintenance: {
        enabled: { type: Boolean, default: false },
        startTime: { type: Date, default: null },
        endTime: { type: Date, default: null },
        reason: { type: String, default: null }
    },

    // Performance Score (calculated)
    performanceScore: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'F'],
        default: 'A'
    }
}, {
    timestamps: true,
    collection: 'websites'
});

// Indexes
websiteSchema.index({ userId: 1 });
websiteSchema.index({ lastStatus: 1 });
websiteSchema.index({ isActive: 1 });
websiteSchema.index({ tags: 1 });
websiteSchema.index({ category: 1 });
websiteSchema.index({ priority: 1 });

// Calculate performance score before save
websiteSchema.pre('save', function (next) {
    const uptime = this.stats.uptimePercent24h;
    const responseTime = this.stats.avgResponseTime24h;

    // Score based on uptime and response time
    if (uptime >= 99.9 && responseTime < 500) {
        this.performanceScore = 'A';
    } else if (uptime >= 99.5 && responseTime < 1000) {
        this.performanceScore = 'B';
    } else if (uptime >= 99 && responseTime < 2000) {
        this.performanceScore = 'C';
    } else if (uptime >= 95) {
        this.performanceScore = 'D';
    } else {
        this.performanceScore = 'F';
    }

    next();
});

module.exports = mongoose.model('Website', websiteSchema);
