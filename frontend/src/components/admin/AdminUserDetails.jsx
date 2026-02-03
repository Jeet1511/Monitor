import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../../utils/api';
import {
    ArrowLeft,
    Globe,
    Clock,
    Trash2,
    UserX,
    UserCheck,
    ExternalLink,
    Mail,
    Calendar
} from 'lucide-react';

const AdminUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await adminAPI.getUser(id);
            setUser(data.data.user);
            setWebsites(data.data.websites || []);
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleToggleActive = async () => {
        try {
            await adminAPI.updateUser(id, { isActive: !user.isActive });
            fetchData();
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this user and all their data?')) return;
        try {
            await adminAPI.deleteUser(id);
            navigate('/admin/users');
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleDeleteWebsite = async (websiteId) => {
        if (!confirm('Delete this website?')) return;
        try {
            await adminAPI.deleteWebsite(websiteId);
            fetchData();
        } catch (error) {
            alert('Failed to delete website');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-center" style={{ minHeight: '400px' }}>
                    <div className="loading-spinner" />
                </div>
            </AdminLayout>
        );
    }

    if (!user) {
        return (
            <AdminLayout>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <h3>User not found</h3>
                    <Link to="/admin/users" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                        Back to Users
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Link
                to="/admin/users"
                className="flex items-center gap-xs"
                style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', fontSize: '0.9rem' }}
            >
                <ArrowLeft size={16} />
                Back to Users
            </Link>

            {/* User Info */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
                    <div className="flex items-center gap-lg">
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white'
                        }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-xs)' }}>{user.name}</h2>
                            <div className="flex items-center gap-sm" style={{ color: 'var(--text-muted)' }}>
                                <Mail size={14} />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-sm" style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                                <Calendar size={14} />
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-sm">
                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button className="btn btn-secondary" onClick={handleToggleActive}>
                            {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                            {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ color: 'var(--error)' }}
                            onClick={handleDelete}
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* User's Websites */}
            <div>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                    Websites ({websites.length})
                </h3>

                {websites.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <Globe size={40} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No websites added</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Website</th>
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
                                                    style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
                                                >
                                                    {website.url}
                                                    <ExternalLink size={12} />
                                                </a>
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
                                                onClick={() => handleDeleteWebsite(website._id)}
                                            >
                                                <Trash2 size={16} style={{ color: 'var(--error)' }} />
                                            </button>
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

export default AdminUserDetails;
