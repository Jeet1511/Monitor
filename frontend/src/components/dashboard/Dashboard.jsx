import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { dashboardAPI, websitesAPI } from '../../utils/api';
import {
    Globe,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    Plus,
    ArrowRight,
    RefreshCw,
    Zap,
    AlertTriangle,
    Bell,
    BarChart3,
    Timer,
    ExternalLink,
    PlayCircle,
    PauseCircle
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const [statsData, activityData] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getActivity().catch(() => ({ data: { activity: [] } }))
            ]);
            setStats(statsData.data.stats);
            setWebsites(statsData.data.recentWebsites || []);
            setActivity(activityData.data?.activity || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleQuickPing = async (websiteId) => {
        try {
            await websitesAPI.ping(websiteId);
            fetchData();
        } catch (error) {
            console.error('Ping failed:', error);
        }
    };

    const statCards = stats ? [
        { icon: Globe, label: 'Total Websites', value: stats.totalWebsites, color: 'var(--primary)' },
        { icon: Activity, label: 'Active Monitoring', value: stats.activeWebsites, color: 'var(--accent)' },
        { icon: CheckCircle2, label: 'Sites Up', value: stats.upWebsites, color: 'var(--success)' },
        { icon: XCircle, label: 'Sites Down', value: stats.downWebsites, color: 'var(--error)' },
        { icon: TrendingUp, label: 'Avg Uptime', value: `${stats.averageUptime}%`, color: 'var(--success)' },
        { icon: Zap, label: 'Pings (24h)', value: stats.recentPings, color: 'var(--warning)' }
    ] : [];

    const downWebsites = websites.filter(w => w.lastStatus === 'down');

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-center" style={{ minHeight: '400px' }}>
                    <div className="loading-spinner" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Monitor your websites and track uptime</p>
                </div>
                <div className="flex gap-md">
                    <button className="btn btn-secondary" onClick={() => fetchData(true)} disabled={refreshing}>
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <Link to="/websites" className="btn btn-primary">
                        <Plus size={18} />
                        Add Website
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                            <stat.icon size={24} style={{ color: stat.color }} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alerts Section - Show if any sites are down */}
            {downWebsites.length > 0 && (
                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    padding: 'var(--spacing-lg)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-xl)'
                }}>
                    <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <AlertTriangle size={24} style={{ color: 'var(--error)' }} />
                        <h3 style={{ color: 'var(--error)' }}>⚠️ {downWebsites.length} Site(s) Down</h3>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                        {downWebsites.map(site => (
                            <Link
                                key={site._id}
                                to={`/websites/${site._id}`}
                                style={{
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--error-light)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}
                            >
                                {site.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions & Recent Activity */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: 'var(--spacing-xl)',
                marginTop: 'var(--spacing-xl)'
            }}>
                {/* Quick Actions */}
                <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <Zap size={20} style={{ color: 'var(--warning)' }} />
                        <h3 style={{ fontSize: '1.1rem' }}>Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        <Link to="/websites" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            <Plus size={18} />
                            Add New Website
                        </Link>
                        <Link to="/settings" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            <BarChart3 size={18} />
                            View Analytics
                        </Link>
                        <button
                            className="btn btn-secondary"
                            style={{ justifyContent: 'flex-start' }}
                            onClick={() => fetchData(true)}
                        >
                            <RefreshCw size={18} />
                            Refresh All Data
                        </button>
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <BarChart3 size={20} style={{ color: 'var(--accent)' }} />
                        <h3 style={{ fontSize: '1.1rem' }}>Performance Summary</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-secondary)' }}>Overall Health</span>
                            <span style={{
                                fontWeight: 600,
                                color: stats?.downWebsites === 0 ? 'var(--success)' : 'var(--warning)'
                            }}>
                                {stats?.downWebsites === 0 ? '✓ All Systems Operational' : `⚠ ${stats?.downWebsites} Issue(s)`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-secondary)' }}>Average Response</span>
                            <span style={{ fontWeight: 600 }}>{stats?.averageResponseTime || '--'}ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-secondary)' }}>Last Check</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Just now</span>
                        </div>
                        <div style={{
                            marginTop: 'var(--spacing-sm)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Uptime Score</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    flex: 1,
                                    height: 8,
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-full)',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${stats?.averageUptime || 0}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--success), var(--accent))',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{stats?.averageUptime || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Websites */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Your Websites</h2>
                    <Link to="/websites" className="flex items-center gap-xs" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                {websites.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <Globe size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No websites yet</h3>
                        <p style={{ marginBottom: 'var(--spacing-lg)' }}>Add your first website to start monitoring</p>
                        <Link to="/websites" className="btn btn-primary">
                            <Plus size={18} />
                            Add Website
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-md)' }}>
                        {websites.slice(0, 6).map((website) => (
                            <div key={website._id} className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <div className="flex justify-between items-start" style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="flex items-center gap-sm">
                                            <h4>{website.name}</h4>
                                            <span className={`status-dot ${website.lastStatus}`} />
                                        </div>
                                        <a
                                            href={website.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-xs"
                                            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}
                                        >
                                            {website.url.substring(0, 30)}{website.url.length > 30 ? '...' : ''}
                                            <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Uptime</div>
                                        <div style={{ fontWeight: 600, color: website.uptime >= 99 ? 'var(--success)' : 'var(--warning)' }}>
                                            {website.uptime}%
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Response</div>
                                        <div style={{ fontWeight: 600 }}>{website.lastResponseTime || '--'}ms</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Interval</div>
                                        <div style={{ fontWeight: 600 }}>{website.pingInterval}m</div>
                                    </div>
                                </div>

                                <div className="flex gap-sm">
                                    <Link to={`/websites/${website._id}`} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}>
                                        View Details
                                    </Link>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '10px' }}
                                        onClick={() => handleQuickPing(website._id)}
                                        title="Quick Ping"
                                    >
                                        <Zap size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
