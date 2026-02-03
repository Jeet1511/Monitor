import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    AlertTriangle, Search, CheckCircle, XCircle, Shield,
    Clock, Eye, Trash2, Bell, RefreshCw, Filter
} from 'lucide-react';

const AdminSecurityAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setTimeout(() => {
            setAlerts([
                { id: 1, type: 'brute_force', title: 'Brute Force Attempt Detected', description: 'Multiple failed login attempts from IP 192.168.1.100', severity: 'high', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false, resolved: false },
                { id: 2, type: 'suspicious_activity', title: 'Unusual Login Pattern', description: 'User logged in from new location: Tokyo, Japan', severity: 'medium', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true, resolved: false },
                { id: 3, type: 'rate_limit', title: 'Rate Limit Exceeded', description: 'API rate limit exceeded for endpoint /api/websites', severity: 'low', timestamp: new Date(Date.now() - 14400000).toISOString(), read: true, resolved: true },
                { id: 4, type: 'ssl_expiry', title: 'SSL Certificate Expiring', description: 'SSL certificate for api.sitemonitor.com expires in 7 days', severity: 'high', timestamp: new Date(Date.now() - 86400000).toISOString(), read: false, resolved: false },
                { id: 5, type: 'permission_change', title: 'Admin Permission Changed', description: 'Super Admin changed permissions for user admin@example.com', severity: 'info', timestamp: new Date(Date.now() - 172800000).toISOString(), read: true, resolved: true },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'var(--error)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--accent)';
            default: return 'var(--primary)';
        }
    };

    const markAsRead = (id) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    };

    const resolveAlert = (id) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, read: true } : a));
    };

    const dismissAlert = (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const filteredAlerts = alerts.filter(a => {
        if (filter === 'unread' && a.read) return false;
        if (filter === 'unresolved' && a.resolved) return false;
        if (filter === 'high' && a.severity !== 'high') return false;
        return true;
    });

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <AlertTriangle size={28} style={{ color: 'var(--warning)' }} /> Security Alerts
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Monitor and respond to security events</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </header>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>{alerts.filter(a => a.severity === 'high' && !a.resolved).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Critical</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{alerts.filter(a => !a.read).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unread</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{alerts.filter(a => !a.resolved).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unresolved</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{alerts.filter(a => a.resolved).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Resolved</div>
                    </div>
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    {['all', 'unread', 'unresolved', 'high'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: filter === f ? 'var(--primary)' : 'var(--bg-glass)',
                                color: filter === f ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {f === 'high' ? 'High Priority' : f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading security alerts...</p>
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <Shield size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Alerts</h3>
                        <p style={{ color: 'var(--text-muted)' }}>All clear! No security concerns at this time.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {filteredAlerts.map((alert) => (
                            <div key={alert.id} style={{
                                background: alert.read ? 'var(--bg-glass)' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)',
                                borderRadius: '12px',
                                border: `1px solid ${alert.read ? 'var(--border-color)' : 'rgba(99, 102, 241, 0.3)'}`,
                                borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <AlertTriangle size={18} style={{ color: getSeverityColor(alert.severity) }} />
                                        <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{alert.title}</h4>
                                        {!alert.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                                        <span style={{
                                            background: `${getSeverityColor(alert.severity)}20`,
                                            color: getSeverityColor(alert.severity),
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>{alert.severity}</span>
                                        {alert.resolved && (
                                            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>RESOLVED</span>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>{alert.description}</p>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={12} /> {new Date(alert.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {!alert.read && (
                                        <button onClick={() => markAsRead(alert.id)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer' }} title="Mark as read">
                                            <Eye size={14} />
                                        </button>
                                    )}
                                    {!alert.resolved && (
                                        <button onClick={() => resolveAlert(alert.id)} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem', borderRadius: '6px', color: 'var(--success)', cursor: 'pointer' }} title="Resolve">
                                            <CheckCircle size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => dismissAlert(alert.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem', borderRadius: '6px', color: 'var(--error)', cursor: 'pointer' }} title="Dismiss">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminSecurityAlerts;
