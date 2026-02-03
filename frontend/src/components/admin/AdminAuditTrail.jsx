import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    FileText, Search, Calendar, User, Clock, Filter,
    Download, Eye, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';

const AdminAuditTrail = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setTimeout(() => {
            const actions = [
                { action: 'user.created', description: 'New user account created', category: 'users' },
                { action: 'user.deleted', description: 'User account deleted', category: 'users' },
                { action: 'user.suspended', description: 'User account suspended', category: 'users' },
                { action: 'website.created', description: 'New website added for monitoring', category: 'websites' },
                { action: 'website.deleted', description: 'Website removed from monitoring', category: 'websites' },
                { action: 'admin.login', description: 'Admin logged into panel', category: 'security' },
                { action: 'admin.logout', description: 'Admin logged out of panel', category: 'security' },
                { action: 'admin.created', description: 'New admin account created', category: 'security' },
                { action: 'settings.updated', description: 'System settings updated', category: 'system' },
                { action: 'permission.changed', description: 'User permissions modified', category: 'security' },
            ];
            const admins = ['Super Admin', 'Admin User', 'System'];
            const mockLogs = Array.from({ length: 50 }, (_, i) => {
                const actionData = actions[Math.floor(Math.random() * actions.length)];
                return {
                    id: i + 1,
                    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
                    admin: admins[Math.floor(Math.random() * admins.length)],
                    action: actionData.action,
                    description: actionData.description,
                    category: actionData.category,
                    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    details: { targetId: `${Math.random().toString(36).substring(7)}`, success: Math.random() > 0.1 }
                };
            }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setLogs(mockLogs);
            setLoading(false);
        }, 500);
    }, []);

    const getCategoryColor = (category) => {
        switch (category) {
            case 'users': return 'var(--primary)';
            case 'websites': return 'var(--accent)';
            case 'security': return 'var(--error)';
            case 'system': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    const filteredLogs = logs.filter(log => {
        if (filter !== 'all' && log.category !== filter) return false;
        if (searchTerm && !log.description.toLowerCase().includes(searchTerm.toLowerCase()) && !log.admin.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const pageSize = 15;
    const totalPages = Math.ceil(filteredLogs.length / pageSize);
    const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

    const exportLogs = () => {
        const csv = logs.map(log => `${log.timestamp},${log.admin},${log.action},${log.description},${log.ip}`).join('\n');
        const blob = new Blob([`Timestamp,Admin,Action,Description,IP\n${csv}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audit_trail.csv';
        a.click();
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <FileText size={28} style={{ color: 'var(--primary)' }} /> Audit Trail
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Complete log of all administrative actions</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={exportLogs}
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        >
                            <Download size={16} /> Export CSV
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        >
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {['users', 'websites', 'security', 'system'].map(cat => (
                        <div key={cat} style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: getCategoryColor(cat) }}>{logs.filter(l => l.category === cat).length}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{cat} Events</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Search size={18} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '200px' }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={e => { setFilter(e.target.value); setPage(1); }}
                        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                        <option value="all">All Categories</option>
                        <option value="users">Users</option>
                        <option value="websites">Websites</option>
                        <option value="security">Security</option>
                        <option value="system">System</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading audit logs...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>TIMESTAMP</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>ADMIN</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>ACTION</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>CATEGORY</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLogs.map((log) => (
                                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Clock size={14} />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        {log.admin[0]}
                                                    </div>
                                                    <span style={{ color: 'var(--text-primary)' }}>{log.admin}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{log.description}</div>
                                                <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.action}</code>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    background: `${getCategoryColor(log.category)}20`,
                                                    color: getCategoryColor(log.category),
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize'
                                                }}>{log.category}</span>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{log.ip}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredLogs.length)} of {filteredLogs.length}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-glass)', color: page === 1 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                    <ChevronLeft size={14} /> Prev
                                </button>
                                <span style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-glass)', color: page === totalPages ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                    Next <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminAuditTrail;
