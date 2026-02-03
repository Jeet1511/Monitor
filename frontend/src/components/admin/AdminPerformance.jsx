import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    TrendingUp, RefreshCw, Cpu, HardDrive, Activity,
    Clock, Zap, Server, Database, Wifi, ArrowUp, ArrowDown
} from 'lucide-react';

const AdminPerformance = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Generate mock performance data
        setTimeout(() => {
            setMetrics({
                cpu: Math.floor(Math.random() * 40) + 20,
                memory: Math.floor(Math.random() * 30) + 50,
                disk: Math.floor(Math.random() * 20) + 30,
                network: Math.floor(Math.random() * 100) + 50,
                responseTime: Math.floor(Math.random() * 100) + 50,
                uptime: '99.98%',
                requests: {
                    total: Math.floor(Math.random() * 10000) + 5000,
                    perSecond: Math.floor(Math.random() * 100) + 20,
                    avgTime: Math.floor(Math.random() * 200) + 50
                },
                database: {
                    connections: Math.floor(Math.random() * 50) + 10,
                    queries: Math.floor(Math.random() * 1000) + 500,
                    avgQueryTime: Math.floor(Math.random() * 50) + 5
                },
                history: Array.from({ length: 24 }, (_, i) => ({
                    hour: i,
                    cpu: Math.floor(Math.random() * 40) + 20,
                    memory: Math.floor(Math.random() * 30) + 50,
                    requests: Math.floor(Math.random() * 500) + 100
                }))
            });
            setLoading(false);
        }, 500);
    }, []);

    const MetricCard = ({ icon: Icon, label, value, unit, color, trend }) => (
        <div style={{
            background: 'var(--bg-glass)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: `${color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Icon size={24} style={{ color }} />
                </div>
                {trend && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        color: trend > 0 ? 'var(--success)' : 'var(--error)',
                        fontSize: '0.8rem'
                    }}>
                        {trend > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {value}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>{unit}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: color, width: `${Math.min(value, 100)}%`, borderRadius: '2px' }} />
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <TrendingUp size={28} style={{ color: 'var(--primary)' }} /> Performance Metrics
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Real-time system performance and resource utilization</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading performance metrics...</p>
                    </div>
                ) : (
                    <>
                        {/* Main Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            <MetricCard icon={Cpu} label="CPU Usage" value={metrics.cpu} unit="%" color="var(--primary)" trend={-5} />
                            <MetricCard icon={HardDrive} label="Memory Usage" value={metrics.memory} unit="%" color="var(--accent)" trend={2} />
                            <MetricCard icon={Database} label="Disk Usage" value={metrics.disk} unit="%" color="var(--warning)" />
                            <MetricCard icon={Wifi} label="Network I/O" value={metrics.network} unit="MB/s" color="var(--success)" trend={12} />
                        </div>

                        {/* Secondary Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                    <Activity size={18} /> Request Statistics
                                </h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Total Requests (24h)</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{metrics.requests.total.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Requests/Second</span>
                                        <span style={{ fontWeight: 600, color: 'var(--success)' }}>{metrics.requests.perSecond}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Avg Response Time</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{metrics.requests.avgTime}ms</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                    <Database size={18} /> Database Performance
                                </h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Active Connections</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{metrics.database.connections}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Queries/Min</span>
                                        <span style={{ fontWeight: 600, color: 'var(--success)' }}>{metrics.database.queries}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Avg Query Time</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{metrics.database.avgQueryTime}ms</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                    <Server size={18} /> System Status
                                </h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Uptime</span>
                                        <span style={{ fontWeight: 600, color: 'var(--success)' }}>{metrics.uptime}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Response Time</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{metrics.responseTime}ms</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Health Status</span>
                                        <span style={{ fontWeight: 600, color: 'var(--success)' }}>● Healthy</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simple Chart Visualization */}
                        <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                                24-Hour Resource Usage
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '150px' }}>
                                {metrics.history.map((h, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <div style={{
                                            width: '100%',
                                            height: `${h.cpu}px`,
                                            background: 'linear-gradient(to top, var(--primary), rgba(99, 102, 241, 0.5))',
                                            borderRadius: '2px 2px 0 0'
                                        }} title={`CPU: ${h.cpu}%`} />
                                        {i % 4 === 0 && (
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{h.hour}:00</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPerformance;
