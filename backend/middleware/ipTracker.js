const geoip = require('geoip-lite');

/**
 * IP Tracking Middleware
 * Extracts and attaches client IP address and geolocation to request object
 */
const ipTracker = (req, res, next) => {
    try {
        // Get IP address from various sources
        let ip = req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        // Handle IPv6 localhost
        if (ip === '::1' || ip === '::ffff:127.0.0.1') {
            ip = '127.0.0.1';
        }

        // If x-forwarded-for contains multiple IPs, take the first one
        if (ip && ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }

        // Remove IPv6 prefix if present
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.substring(7);
        }

        // Attach IP to request
        req.clientIp = ip || 'unknown';

        // Get geolocation data (only for non-local IPs)
        if (ip && ip !== '127.0.0.1' && ip !== 'localhost' && ip !== 'unknown') {
            const geo = geoip.lookup(ip);
            if (geo) {
                req.ipGeolocation = {
                    country: geo.country,
                    region: geo.region,
                    city: geo.city,
                    timezone: geo.timezone,
                    latitude: geo.ll ? geo.ll[0] : null,
                    longitude: geo.ll ? geo.ll[1] : null
                };
            }
        }

        next();
    } catch (error) {
        console.error('IP Tracker Error:', error);
        req.clientIp = 'error';
        next();
    }
};

module.exports = ipTracker;
