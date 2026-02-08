import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import {
    Users, Globe, Activity, TrendingUp, TrendingDown, RefreshCw,
    Clock, Server, Zap, AlertTriangle, CheckCircle, XCircle,
    ArrowUp, ArrowDown, Minus, Eye, Download
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
    Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { adminAPI } from '../../utils/api';
import './AdvancedAdminDashboard.css';

const AdvancedAdminDashboard = () => {
    const { admin } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login');
            return;
        }
        fetchStats();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [admin]);

    const fetchStats = async () => {
        try {
            setRefreshing(true);
            const response = await adminAPI.getComprehensiveStats();

            console.log('Stats Response:', response);

            // Backend returns {success: true, data: {users: {...}, websites: {...}, ...}}
            // Stats are DIRECTLY in response.data, not in response.data.stats
            if (!response || !response.data) {
                throw new Error('Invalid response structure from API');
            }

            setStats(response.data);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status
            });

            // Show more specific error to user
            if (error.message?.includes('<!DOCTYPE')) {
                console.error('Received HTML instead of JSON - API endpoint may not exist or auth failed');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-center">
                    <div className="loading-spinner" />
                    <p>Loading advanced analytics...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!stats) {
        return (
            <AdminLayout>
                <div className="error-state">
                    <AlertTriangle size={48} />
                    <h2>Failed to load dashboard</h2>
                    <button className="btn btn-primary" onClick={fetchStats}>
                        Retry
                    </button>
                </div>
            </AdminLayout>
        );
    }

    // Chart data transformations with safe defaults
    const userGrowthData = Array.isArray(stats.userGrowth?.daily)
        ? stats.userGrowth.daily.slice(-7).map((item, idx) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx % 7],
            users: item?.count || 0
        }))
        : [
            { day: 'Mon', users: 0 },
            { day: 'Tue', users: 0 },
            { day: 'Wed', users: 0 },
            { day: 'Thu', users: 0 },
            { day: 'Fri', users: 0 },
            { day: 'Sat', users: 0 },
            { day: 'Sun', users: 0 }
        ];

    const websiteStatusData = [
        { name: 'Up', value: stats.websites?.up || 0, color: '#10b981' },
        { name: 'Down', value: stats.websites?.down || 0, color: '#ef4444' },
        { name: 'Pending', value: stats.websites?.pending || 0, color: '#f59e0b' }
    ];

    const pingPerformanceData = Array.isArray(stats.pingPerformance?.hourly)
        ? stats.pingPerformance.hourly.slice(-12).map((item, idx) => ({
            hour: `${idx}h`,
            successful: item?.successful || 0,
            failed: item?.failed || 0
        }))
        : Array.from({ length: 12 }, (_, i) => ({
            hour: `${i}h`,
            successful: 0,
            failed: 0
        }));

    const responseTimeData = Array.isArray(stats.performance?.responseTime?.history)
        ? stats.performance.responseTime.history.slice(-10).map((item, idx) => ({
            timestamp: `T${idx}`,
            avgTime: item?.avg || 0
        }))
        : Array.from({ length: 10 }, (_, i) => ({
            timestamp: `T${i}`,
            avgTime: 0
        }));

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Calculate trends with safe defaults
    const getTrend = (current, previous) => {
        if (!current || !previous || previous === 0) return { value: 0, direction: 'neutral' };
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    };

    const userTrend = getTrend(stats.users?.total || 0, stats.users?.totalLastWeek || 0);
    const websiteTrend = getTrend(stats.websites?.total || 0, stats.websites?.totalLastWeek || 0);
    const uptimeTrend = getTrend(stats.websites?.avgUptime || 100, stats.websites?.avgUptimeLastWeek || 100);

    return (
        <AdminLayout>
            <div className="advanced-dashboard">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Analytics Dashboard</h1>
                        <p className="subtitle">
                            Real-time platform insights and performance metrics
                        </p>
                    </div>
                    <div className="header-actions">
                        <div className="last-update">
                            <Clock size={16} />
                            <span>Updated {Math.floor((Date.now() - lastUpdate) / 1000)}s ago</span>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={fetchStats}
                            disabled={refreshing}
                        >
                            <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                            Refresh
                        </button>
                        <button className="btn btn-primary" onClick={() => console.log('Export clicked')}>
                            <Download size={16} />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="metrics-grid">
                    <MetricCard
                        title="Total Users"
                        value={stats.users?.total || 0}
                        icon={<Users />}
                        trend={userTrend}
                        color="blue"
                        subtitle={`${stats.users?.active || 0} active`}
                    />
                    <MetricCard
                        title="Active Websites"
                        value={stats.websites?.total || 0}
                        icon={<Globe />}
                        trend={websiteTrend}
                        color="green"
                        subtitle={`${stats.websites?.up || 0} online`}
                    />
                    <MetricCard
                        title="Pings (24h)"
                        value={stats.pings?.total24h || 0}
                        icon={<Activity />}
                        trend={{ value: stats.pings?.successRate24h || 100, direction: 'up' }}
                        color="purple"
                        subtitle={`${stats.pings?.successRate24h || 100}% success rate`}
                    />
                    <MetricCard
                        title="Avg Uptime"
                        value={`${(stats.websites?.avgUptime || 100).toFixed(1)}%`}
                        icon={<Zap />}
                        trend={uptimeTrend}
                        color="orange"
                        subtitle="Last 30 days"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>User Growth (Last 7 Days)</h3>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ background: '#3b82f6' }} />
                                    <span>New Users</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={userGrowthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Website Status Distribution</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={websiteStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {websiteStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Ping Performance (Last 12 Hours)</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={pingPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="hour" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="successful" fill="#10b981" name="Successful" />
                                <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Average Response Time</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={responseTimeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="timestamp" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="avgTime"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    dot={{ fill: '#8b5cf6', r: 4 }}
                                    name="Avg Time (ms)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System Health */}
                <div className="system-health-grid">
                    <div className="health-card">
                        <div className="health-icon success">
                            <Server size={24} />
                        </div>
                        <div className="health-info">
                            <h4>Server Status</h4>
                            <p className="health-value">Healthy</p>
                            <p className="health-detail">Uptime: {formatUptime(stats.system?.uptime || 0)}</p>
                        </div>
                    </div>

                    <div className="health-card">
                        <div className="health-icon success">
                            <Activity size={24} />
                        </div>
                        <div className="health-info">
                            <h4>Memory Usage</h4>
                            <p className="health-value">{Math.round(stats.system?.memory?.usedPercent || 0)}%</p>
                            <p className="health-detail">
                                {formatBytes(stats.system?.memory?.used || 0)} / {formatBytes(stats.system?.memory?.total || 0)}
                            </p>
                        </div>
                    </div>

                    <div className="health-card">
                        <div className="health-icon success">
                            <Zap size={24} />
                        </div>
                        <div className="health-info">
                            <h4>CPU Load</h4>
                            <p className="health-value">{Math.round(stats.system?.cpu?.usage || 0)}%</p>
                            <p className="health-detail">{stats.system?.cpu?.cores || 0} cores</p>
                        </div>
                    </div>

                    <div className="health-card">
                        <div className={`health-icon ${(stats.issues?.websitesDown || 0) > 0 ? 'warning' : 'success'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="health-info">
                            <h4>Alerts</h4>
                            <p className="health-value">{stats.issues?.websitesDown || 0}</p>
                            <p className="health-detail">Websites down</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <button className="btn btn-secondary" onClick={() => console.log('View all clicked')}>
                            <Eye size={16} />
                            View All
                        </button>
                    </div>
                    <div className="activity-list">
                        {Array.isArray(stats.recent?.users) && stats.recent.users.length > 0 ? (
                            stats.recent.users.slice(0, 5).map((user, idx) => (
                                <div key={idx} className="activity-item">
                                    <div className="activity-icon success">
                                        <Users size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">New user registered</p>
                                        <p className="activity-detail">{user.name} ({user.email})</p>
                                    </div>
                                    <div className="activity-time">
                                        {formatTimeAgo(user.createdAt)}
                                    </div>
                                </div>
                            ))
                        ) : null}
                        {Array.isArray(stats.recent?.websites) && stats.recent.websites.length > 0 ? (
                            stats.recent.websites.slice(0, 5).map((website, idx) => (
                                <div key={idx} className="activity-item">
                                    <div className="activity-icon info">
                                        <Globe size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">New website added</p>
                                        <p className="activity-detail">{website.name}</p>
                                    </div>
                                    <div className="activity-time">
                                        {formatTimeAgo(website.createdAt)}
                                    </div>
                                </div>
                            ))
                        ) : null}
                        {(!stats.recent?.users?.length && !stats.recent?.websites?.length) && (
                            <div className="activity-item">
                                <div className="activity-content">
                                    <p className="activity-detail" style={{ color: 'var(--text-muted)' }}>
                                        No recent activity
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// Metric Card Component
const MetricCard = ({ title, value, icon, trend, color, subtitle }) => {
    const getTrendIcon = () => {
        if (trend.direction === 'up') return <ArrowUp size={16} />;
        if (trend.direction === 'down') return <ArrowDown size={16} />;
        return <Minus size={16} />;
    };

    const getTrendClass = () => {
        if (title.includes('Uptime') || title.includes('success')) {
            return trend.direction === 'up' ? 'trend-positive' : 'trend-negative';
        }
        return trend.direction === 'up' ? 'trend-positive' : trend.direction === 'down' ? 'trend-negative' : 'trend-neutral';
    };

    return (
        <div className={`metric-card metric-${color}`}>
            <div className="metric-icon">
                {icon}
            </div>
            <div className="metric-content">
                <p className="metric-title">{title}</p>
                <h2 className="metric-value">{value}</h2>
                {subtitle && <p className="metric-subtitle">{subtitle}</p>}
            </div>
            {trend && (
                <div className={`metric-trend ${getTrendClass()}`}>
                    {getTrendIcon()}
                    <span>{trend.value}%</span>
                </div>
            )}
        </div>
    );
};

// Helper functions
function formatUptime(seconds) {
    if (!seconds) return '0s';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function formatBytes(bytes) {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatTimeAgo(date) {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default AdvancedAdminDashboard;
