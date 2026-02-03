import { useState, useEffect } from 'react';
import { websitesAPI } from '../../utils/api';
import DashboardLayout from './DashboardLayout';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    Zap,
    Calendar,
    Download,
    RefreshCw,
    ChevronDown,
    Award
} from 'lucide-react';

const AnalyticsPage = () => {
    const [websites, setWebsites] = useState([]);
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        try {
            const data = await websitesAPI.getAll();
            setWebsites(data.data.websites || []);
            if (data.data.websites?.length > 0) {
                setSelectedWebsite(data.data.websites[0]);
            }
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        } finally {
            setLoading(false);
        }
    };

    const timeRanges = [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' }
    ];

    const getScoreColor = (score) => {
        const colors = {
            'A': '#10b981',
            'B': '#22d3ee',
            'C': '#f59e0b',
            'D': '#f97316',
            'F': '#ef4444'
        };
        return colors[score] || 'var(--text-muted)';
    };

    // Use real ping logs from API instead of fake data
    const [pingLogs, setPingLogs] = useState([]);

    // Fetch ping logs when selected website changes
    useEffect(() => {
        if (selectedWebsite?._id) {
            fetchPingLogs(selectedWebsite._id);
        }
    }, [selectedWebsite?._id, timeRange]);

    const fetchPingLogs = async (websiteId) => {
        try {
            const data = await websitesAPI.getOne(websiteId);
            setPingLogs(data.data.logs || []);
        } catch (error) {
            console.error('Failed to fetch ping logs:', error);
            setPingLogs([]);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-center">
                    <div className="loading-spinner"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Monitor performance trends and insights</p>
                </div>
                <div className="flex items-center gap-md">
                    <button className="btn btn-ghost" style={{ color: 'var(--text-primary)' }}>
                        <Download size={18} />
                        Export
                    </button>
                    <button onClick={fetchWebsites} className="btn btn-primary">
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Website Selector & Time Range */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
                flexWrap: 'wrap'
            }}>
                <div style={{ position: 'relative', minWidth: 250 }}>
                    <select
                        value={selectedWebsite?._id || ''}
                        onChange={(e) => setSelectedWebsite(websites.find(w => w._id === e.target.value))}
                        className="form-input"
                        style={{ paddingRight: 40, color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}
                    >
                        {websites.map(w => (
                            <option key={w._id} value={w._id} style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}>{w.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={18} style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none'
                    }} />
                </div>
                <div className="flex items-center gap-sm">
                    {timeRanges.map(range => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value)}
                            className={`btn ${timeRange === range.value ? 'btn-primary' : 'btn-ghost'}`}
                            style={{
                                padding: '8px 16px',
                                color: timeRange === range.value ? 'white' : 'var(--text-primary)'
                            }}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Performance Score Card */}
            {selectedWebsite && (
                <div className="card" style={{
                    marginBottom: 'var(--spacing-xl)',
                    background: 'linear-gradient(135deg, var(--bg-card), var(--bg-glass))',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {/* Performance Score */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-lg)',
                            padding: 'var(--spacing-lg)'
                        }}>
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: `conic-gradient(${getScoreColor(selectedWebsite.performanceScore || 'A')} ${(selectedWebsite.stats?.uptimePercent24h || 100)}%, var(--bg-glass) 0)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: 'var(--bg-card)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: getScoreColor(selectedWebsite.performanceScore || 'A')
                                }}>
                                    {selectedWebsite.performanceScore || 'A'}
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Performance Score</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {selectedWebsite.performanceScore === 'A' ? 'Excellent' :
                                        selectedWebsite.performanceScore === 'B' ? 'Good' :
                                            selectedWebsite.performanceScore === 'C' ? 'Fair' :
                                                selectedWebsite.performanceScore === 'D' ? 'Poor' : 'Critical'}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        {[
                            {
                                label: 'Uptime (24h)',
                                value: `${(selectedWebsite.stats?.uptimePercent24h || 100).toFixed(2)}%`,
                                icon: TrendingUp,
                                color: 'var(--success)'
                            },
                            {
                                label: 'Avg Response',
                                value: `${selectedWebsite.stats?.avgResponseTime24h || 0}ms`,
                                icon: Zap,
                                color: 'var(--accent)'
                            },
                            {
                                label: 'Total Checks',
                                value: selectedWebsite.stats?.totalChecks || 0,
                                icon: Activity,
                                color: 'var(--primary)'
                            },
                            {
                                label: 'Last Check',
                                value: selectedWebsite.lastChecked
                                    ? new Date(selectedWebsite.lastChecked).toLocaleTimeString()
                                    : 'Never',
                                icon: Clock,
                                color: 'var(--warning)'
                            }
                        ].map((stat, i) => (
                            <div key={i} style={{
                                padding: 'var(--spacing-lg)',
                                borderLeft: '1px solid var(--border-color)'
                            }}>
                                <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-xs)' }}>
                                    <stat.icon size={16} style={{ color: stat.color }} />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</span>
                                </div>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-xl)' }}>
                {/* Uptime Chart */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>Uptime History</h3>
                    {pingLogs.length === 0 ? (
                        <div style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            No ping data yet. Add websites and wait for monitoring.
                        </div>
                    ) : (
                        <div style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: 2,
                            padding: 'var(--spacing-md)'
                        }}>
                            {pingLogs.slice(0, 24).map((log, i) => (
                                <div
                                    key={log._id || i}
                                    style={{
                                        flex: 1,
                                        height: log.status === 'up' ? '100%' : '30%',
                                        background: log.status === 'up'
                                            ? 'linear-gradient(to top, var(--success), rgba(16, 185, 129, 0.5))'
                                            : 'linear-gradient(to top, var(--error), rgba(239, 68, 68, 0.5))',
                                        borderRadius: '4px 4px 0 0',
                                        minWidth: 4,
                                        transition: 'height 0.3s ease'
                                    }}
                                    title={`${log.status.toUpperCase()} - ${new Date(log.createdAt).toLocaleTimeString()}`}
                                />
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-between" style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderTop: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem'
                    }}>
                        <span>Recent pings</span>
                        <span>{pingLogs.length} total</span>
                    </div>
                </div>

                {/* Response Time Chart */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>Response Time</h3>
                    {pingLogs.length === 0 ? (
                        <div style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            No response time data yet.
                        </div>
                    ) : (
                        <div style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: 2,
                            padding: 'var(--spacing-md)'
                        }}>
                            {pingLogs.slice(0, 24).map((log, i) => (
                                <div
                                    key={log._id || i}
                                    style={{
                                        flex: 1,
                                        height: `${Math.min((log.responseTime || 0) / 500 * 100, 100)}%`,
                                        background: (log.responseTime || 0) < 200
                                            ? 'linear-gradient(to top, var(--accent), rgba(34, 211, 238, 0.5))'
                                            : (log.responseTime || 0) < 400
                                                ? 'linear-gradient(to top, var(--primary), rgba(99, 102, 241, 0.5))'
                                                : 'linear-gradient(to top, var(--warning), rgba(245, 158, 11, 0.5))',
                                        borderRadius: '4px 4px 0 0',
                                        minWidth: 4,
                                        transition: 'height 0.3s ease'
                                    }}
                                    title={`${log.responseTime || 0}ms - ${new Date(log.createdAt).toLocaleTimeString()}`}
                                />
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-between" style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderTop: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem'
                    }}>
                        {pingLogs.length > 0 ? (
                            <>
                                <span>Avg: {Math.round(pingLogs.reduce((a, b) => a + (b.responseTime || 0), 0) / pingLogs.length)}ms</span>
                                <span>Max: {Math.round(Math.max(...pingLogs.map(d => d.responseTime || 0)))}ms</span>
                            </>
                        ) : (
                            <>
                                <span>Avg: --ms</span>
                                <span>Max: --ms</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* All Websites Performance */}
            <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>All Websites Performance</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontWeight: 600 }}>Website</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontWeight: 600 }}>Score</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontWeight: 600 }}>Uptime</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontWeight: 600 }}>Response</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontWeight: 600 }}>Last Check</th>
                            </tr>
                        </thead>
                        <tbody>
                            {websites.map(website => (
                                <tr key={website._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{website.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{website.url}</p>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: website.lastStatus === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: website.lastStatus === 'up' ? 'var(--success)' : 'var(--error)'
                                        }}>
                                            {website.lastStatus?.toUpperCase() || 'PENDING'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: `${getScoreColor(website.performanceScore || 'A')}20`,
                                            color: getScoreColor(website.performanceScore || 'A'),
                                            fontWeight: 700
                                        }}>
                                            {website.performanceScore || 'A'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {(website.stats?.uptimePercent24h || 100).toFixed(2)}%
                                    </td>
                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
                                        {website.lastResponseTime || 0}ms
                                    </td>
                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                                        {website.lastChecked
                                            ? new Date(website.lastChecked).toLocaleTimeString()
                                            : 'Never'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AnalyticsPage;
