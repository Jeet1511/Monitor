import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../../utils/api';
import AddWebsiteModal from './AddWebsiteModal';
import {
    Globe,
    Trash2,
    ExternalLink,
    Clock,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus
} from 'lucide-react';

const AdminWebsites = () => {
    const [websites, setWebsites] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchWebsites = async (page = 1, status = '') => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (status) params.status = status;
            const data = await adminAPI.getWebsites(params);
            setWebsites(data.data.websites);
            setPagination(data.data.pagination);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await adminAPI.getUsers();
            setUsers(data.data.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        fetchWebsites();
        fetchUsers();
    }, []);

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        fetchWebsites(1, status);
    };

    const handleAddWebsite = async (websiteData) => {
        try {
            await adminAPI.createWebsiteForUser(websiteData);
            await fetchWebsites(pagination.page, statusFilter);
            setShowAddModal(false);
        } catch (error) {
            throw new Error(error.message || 'Failed to create website');
        }
    };

    const handleDelete = async (websiteId) => {
        if (!confirm('Delete this website?')) return;
        try {
            await adminAPI.deleteWebsite(websiteId);
            fetchWebsites(pagination.page, statusFilter);
        } catch (error) {
            alert('Failed to delete website');
        }
    };

    if (loading && websites.length === 0) {
        return (
            <AdminLayout>
                <div className="loading-center" style={{ minHeight: '400px' }}>
                    <div className="loading-spinner" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>All Websites</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Monitor all websites across the platform ({pagination.total} total)
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={18} />
                    Add Website
                </button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Filter size={18} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Filter by status:</span>
                <div className="flex gap-sm">
                    {[
                        { value: '', label: 'All' },
                        { value: 'up', label: 'Up' },
                        { value: 'down', label: 'Down' },
                        { value: 'pending', label: 'Pending' }
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            className={`btn ${statusFilter === filter.value ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            onClick={() => handleFilterChange(filter.value)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Websites Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Website</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Uptime</th>
                            <th>Interval</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {websites.map((website) => (
                            <tr key={website._id}>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{website.name}</div>
                                        <a
                                            href={website.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-xs"
                                            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}
                                        >
                                            {website.url.substring(0, 40)}{website.url.length > 40 ? '...' : ''}
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{website.userId?.name || 'N/A'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {website.userId?.email || ''}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge badge-${website.lastStatus === 'up' ? 'success' : website.lastStatus === 'down' ? 'error' : 'warning'}`}>
                                        {website.lastStatus}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontWeight: 600, color: website.uptime >= 99 ? 'var(--success)' : 'var(--warning)' }}>
                                        {website.uptime}%
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-xs">
                                        <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                                        {website.pingInterval}m
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '8px' }}
                                        onClick={() => handleDelete(website._id)}
                                    >
                                        <Trash2 size={16} style={{ color: 'var(--error)' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-md" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => fetchWebsites(pagination.page - 1, statusFilter)}
                        disabled={pagination.page === 1}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => fetchWebsites(pagination.page + 1, statusFilter)}
                        disabled={pagination.page === pagination.pages}
                    >
                        Next
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Add Website Modal */}
            {showAddModal && (
                <AddWebsiteModal
                    users={users}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddWebsite}
                />
            )}
        </AdminLayout>
    );
};

export default AdminWebsites;
