import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Activity, RefreshCw, Filter, Calendar, User, Globe,
    Clock, Search, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import './AdminDashboard.css';

const AdminActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/admin/audit-logs?page=${page}&limit=20`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setLogs(data.data.logs || []);
                setTotalPages(data.data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const getActionColor = (action) => {
        switch (action) {
            case 'created': return 'var(--success)';
            case 'updated': return 'var(--primary)';
            case 'deleted': return 'var(--error)';
            default: return 'var(--text-secondary)';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'user': return User;
            case 'website': return Globe;
            default: return FileText;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const filteredLogs = logs.filter(log => {
        if (filter !== 'all' && log.type !== filter) return false;
        if (searchQuery && !log.target?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">
                        <Activity size={32} />
                        Activity Logs
                    </h1>
                    <p className="admin-subtitle">Track all system activities and changes</p>
                </div>
                <button onClick={fetchLogs} className="admin-btn admin-btn-primary">
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="admin-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Filter size={16} color="var(--text-secondary)" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="all">All Types</option>
                            <option value="user">Users</option>
                            <option value="website">Websites</option>
                        </select>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        flex: 1,
                        maxWidth: '300px'
                    }}>
                        <Search size={16} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Logs List */}
            <div className="admin-card">
                {loading ? (
                    <div className="admin-loading">
                        <div className="loading-spinner"></div>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--text-secondary)' }}>
                        No activity logs found
                    </div>
                ) : (
                    <div className="activity-timeline">
                        {filteredLogs.map((log, index) => {
                            const TypeIcon = getTypeIcon(log.type);
                            return (
                                <div key={index} className="activity-item" style={{
                                    display: 'flex',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md)',
                                    borderBottom: '1px solid var(--border-color)'
                                }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: 'var(--bg-glass)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: getActionColor(log.action),
                                        flexShrink: 0
                                    }}>
                                        <TypeIcon size={18} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <span style={{
                                                color: 'var(--text-primary)',
                                                fontWeight: 600
                                            }}>
                                                {log.target}
                                            </span>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: `${getActionColor(log.action)}20`,
                                                color: getActionColor(log.action)
                                            }}>
                                                {log.action}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            marginTop: 'var(--spacing-xs)'
                                        }}>
                                            {log.type === 'website' && log.user && `By ${log.user} • `}
                                            <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                            {formatDate(log.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-lg)',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="admin-btn"
                            style={{ opacity: page === 1 ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="admin-btn"
                            style={{ opacity: page === totalPages ? 0.5 : 1 }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminActivityLogs;
