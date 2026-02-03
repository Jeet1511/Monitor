import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Activity, RefreshCw, Search, Clock, User, Globe,
    Monitor, Smartphone, LogOut, Eye, ChevronLeft, ChevronRight,
    Trash2, AlertTriangle
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminUserSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchWithAuth = async (url) => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    };

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const usersData = await fetchWithAuth(`${API_BASE}/users`);
                // Generate mock session data based on users
                const mockSessions = (usersData.data?.users || []).map((user, i) => ({
                    id: `session-${i}`,
                    userId: user._id,
                    userName: user.name,
                    userEmail: user.email,
                    device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
                    browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
                    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    lastActivity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                    isActive: Math.random() > 0.3
                }));
                setSessions(mockSessions);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const filteredSessions = sessions.filter(s =>
        s.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const terminateSession = (sessionId) => {
        if (confirm('Terminate this session?')) {
            setSessions(prev => prev.filter(s => s.id !== sessionId));
        }
    };

    const terminateAllForUser = (userId) => {
        if (confirm('Terminate all sessions for this user?')) {
            setSessions(prev => prev.filter(s => s.userId !== userId));
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header">
                    <div>
                        <h1><Activity size={28} /> User Sessions</h1>
                        <p>Monitor and manage active user sessions across the platform</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="admin-btn primary">
                        <RefreshCw size={16} /> Refresh
                    </button>
                </header>

                <div className="admin-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{sessions.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Sessions</div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{sessions.filter(s => s.isActive).length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Now</div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{sessions.filter(s => s.device === 'Desktop').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Desktop Sessions</div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{sessions.filter(s => s.device === 'Mobile').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mobile Sessions</div>
                    </div>
                </div>

                <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Search size={18} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by user..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '250px' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading sessions...</p>
                    </div>
                ) : (
                    <div className="admin-table-card" style={{ background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>USER</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>DEVICE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>IP ADDRESS</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>LAST ACTIVITY</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>STATUS</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSessions.map((session) => (
                                    <tr key={session.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                                                    {session.userName?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{session.userName}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{session.userEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                {session.device === 'Desktop' ? <Monitor size={16} /> : <Smartphone size={16} />}
                                                {session.device} / {session.browser}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{session.ip}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Clock size={14} />
                                                {new Date(session.lastActivity).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: session.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                                color: session.isActive ? 'var(--success)' : 'var(--text-muted)'
                                            }}>
                                                {session.isActive ? '● Active' : '○ Idle'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => terminateSession(session.id)}
                                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                    title="Terminate Session"
                                                >
                                                    <LogOut size={14} />
                                                </button>
                                            </div>
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

export default AdminUserSessions;
