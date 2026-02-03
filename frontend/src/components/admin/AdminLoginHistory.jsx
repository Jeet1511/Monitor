import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    History, Search, Clock, User, Globe, Monitor,
    Smartphone, CheckCircle, XCircle, MapPin, RefreshCw
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminLoginHistory = () => {
    const [logins, setLogins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Generate mock login history
        setTimeout(() => {
            const mockLogins = Array.from({ length: 20 }, (_, i) => ({
                id: i + 1,
                user: {
                    name: ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Johnson', 'Mike Brown'][Math.floor(Math.random() * 5)],
                    email: ['john@example.com', 'jane@test.com', 'bob@demo.com', 'alice@mail.com', 'mike@site.com'][Math.floor(Math.random() * 5)]
                },
                timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString(),
                ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                location: ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Berlin, DE'][Math.floor(Math.random() * 5)],
                device: ['Windows PC', 'MacBook Pro', 'iPhone 14', 'Android Phone', 'iPad'][Math.floor(Math.random() * 5)],
                browser: ['Chrome 120', 'Safari 17', 'Firefox 121', 'Edge 120'][Math.floor(Math.random() * 4)],
                success: Math.random() > 0.2,
                failReason: Math.random() > 0.5 ? 'Wrong password' : 'Account locked'
            }));
            setLogins(mockLogins);
            setLoading(false);
        }, 500);
    }, []);

    const filteredLogins = logins.filter(login => {
        if (filter === 'success' && !login.success) return false;
        if (filter === 'failed' && login.success) return false;
        if (searchTerm && !login.user.name.toLowerCase().includes(searchTerm.toLowerCase()) && !login.user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <History size={28} style={{ color: 'var(--primary)' }} /> Login History
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Track user authentication attempts and sessions</p>
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
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{logins.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Logins (7d)</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{logins.filter(l => l.success).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Successful</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>{logins.filter(l => !l.success).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Failed</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{new Set(logins.map(l => l.user.email)).size}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unique Users</div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Search size={18} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by user..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '200px' }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                        <option value="all">All Logins</option>
                        <option value="success">Successful Only</option>
                        <option value="failed">Failed Only</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading login history...</p>
                    </div>
                ) : (
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>USER</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>TIME</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>LOCATION</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>DEVICE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogins.map((login) => (
                                    <tr key={login.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                                                    {login.user.name[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{login.user.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{login.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Clock size={14} />
                                                {new Date(login.timestamp).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <MapPin size={14} /> {login.location}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{login.ip}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ color: 'var(--text-secondary)' }}>{login.device}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{login.browser}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {login.success ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    <CheckCircle size={12} /> Success
                                                </span>
                                            ) : (
                                                <div>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        <XCircle size={12} /> Failed
                                                    </span>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{login.failReason}</div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminLoginHistory;
