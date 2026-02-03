import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    BarChart3, TrendingUp, Users, Globe, Activity, Download,
    RefreshCw, Calendar, ChevronDown, PieChart, ArrowUp, ArrowDown
} from 'lucide-react';
import './AdminDashboard.css';

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');
    const [stats, setStats] = useState(null);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/stats/comprehensive', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
        <div className="admin-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: `linear-gradient(135deg, ${color}, ${color}40)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} color="white" />
                </div>
                {change !== undefined && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: changeType === 'up' ? 'var(--success)' : 'var(--error)'
                    }}>
                        {changeType === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {change}%
                    </div>
                )}
            </div>
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {value}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {title}
                </div>
            </div>
        </div>
    );

    const ChartCard = ({ title, children }) => (
        <div className="admin-card">
            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
                {title}
            </h3>
            {children}
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">
                        <BarChart3 size={32} />
                        Analytics
                    </h1>
                    <p className="admin-subtitle">Platform performance metrics and insights</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button onClick={fetchAnalytics} className="admin-btn admin-btn-primary">
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                    <button className="admin-btn">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 'var(--spacing-xl)' }}>
                <StatCard
                    icon={Users}
                    title="Total Users"
                    value={stats?.users?.total || 0}
                    change={stats?.users?.newWeek || 0}
                    changeType="up"
                    color="var(--primary)"
                />
                <StatCard
                    icon={Globe}
                    title="Active Websites"
                    value={stats?.websites?.active || 0}
                    change={12}
                    changeType="up"
                    color="var(--success)"
                />
                <StatCard
                    icon={Activity}
                    title="Pings (24h)"
                    value={stats?.pings?.total24h || 0}
                    change={stats?.pings?.successRate24h || 100}
                    changeType="up"
                    color="var(--accent)"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Uptime Rate"
                    value={`${stats?.pings?.successRate24h || 100}%`}
                    changeType="up"
                    color="var(--warning)"
                />
            </div>

            {/* Charts Row */}
            <div className="admin-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                {/* User Growth Chart */}
                <ChartCard title="User Growth">
                    <div style={{ height: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: 'var(--spacing-md)' }}>
                        {[30, 45, 60, 42, 55, 70, 85].map((height, i) => (
                            <div key={i} style={{
                                width: '10%',
                                height: `${height}%`,
                                background: 'linear-gradient(to top, var(--primary), rgba(99, 102, 241, 0.5))',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.3s ease'
                            }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', padding: 'var(--spacing-sm)', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </ChartCard>

                {/* Distribution Pie */}
                <ChartCard title="Website Status Distribution">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-lg)' }}>
                        {/* Simple visual representation */}
                        <div style={{
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            background: `conic-gradient(
                                var(--success) 0deg ${(stats?.websites?.up / (stats?.websites?.total || 1)) * 360}deg,
                                var(--error) ${(stats?.websites?.up / (stats?.websites?.total || 1)) * 360}deg ${((stats?.websites?.up + stats?.websites?.down) / (stats?.websites?.total || 1)) * 360}deg,
                                var(--warning) ${((stats?.websites?.up + stats?.websites?.down) / (stats?.websites?.total || 1)) * 360}deg 360deg
                            )`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: 'var(--bg-card)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {stats?.websites?.total || 0}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--success)' }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Up ({stats?.websites?.up || 0})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--error)' }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Down ({stats?.websites?.down || 0})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--warning)' }} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending ({stats?.websites?.pending || 0})</span>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Additional Metrics */}
            <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* User Plan Distribution */}
                <ChartCard title="User Plans">
                    <div style={{ padding: 'var(--spacing-md)' }}>
                        {Object.entries(stats?.users?.byPlan || { free: 0 }).map(([plan, count]) => (
                            <div key={plan} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--spacing-sm) 0',
                                borderBottom: '1px solid var(--border-color)'
                            }}>
                                <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize', fontWeight: 500 }}>
                                    {plan || 'Free'}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{ width: 100, height: 8, borderRadius: 4, background: 'var(--bg-glass)' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${(count / (stats?.users?.total || 1)) * 100}%`,
                                            background: 'var(--primary)',
                                            borderRadius: 4
                                        }} />
                                    </div>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', minWidth: 30 }}>
                                        {count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Response Time Distribution */}
                <ChartCard title="Ping Statistics">
                    <div style={{ padding: 'var(--spacing-md)' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-sm) 0',
                            borderBottom: '1px solid var(--border-color)'
                        }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Total Pings (24h)</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats?.pings?.total24h || 0}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-sm) 0',
                            borderBottom: '1px solid var(--border-color)'
                        }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Successful</span>
                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>{stats?.pings?.successful24h || 0}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-sm) 0',
                            borderBottom: '1px solid var(--border-color)'
                        }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Failed</span>
                            <span style={{ color: 'var(--error)', fontWeight: 600 }}>{stats?.pings?.failed24h || 0}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-sm) 0',
                            borderBottom: '1px solid var(--border-color)'
                        }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Avg Response Time</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats?.pings?.avgResponseTime || 0}ms</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-sm) 0'
                        }}>
                            <span style={{ color: 'var(--text-secondary)' }}>All Time Pings</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats?.pings?.totalAllTime || 0}</span>
                        </div>
                    </div>
                </ChartCard>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;
