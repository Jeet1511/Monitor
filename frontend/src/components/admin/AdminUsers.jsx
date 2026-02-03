import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../../utils/api';
import {
    Search,
    Eye,
    UserX,
    UserCheck,
    Trash2,
    Globe,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const fetchUsers = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const data = await adminAPI.getUsers({ page, search, limit: 10 });
            setUsers(data.data.users);
            setPagination(data.data.pagination);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = () => {
        fetchUsers(1, searchTerm);
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            await adminAPI.updateUser(userId, { isActive: !currentStatus });
            fetchUsers(pagination.page, searchTerm);
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user and all their data?')) return;
        try {
            await adminAPI.deleteUser(userId);
            fetchUsers(pagination.page, searchTerm);
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString();

    if (loading && users.length === 0) {
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
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>Users</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage all registered users ({pagination.total} total)
                </p>
            </div>

            {/* Search */}
            <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)', maxWidth: '500px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="form-input"
                        style={{ paddingLeft: '44px' }}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Websites</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {user.email}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-xs">
                                        <Globe size={16} style={{ color: 'var(--text-muted)' }} />
                                        <span>{user.websiteCount}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {formatDate(user.createdAt)}
                                </td>
                                <td>
                                    <div className="flex gap-xs">
                                        <Link
                                            to={`/admin/users/${user._id}`}
                                            className="btn btn-secondary"
                                            style={{ padding: '8px' }}
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '8px' }}
                                            onClick={() => handleToggleActive(user._id, user.isActive)}
                                        >
                                            {user.isActive ? (
                                                <UserX size={16} style={{ color: 'var(--warning)' }} />
                                            ) : (
                                                <UserCheck size={16} style={{ color: 'var(--success)' }} />
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '8px' }}
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <Trash2 size={16} style={{ color: 'var(--error)' }} />
                                        </button>
                                    </div>
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
                        onClick={() => fetchUsers(pagination.page - 1, searchTerm)}
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
                        onClick={() => fetchUsers(pagination.page + 1, searchTerm)}
                        disabled={pagination.page === pagination.pages}
                    >
                        Next
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsers;
