const mongoose = require('mongoose');

const pingLogSchema = new mongoose.Schema({
    websiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website',
        required: true
    },
    status: {
        type: String,
        enum: ['up', 'down'],
        required: true
    },
    statusCode: {
        type: Number,
        default: null
    },
    responseTime: {
        type: Number, // milliseconds
        default: null
    },
    errorMessage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
pingLogSchema.index({ websiteId: 1, createdAt: -1 });

// Auto-delete logs older than 30 days
pingLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('PingLog', pingLogSchema);
