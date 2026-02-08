const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    // Action details
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
            'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'SUSPEND_USER', 'ACTIVATE_USER',
            'CREATE_WEBSITE', 'UPDATE_WEBSITE', 'DELETE_WEBSITE', 'PING_WEBSITE',
            'CREATE_ADMIN', 'UPDATE_ADMIN', 'DELETE_ADMIN',
            'EXPORT_DATA', 'BULK_OPERATION', 'SYSTEM_ACTION'
        ]
    },

    // Resource information
    resourceType: {
        type: String,
        enum: ['user', 'website', 'admin', 'system'],
        required: true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'resourceType'
    },
    resourceName: String,

    // Actor (who performed the action)
    actorType: {
        type: String,
        enum: ['admin', 'user', 'system'],
        default: 'admin'
    },
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'actorType'
    },
    actorName: String,
    actorEmail: String,

    // Request details
    ipAddress: {
        type: String,
        required: true
    },
    ipGeolocation: {
        country: String,
        region: String,
        city: String,
        timezone: String,
        latitude: Number,
        longitude: Number
    },
    userAgent: String,

    // HTTP request info
    method: String,
    endpoint: String,

    // Additional details
    details: mongoose.Schema.Types.Mixed,

    // Result
    status: {
        type: String,
        enum: ['success', 'failure', 'error'],
        default: 'success'
    },
    errorMessage: String,

    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ actorId: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ ipAddress: 1 });

// TTL index - automatically delete logs older than 90 days
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
