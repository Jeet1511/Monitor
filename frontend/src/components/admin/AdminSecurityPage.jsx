import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Lock, Shield, AlertTriangle, User, Globe, Clock, MapPin,
    RefreshCw, Check, X, Trash2, Eye, Ban, ChevronLeft, ChevronRight
} from 'lucide-react';
import './AdminDashboard.css';

const AdminSecurityPage = () => {
    const [activeTab, setActiveTab] = useState('logins');
    const [loginHistory, setLoginHistory] = useState([]);
    const [blockedIPs, setBlockedIPs] = useState([]);
    const [securityAlerts, setSecurityAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newIP, setNewIP] = useState('');

    // Mock data - in production would come from API
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoginHistory([
                { id: 1, user: 'test@email.com', ip: '192.168.1.1', location: 'New York, US', status: 'success', time: new Date() },
                { id: 2, user: 'admin@site.com', ip: '10.0.0.1', location: 'London, UK', status: 'success', time: new Date(Date.now() - 3600000) },
                { id: 3, user: 'unknown', ip: '203.45.67.89', location: 'Unknown', status: 'failed', time: new Date(Date.now() - 7200000) },
                { id: 4, user: 'test@email.com', ip: '192.168.1.1', location: 'New York, US', status: 'success', time: new Date(Date.now() - 86400000) },
            ]);
            setBlockedIPs([
                { id: 1, ip: '203.45.67.89', reason: 'Multiple failed logins', blockedAt: new Date(Date.now() - 86400000) },
                { id: 2, ip: '185.192.70.12', reason: 'Suspicious activity', blockedAt: new Date(Date.now() - 172800000) },
            ]);
            setSecurityAlerts([
                { id: 1, type: 'warning', message: '5 failed login attempts from IP 203.45.67.89', time: new Date(Date.now() - 3600000) },
                { id: 2, type: 'info', message: 'New admin account created', time: new Date(Date.now() - 86400000) },
                { id: 3, type: 'danger', message: 'Potential brute force attack detected', time: new Date(Date.now() - 7200000) },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleBlockIP = () => {
        if (newIP && /^(\d{1,3}\.){3}\d{1,3}$/.test(newIP)) {
            setBlockedIPs(prev => [...prev, {
                id: Date.now(),
                ip: newIP,
                reason: 'Manually blocked',
                blockedAt: new Date()
            }]);
            setNewIP('');
        }
    };

    const handleUnblockIP = (id) => {
        setBlockedIPs(prev => prev.filter(ip => ip.id !== id));
    };

    const formatDate = (date) => new Date(date).toLocaleString();

    const tabs = [
        { id: 'logins', label: 'Login History', icon: Clock },
        { id: 'ips', label: 'IP Management', icon: MapPin },
        { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle },
    ];

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">
                        <Shield size={32} />
                        Security Center
                    </h1>
                    <p className="admin-subtitle">Monitor login attempts, manage IPs, and view security alerts</p>
                </div>
                <button onClick={() => window.location.reload()} className="admin-btn admin-btn-primary">
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs" style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`admin-btn ${activeTab === tab.id ? 'admin-btn-primary' : ''}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: 'var(--spacing-sm) var(--spacing-lg)'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    {/* Login History Tab */}
                    {activeTab === 'logins' && (
                        <div className="admin-card">
                            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
                                Recent Login Attempts
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                        <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>User</th>
                                        <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>IP Address</th>
                                        <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Location</th>
                                        <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Status</th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loginHistory.map(login => (
                                        <tr key={login.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
                                                <div className="flex items-center gap-sm">
                                                    <User size={16} color="var(--text-secondary)" />
                                                    {login.user}
                                                </div>
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                                {login.ip}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                                                {login.location}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    background: login.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: login.status === 'success' ? 'var(--success)' : 'var(--error)'
                                                }}>
                                                    {login.status === 'success' ? 'Success' : 'Failed'}
                                                </span>
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                {formatDate(login.time)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* IP Management Tab */}
                    {activeTab === 'ips' && (
                        <div>
                            {/* Block IP Form */}
                            <div className="admin-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
                                    Block IP Address
                                </h3>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <input
                                        type="text"
                                        placeholder="Enter IP address (e.g., 192.168.1.1)"
                                        value={newIP}
                                        onChange={(e) => setNewIP(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--bg-glass)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-primary)',
                                            fontFamily: 'monospace'
                                        }}
                                    />
                                    <button onClick={handleBlockIP} className="admin-btn admin-btn-danger">
                                        <Ban size={16} />
                                        Block IP
                                    </button>
                                </div>
                            </div>

                            {/* Blocked IPs List */}
                            <div className="admin-card">
                                <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
                                    Blocked IP Addresses ({blockedIPs.length})
                                </h3>
                                {blockedIPs.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--text-secondary)' }}>
                                        No blocked IPs
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                                <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>IP Address</th>
                                                <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Reason</th>
                                                <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Blocked At</th>
                                                <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {blockedIPs.map(ip => (
                                                <tr key={ip.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--error)', fontFamily: 'monospace', fontWeight: 600 }}>
                                                        {ip.ip}
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                                                        {ip.reason}
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                        {formatDate(ip.blockedAt)}
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => handleUnblockIP(ip.id)}
                                                            className="admin-btn"
                                                            style={{ color: 'var(--success)' }}
                                                        >
                                                            <Check size={16} />
                                                            Unblock
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Security Alerts Tab */}
                    {activeTab === 'alerts' && (
                        <div className="admin-card">
                            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
                                Security Alerts
                            </h3>
                            {securityAlerts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--text-secondary)' }}>
                                    No security alerts
                                </div>
                            ) : (
                                <div className="alerts-list">
                                    {securityAlerts.map(alert => (
                                        <div
                                            key={alert.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--spacing-md)',
                                                padding: 'var(--spacing-md)',
                                                borderBottom: '1px solid var(--border-color)',
                                                background: alert.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                                            }}
                                        >
                                            <div style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: alert.type === 'danger' ? 'rgba(239, 68, 68, 0.2)'
                                                    : alert.type === 'warning' ? 'rgba(245, 158, 11, 0.2)'
                                                        : 'rgba(99, 102, 241, 0.2)',
                                                color: alert.type === 'danger' ? 'var(--error)'
                                                    : alert.type === 'warning' ? 'var(--warning)'
                                                        : 'var(--primary)',
                                                flexShrink: 0
                                            }}>
                                                <AlertTriangle size={18} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                                    {alert.message}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    {formatDate(alert.time)}
                                                </div>
                                            </div>
                                            <button className="admin-btn" style={{ color: 'var(--text-secondary)' }}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </AdminLayout>
    );
};

export default AdminSecurityPage;
