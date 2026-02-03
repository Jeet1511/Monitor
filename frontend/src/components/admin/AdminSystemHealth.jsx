import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Server, Cpu, HardDrive, Database, Activity, Wifi,
    Clock, RefreshCw, CheckCircle, XCircle, AlertTriangle,
    MemoryStick, Zap
} from 'lucide-react';
import './AdminDashboard.css';

const AdminSystemHealth = () => {
    const [systemData, setSystemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSystemData = async (silent = false) => {
        if (!silent) setRefreshing(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/stats/system', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSystemData(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch system data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSystemData();
        // Auto-refresh every 10 seconds
        const interval = setInterval(() => fetchSystemData(true), 10000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (value, thresholds = { good: 50, warning: 75 }) => {
        if (value < thresholds.good) return 'var(--success)';
        if (value < thresholds.warning) return 'var(--warning)';
        return 'var(--error)';
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

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
                        <Server size={32} />
                        System Health
                    </h1>
                    <p className="admin-subtitle">Real-time server monitoring and diagnostics</p>
                </div>
                <button
                    onClick={() => fetchSystemData()}
                    className="admin-btn admin-btn-primary"
                    disabled={refreshing}
                >
                    <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Health Status Grid */}
            <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {/* CPU Usage */}
                <div className="admin-card">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: `linear-gradient(135deg, ${getStatusColor(systemData?.cpu?.usage || 0)}, rgba(0,0,0,0.3))` }}>
                            <Cpu size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <div className="admin-stat-value" style={{ color: getStatusColor(systemData?.cpu?.usage || 0) }}>
                                {systemData?.cpu?.usage || 0}%
                            </div>
                            <div className="admin-stat-label">CPU Usage</div>
                            <div className="admin-stat-sub">{systemData?.cpu?.cores || 0} cores • {systemData?.cpu?.model?.split(' ').slice(0, 3).join(' ') || 'Unknown'}</div>
                        </div>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 'var(--spacing-md)' }}>
                        <div
                            className="progress-fill"
                            style={{
                                width: `${systemData?.cpu?.usage || 0}%`,
                                background: getStatusColor(systemData?.cpu?.usage || 0)
                            }}
                        />
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="admin-card">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: `linear-gradient(135deg, ${getStatusColor(systemData?.memory?.usedPercent || 0)}, rgba(0,0,0,0.3))` }}>
                            <MemoryStick size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <div className="admin-stat-value" style={{ color: getStatusColor(systemData?.memory?.usedPercent || 0) }}>
                                {systemData?.memory?.usedPercent || 0}%
                            </div>
                            <div className="admin-stat-label">Memory Usage</div>
                            <div className="admin-stat-sub">
                                {formatBytes(systemData?.memory?.used)} / {formatBytes(systemData?.memory?.total)}
                            </div>
                        </div>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 'var(--spacing-md)' }}>
                        <div
                            className="progress-fill"
                            style={{
                                width: `${systemData?.memory?.usedPercent || 0}%`,
                                background: getStatusColor(systemData?.memory?.usedPercent || 0)
                            }}
                        />
                    </div>
                </div>

                {/* Server Uptime */}
                <div className="admin-card">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, var(--success), rgba(0,0,0,0.3))' }}>
                            <Clock size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <div className="admin-stat-value" style={{ color: 'var(--success)' }}>
                                {systemData?.process?.uptimeFormatted || '0m'}
                            </div>
                            <div className="admin-stat-label">Server Uptime</div>
                            <div className="admin-stat-sub">PID: {systemData?.process?.pid || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Database Status */}
                <div className="admin-card">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon" style={{
                            background: systemData?.database?.connected
                                ? 'linear-gradient(135deg, var(--success), rgba(0,0,0,0.3))'
                                : 'linear-gradient(135deg, var(--error), rgba(0,0,0,0.3))'
                        }}>
                            <Database size={24} />
                        </div>
                        <div className="admin-stat-content">
                            <div className="admin-stat-value" style={{
                                color: systemData?.database?.connected ? 'var(--success)' : 'var(--error)'
                            }}>
                                {systemData?.database?.connected ? 'Connected' : 'Disconnected'}
                            </div>
                            <div className="admin-stat-label">Database</div>
                            <div className="admin-stat-sub">{systemData?.database?.readyState || 'Unknown'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Details */}
            <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 'var(--spacing-xl)' }}>
                {/* Server Info */}
                <div className="admin-card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>
                        <Server size={20} />
                        Server Information
                    </h3>
                    <div className="detail-list">
                        <div className="detail-item">
                            <span className="detail-label">Platform</span>
                            <span className="detail-value">{systemData?.os?.platform || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Hostname</span>
                            <span className="detail-value">{systemData?.os?.hostname || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">OS Type</span>
                            <span className="detail-value">{systemData?.os?.type || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Node.js Version</span>
                            <span className="detail-value">{systemData?.process?.nodeVersion || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">CPU Load Average</span>
                            <span className="detail-value">
                                {systemData?.cpu?.loadAvg?.map(l => l.toFixed(2)).join(' / ') || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Process Info */}
                <div className="admin-card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>
                        <Zap size={20} />
                        Process Information
                    </h3>
                    <div className="detail-list">
                        <div className="detail-item">
                            <span className="detail-label">Process ID</span>
                            <span className="detail-value">{systemData?.process?.pid || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Heap Used</span>
                            <span className="detail-value">{formatBytes(systemData?.process?.memoryUsage?.heapUsed)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Heap Total</span>
                            <span className="detail-value">{formatBytes(systemData?.process?.memoryUsage?.heapTotal)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">External Memory</span>
                            <span className="detail-value">{formatBytes(systemData?.process?.memoryUsage?.external)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">RSS</span>
                            <span className="detail-value">{formatBytes(systemData?.process?.memoryUsage?.rss)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Status */}
            <div className="admin-card" style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>
                    <Activity size={20} />
                    Service Status
                </h3>
                <div className="service-grid">
                    {[
                        { name: 'API Server', status: true, icon: Server },
                        { name: 'Database', status: systemData?.database?.connected, icon: Database },
                        { name: 'Ping Service', status: true, icon: Wifi },
                        { name: 'Authentication', status: true, icon: CheckCircle },
                    ].map((service, i) => (
                        <div key={i} className="service-item" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: service.status ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: service.status ? 'var(--success)' : 'var(--error)'
                            }}>
                                <service.icon size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{service.name}</div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: service.status ? 'var(--success)' : 'var(--error)'
                                }}>
                                    {service.status ? 'Operational' : 'Down'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSystemHealth;
