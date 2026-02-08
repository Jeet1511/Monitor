const AuditLog = require('../models/AuditLog');

/**
 * Audit Logger Middleware
 * Automatically logs all admin actions for security and compliance
 */
const auditLogger = async (req, res, next) => {
    // Store original json method
    const originalJson = res.json;

    // Override res.json to capture response
    res.json = function (data) {
        // Restore original method
        res.json = originalJson;

        // Log the action asynchronously (don't block response)
        setImmediate(async () => {
            try {
                // Only log write operations and important reads
                const shouldLog =
                    req.method !== 'GET' ||
                    req.path.includes('/export') ||
                    req.path.includes('/stats/comprehensive');

                if (!shouldLog) return;

                // Determine action type based on method and path
                const action = determineAction(req.method, req.path);
                if (!action) return;

                // Extract resource info
                const { resourceType, resourceId, resourceName } = extractResourceInfo(req);

                // Create audit log
                await AuditLog.create({
                    action,
                    resourceType,
                    resourceId,
                    resourceName,
                    actorType: req.admin ? 'admin' : (req.user ? 'user' : 'system'),
                    actorId: req.admin?._id || req.user?._id,
                    actorName: req.admin?.name || req.user?.name,
                    actorEmail: req.admin?.email || req.user?.email,
                    ipAddress: req.clientIp || 'unknown',
                    ipGeolocation: req.ipGeolocation,
                    userAgent: req.headers['user-agent'],
                    method: req.method,
                    endpoint: req.originalUrl,
                    details: sanitizeDetails(req.body, req.params, req.query),
                    status: res.statusCode < 400 ? 'success' : 'failure',
                    errorMessage: res.statusCode >= 400 ? data.message : null
                });
            } catch (error) {
                console.error('Audit Log Error:', error);
            }
        });

        // Send original response
        return originalJson.call(this, data);
    };

    next();
};

/**
 * Determine action type from request
 */
function determineAction(method, path) {
    // Login/Logout
    if (path.includes('/login')) return method === 'POST' ? 'LOGIN' : null;
    if (path.includes('/logout')) return 'LOGOUT';

    // Users
    if (path.includes('/users')) {
        if (method === 'POST') return 'CREATE_USER';
        if (method === 'PUT' || method === 'PATCH') return 'UPDATE_USER';
        if (method === 'DELETE') return 'DELETE_USER';
        if (path.includes('/suspend')) return 'SUSPEND_USER';
        if (path.includes('/activate')) return 'ACTIVATE_USER';
    }

    // Websites
    if (path.includes('/websites')) {
        if (method === 'POST' && !path.includes('/ping')) return 'CREATE_WEBSITE';
        if (method === 'PUT' || method === 'PATCH') return 'UPDATE_WEBSITE';
        if (method === 'DELETE') return 'DELETE_WEBSITE';
        if (path.includes('/ping') || path.includes('/force-ping')) return 'PING_WEBSITE';
    }

    // Admins
    if (path.includes('/admins')) {
        if (method === 'POST') return 'CREATE_ADMIN';
        if (method === 'PUT' || method === 'PATCH') return 'UPDATE_ADMIN';
        if (method === 'DELETE') return 'DELETE_ADMIN';
    }

    // Bulk operations
    if (path.includes('/bulk')) return 'BULK_OPERATION';

    // Export
    if (path.includes('/export')) return 'EXPORT_DATA';

    // System actions
    if (path.includes('/stats/comprehensive')) return 'SYSTEM_ACTION';

    return null;
}

/**
 * Extract resource information from request
 */
function extractResourceInfo(req) {
    const path = req.path;
    const body = req.body;
    const params = req.params;

    let resourceType = 'system';
    let resourceId = null;
    let resourceName = null;

    if (path.includes('/users')) {
        resourceType = 'user';
        resourceId = params.id || params.userId || body.userId;
        resourceName = body.name || body.email;
    } else if (path.includes('/websites')) {
        resourceType = 'website';
        resourceId = params.id || params.websiteId || body.websiteId;
        resourceName = body.name || body.url;
    } else if (path.includes('/admins')) {
        resourceType = 'admin';
        resourceId = params.id || params.adminId || body.adminId;
        resourceName = body.name || body.email;
    }

    return { resourceType, resourceId, resourceName };
}

/**
 * Sanitize sensitive data from logs
 */
function sanitizeDetails(body, params, query) {
    const sanitized = { ...body, ...params, ...query };

    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    delete sanitized.apiKey;

    return sanitized;
}

module.exports = auditLogger;
