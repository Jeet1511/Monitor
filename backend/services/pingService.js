const cron = require('node-cron');
const axios = require('axios');
const Website = require('../models/Website');
const PingLog = require('../models/PingLog');

class PingService {
    constructor() {
        this.jobs = {};
        this.isRunning = false;
    }

    async pingWebsite(website) {
        const startTime = Date.now();

        try {
            const response = await axios.get(website.url, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'SiteMonitor/1.0 (https://sitemonitor.app)'
                },
                validateStatus: () => true
            });

            const responseTime = Date.now() - startTime;
            const isUp = response.status >= 200 && response.status < 400;

            // Update website
            website.lastChecked = new Date(); // Fixed from lastPinged
            website.lastStatus = isUp ? 'up' : 'down';
            website.lastResponseTime = responseTime;
            website.stats.totalChecks = (website.stats.totalChecks || 0) + 1; // Fixed from totalPings
            website.lastStatusCode = response.status;

            // Note: complex uptime calculation removed as calculateUptime() is not defined
            // We can rely on a separate aggregation job for statistics

            await website.save();

            // Create log
            await PingLog.create({
                websiteId: website._id,
                status: isUp ? 'up' : 'down',
                statusCode: response.status,
                responseTime
            });

            console.log(`✅ Pinged ${website.url} - Status: ${isUp ? 'UP' : 'DOWN'} (${responseTime}ms)`);
            return { success: true, status: isUp ? 'up' : 'down', responseTime };
        } catch (error) {
            const responseTime = Date.now() - startTime;

            website.lastChecked = new Date(); // Fixed from lastPinged
            website.lastStatus = 'down';
            website.lastResponseTime = responseTime;
            website.stats.totalChecks = (website.stats.totalChecks || 0) + 1; // Fixed from totalPings

            // Note: complex uptime calculation removed as calculateUptime() is not defined

            await website.save();

            await PingLog.create({
                websiteId: website._id,
                status: 'down',
                responseTime,
                errorMessage: error.message
            });

            console.log(`❌ Ping failed for ${website.url} - Error: ${error.message}`);
            return { success: false, status: 'down', error: error.message };
        }
    }

    async pingAllWebsites(interval) {
        try {
            const websites = await Website.find({
                isActive: true,
                pingInterval: interval
            });

            console.log(`🔄 Running ${interval}-minute ping cycle for ${websites.length} websites...`);

            for (const website of websites) {
                await this.pingWebsite(website);
                // Small delay between pings to avoid overwhelming
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`Ping cycle error (${interval}min):`, error);
        }
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️ Ping service is already running');
            return;
        }

        console.log('🚀 Starting ping service...');

        // Every 1 minute - Keep-Alive aggressive mode (for Replit, Render, etc.)
        this.jobs['1min'] = cron.schedule('*/1 * * * *', async () => {
            await this.pingKeepAliveWebsites();
        });

        // Every 5 minutes
        this.jobs['5min'] = cron.schedule('*/5 * * * *', async () => {
            await this.pingAllWebsites(5);
        });

        // Every 15 minutes
        this.jobs['15min'] = cron.schedule('*/15 * * * *', async () => {
            await this.pingAllWebsites(15);
        });

        // Every 30 minutes
        this.jobs['30min'] = cron.schedule('*/30 * * * *', async () => {
            await this.pingAllWebsites(30);
        });

        // Every 60 minutes
        this.jobs['60min'] = cron.schedule('0 * * * *', async () => {
            await this.pingAllWebsites(60);
        });

        this.isRunning = true;
        console.log('✅ Ping service started - Monitoring active websites');
        console.log('🔋 Keep-Alive mode active - Pinging Replit/Render/Railway projects every 1-2 min');

        // Run initial ping for all websites
        this.runInitialPing();
    }

    // Special fast ping for keep-alive websites (Replit, Render, etc.)
    async pingKeepAliveWebsites() {
        try {
            const websites = await Website.find({
                isActive: true,
                'keepAlive.enabled': true,
                'keepAlive.aggressiveMode': true,
                'maintenance.enabled': { $ne: true }
            });

            if (websites.length === 0) return;

            console.log(`🔋 Keep-Alive ping for ${websites.length} websites...`);

            for (const website of websites) {
                try {
                    const startTime = Date.now();
                    const response = await axios.get(website.url, {
                        timeout: 15000,
                        headers: { 'User-Agent': 'SiteMonitor-KeepAlive/1.0' },
                        validateStatus: () => true
                    });

                    const responseTime = Date.now() - startTime;
                    const isUp = response.status >= 200 && response.status < 400;

                    // Update keep-alive status
                    website.keepAlive.lastPing = new Date();
                    website.keepAlive.pingCount = (website.keepAlive.pingCount || 0) + 1;
                    website.keepAlive.status = isUp ? 'awake' : 'sleeping';
                    website.lastStatus = isUp ? 'up' : 'down';
                    website.lastChecked = new Date();
                    website.lastResponseTime = responseTime;
                    await website.save();

                    console.log(`🔋 [${website.keepAlive.platform}] ${website.name} - ${isUp ? 'AWAKE' : 'SLEEPING'} (${responseTime}ms)`);
                } catch (error) {
                    website.keepAlive.lastPing = new Date();
                    website.keepAlive.status = 'sleeping';
                    website.lastStatus = 'down';
                    await website.save();
                    console.log(`⚠️ Keep-alive failed for ${website.name}: ${error.message}`);
                }

                // Small delay between pings
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (error) {
            console.error('Keep-alive ping cycle error:', error);
        }
    }

    async runInitialPing() {
        console.log('🔄 Running initial ping for all active websites...');
        try {
            const websites = await Website.find({ isActive: true });
            for (const website of websites) {
                await this.pingWebsite(website);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            console.log('✅ Initial ping completed');
        } catch (error) {
            console.error('Initial ping error:', error);
        }
    }

    stop() {
        if (!this.isRunning) {
            console.log('⚠️ Ping service is not running');
            return;
        }

        Object.values(this.jobs).forEach(job => job.stop());
        this.jobs = {};
        this.isRunning = false;
        console.log('🛑 Ping service stopped');
    }
}

// Singleton instance
const pingService = new PingService();

module.exports = pingService;
