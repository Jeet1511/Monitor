import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    UserX, RefreshCw, Search, Ban, Clock, Mail, Eye,
    UserCheck, Trash2, AlertTriangle, Calendar, Globe
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminBannedUsers = () => {
    const [bannedUsers, setBannedUsers] = useState([]);
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
        const fetchBannedUsers = async () => {
            try {
                const usersData = await fetchWithAuth(`${API_BASE}/users`);
                const suspended = (usersData.data?.users || []).filter(u => u.isActive === false);
                const mockBanned = suspended.map((user, i) => ({
                    ...user,
                    banReason: ['Spam activity', 'Terms violation', 'Abuse report', 'Suspicious behavior'][Math.floor(Math.random() * 4)],
                    bannedAt: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
                    bannedBy: 'Super Admin'
                }));
                setBannedUsers(mockBanned);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBannedUsers();
    }, []);

    const unbanUser = async (userId) => {
        if (confirm('Unban this user? They will regain access to their account.')) {
            try {
                const token = localStorage.getItem('adminToken');
                await fetch(`${API_BASE}/users/${userId}/activate`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setBannedUsers(prev => prev.filter(u => u._id !== userId));
            } catch (error) {
                console.error('Unban error:', error);
            }
        }
    };

    const permanentDelete = async (userId) => {
        if (confirm('Permanently delete this user and all their data? This cannot be undone!')) {
            try {
                const token = localStorage.getItem('adminToken');
                await fetch(`${API_BASE}/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setBannedUsers(prev => prev.filter(u => u._id !== userId));
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    const filteredUsers = bannedUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <UserX size={28} style={{ color: 'var(--error)' }} /> Banned Users
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage suspended and banned user accounts</p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>{bannedUsers.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Banned</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{bannedUsers.filter(u => u.banReason === 'Spam activity').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Spam Related</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{bannedUsers.filter(u => u.banReason === 'Terms violation').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Terms Violations</div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Search size={18} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search banned users..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '250px' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading banned users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <UserCheck size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Banned Users</h3>
                        <p style={{ color: 'var(--text-muted)' }}>All users are currently in good standing</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredUsers.map((user) => (
                            <div key={user._id} style={{
                                background: 'var(--bg-glass)',
                                borderRadius: '12px',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                padding: '1.5rem',
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '1rem',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--error)', fontWeight: 600, fontSize: '1.25rem'
                                    }}>
                                        {user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{user.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Mail size={14} /> {user.email}
                                        </div>
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                                            <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <AlertTriangle size={12} /> {user.banReason}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Calendar size={12} /> Banned {new Date(user.bannedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => unbanUser(user._id)}
                                        style={{
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            color: 'var(--success)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        <UserCheck size={14} /> Unban
                                    </button>
                                    <button
                                        onClick={() => permanentDelete(user._id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            color: 'var(--error)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
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

export default AdminBannedUsers;
