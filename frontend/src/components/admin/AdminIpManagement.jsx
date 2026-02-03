import { useState } from 'react';
import AdminLayout from './AdminLayout';
import {
    Lock, Plus, Search, Ban, CheckCircle, Trash2,
    Globe, Shield, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';

const AdminIpManagement = () => {
    const [blockedIps, setBlockedIps] = useState([
        { id: 1, ip: '192.168.1.100', reason: 'Brute force attempt', blockedAt: new Date(Date.now() - 86400000).toISOString(), expiresAt: null, attempts: 15 },
        { id: 2, ip: '10.0.0.50', reason: 'Suspicious activity', blockedAt: new Date(Date.now() - 172800000).toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString(), attempts: 8 },
        { id: 3, ip: '203.45.67.89', reason: 'Manual block', blockedAt: new Date(Date.now() - 604800000).toISOString(), expiresAt: null, attempts: 0 },
    ]);
    const [whitelistedIps, setWhitelistedIps] = useState([
        { id: 1, ip: '127.0.0.1', label: 'Localhost', addedAt: new Date(Date.now() - 30 * 86400000).toISOString() },
        { id: 2, ip: '10.0.0.1', label: 'Office Network', addedAt: new Date(Date.now() - 60 * 86400000).toISOString() },
    ]);
    const [newIp, setNewIp] = useState('');
    const [showBlockModal, setShowBlockModal] = useState(false);

    const unblockIp = (id) => {
        if (confirm('Unblock this IP address?')) {
            setBlockedIps(prev => prev.filter(ip => ip.id !== id));
        }
    };

    const blockIp = () => {
        if (!newIp.trim()) return alert('Please enter an IP address');
        const reason = prompt('Enter reason for blocking:') || 'Manual block';
        setBlockedIps(prev => [...prev, {
            id: Date.now(),
            ip: newIp,
            reason,
            blockedAt: new Date().toISOString(),
            expiresAt: null,
            attempts: 0
        }]);
        setNewIp('');
        setShowBlockModal(false);
    };

    const removeWhitelist = (id) => {
        if (confirm('Remove this IP from whitelist?')) {
            setWhitelistedIps(prev => prev.filter(ip => ip.id !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <Lock size={28} style={{ color: 'var(--error)' }} /> IP Management
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage blocked and whitelisted IP addresses</p>
                    </div>
                    <button
                        onClick={() => setShowBlockModal(true)}
                        style={{ background: 'var(--error)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <Ban size={16} /> Block IP
                    </button>
                </header>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>{blockedIps.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Blocked IPs</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{whitelistedIps.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Whitelisted IPs</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{blockedIps.filter(ip => ip.expiresAt && new Date(ip.expiresAt) > new Date()).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Temporary Blocks</div>
                    </div>
                </div>

                {/* Blocked IPs */}
                <div style={{ background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Ban size={18} style={{ color: 'var(--error)' }} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Blocked IP Addresses</h3>
                    </div>
                    {blockedIps.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Shield size={32} style={{ marginBottom: '0.5rem' }} />
                            <p>No blocked IP addresses</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>IP ADDRESS</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>REASON</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>BLOCKED</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>EXPIRES</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blockedIps.map((ip) => (
                                    <tr key={ip.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <code style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--error)', fontFamily: 'monospace' }}>{ip.ip}</code>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{ip.reason}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(ip.blockedAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{ip.expiresAt ? new Date(ip.expiresAt).toLocaleDateString() : 'Never'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => unblockIp(ip.id)}
                                                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1rem', borderRadius: '6px', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                                            >
                                                <CheckCircle size={14} /> Unblock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Whitelisted IPs */}
                <div style={{ background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={18} style={{ color: 'var(--success)' }} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Whitelisted IP Addresses</h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {whitelistedIps.map((ip) => (
                                <div key={ip.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <code style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--success)', fontFamily: 'monospace' }}>{ip.ip}</code>
                                        <span style={{ color: 'var(--text-secondary)' }}>{ip.label}</span>
                                    </div>
                                    <button
                                        onClick={() => removeWhitelist(ip.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Block Modal */}
                {showBlockModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowBlockModal(false)}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', width: '400px' }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Block IP Address</h3>
                            <input
                                type="text"
                                placeholder="Enter IP address (e.g., 192.168.1.100)"
                                value={newIp}
                                onChange={e => setNewIp(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', marginBottom: '1.5rem', fontFamily: 'monospace' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setShowBlockModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={blockIp} style={{ flex: 1, padding: '0.75rem', background: 'var(--error)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Block IP</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminIpManagement;
