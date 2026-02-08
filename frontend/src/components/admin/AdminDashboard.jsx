import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import {
    Users, Globe, Activity, AlertTriangle, Server, Database, Cpu, HardDrive,
    TrendingUp, RefreshCw, Download, Trash2, UserX, UserCheck, Key, Search,
    Zap, Shield, Settings, FileText, BarChart3, List, Grid, LogOut, Eye,
    ExternalLink, Wifi, Bell, Clock, CheckCircle, XCircle, ArrowUpRight,
    Layers, PieChart, Webhook, Plus, Edit, Copy, Calendar, Filter, Mail,
    Lock, Wrench, UserPlus, ShieldCheck, X, Check, AlertCircle
} from 'lucide-react';
import './AdminDashboard.css';

const API_BASE = '/api/admin';

const AdminDashboard = () => {
    const { admin, logoutAdmin, hasPermission, isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [websites, setWebsites] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards');
    const [modal, setModal] = useState({ type: null, data: null });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login');
            return;
        }
        fetchAllData();
    }, [admin]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    };

    const fetchAllData = async () => {
        try {
            setRefreshing(true);
            const promises = [fetchWithAuth(`${API_BASE}/stats/comprehensive`)];

            if (hasPermission('users.view')) {
                promises.push(fetchWithAuth(`${API_BASE}/users`));
            }
            if (hasPermission('websites.view')) {
                promises.push(fetchWithAuth(`${API_BASE}/websites`));
            }
            if (isSuperAdmin()) {
                promises.push(fetchWithAuth(`${API_BASE}/admins`));
            }

            const results = await Promise.all(promises);

            let idx = 0;
            if (results[idx]?.success) setStats(results[idx].data.stats);
            idx++;

            if (hasPermission('users.view') && results[idx]?.success) {
                setUsers(results[idx].data.users || []);
                idx++;
            }
            if (hasPermission('websites.view') && results[idx]?.success) {
                setWebsites(results[idx].data.websites || []);
                idx++;
            }
            if (isSuperAdmin() && results[idx]?.success) {
                setAdmins(results[idx].data.admins || []);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ===== USER ACTIONS =====
    const handleSuspendUser = async (userId) => {
        try {
            await fetchWithAuth(`${API_BASE}/users/${userId}/suspend`, { method: 'POST' });
            showToast('User suspended successfully');
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    const handleActivateUser = async (userId) => {
        try {
            await fetchWithAuth(`${API_BASE}/users/${userId}/activate`, { method: 'POST' });
            showToast('User activated successfully');
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    const handleResetPassword = async (userId) => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/users/${userId}/reset-password`, { method: 'POST' });
            setModal({ type: 'password-reset', data: { password: res.data.temporaryPassword } });
        } catch (err) { showToast(err.message, 'error'); }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Delete this user and all their data? This cannot be undone.')) return;
        try {
            await fetchWithAuth(`${API_BASE}/users/${userId}`, { method: 'DELETE' });
            showToast('User deleted successfully');
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    // ===== WEBSITE ACTIONS =====
    const handleForcePing = async (websiteId) => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/websites/${websiteId}/force-ping`, { method: 'POST' });
            showToast(res.message);
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    const handleDeleteWebsite = async (websiteId) => {
        if (!confirm('Delete this website? This cannot be undone.')) return;
        try {
            await fetchWithAuth(`${API_BASE}/websites/${websiteId}`, { method: 'DELETE' });
            showToast('Website deleted successfully');
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    // ===== ADMIN ACTIONS =====
    const handleCreateAdmin = async (formData) => {
        try {
            await fetchWithAuth(`${API_BASE}/admins`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showToast('Admin created successfully');
            setModal({ type: null });
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    const handleUpdateAdmin = async (adminId, data) => {
        try {
            await fetchWithAuth(`${API_BASE}/admins/${adminId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('Admin updated successfully');
            setModal({ type: null });
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    const handleDeleteAdmin = async (adminId) => {
        if (!confirm('Delete this admin? This cannot be undone.')) return;
        try {
            await fetchWithAuth(`${API_BASE}/admins/${adminId}`, { method: 'DELETE' });
            showToast('Admin deleted successfully');
            fetchAllData();
        } catch (err) { showToast(err.message, 'error'); }
    };

    // ===== EXPORT =====
    const handleExport = async (type) => {
        try {
            const data = await fetchWithAuth(`${API_BASE}/export/${type}`);
            const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            showToast(`${type} exported successfully`);
        } catch (err) { showToast(err.message, 'error'); }
    };

    // Build navigation based on permissions
    const navCategories = [
        {
            label: 'MANAGEMENT',
            items: [
                { id: 'overview', label: 'Overview', icon: BarChart3, show: true },
                { id: 'users', label: 'Users', icon: Users, show: hasPermission('users.view') },
                { id: 'websites', label: 'Websites', icon: Globe, show: hasPermission('websites.view') },
            ].filter(i => i.show)
        },
        {
            label: 'MONITORING',
            items: [
                { id: 'system', label: 'System', icon: Server, show: hasPermission('system.view') },
                { id: 'activity', label: 'Activity', icon: Activity, show: true },
            ].filter(i => i.show)
        },
        {
            label: 'CONFIGURATION',
            items: [
                { id: 'admins', label: 'Admins', icon: ShieldCheck, show: isSuperAdmin() },
                { id: 'settings', label: 'Settings', icon: Settings, show: hasPermission('settings.view') },
            ].filter(i => i.show)
        }
    ].filter(c => c.items.length > 0);

    if (loading) {
        return (
            <AdminLayout>
                <div className="admin-loading">
                    <div className="admin-loading-spinner" />
                    <p>Loading Admin Dashboard...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-dashboard-content">
                {/* Toast Notification */}
                {toast && (
                    <div className={`admin-toast ${toast.type}`}>
                        {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                )}

                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header-left">
                        <h1 className="admin-title">Overview</h1>
                        <p className="admin-subtitle">
                            {admin?.role === 'superadmin' ? 'Full Access' : `${admin?.permissions?.length || 0} permissions`}
                        </p>
                    </div>
                    <div className="admin-header-right">
                        <button onClick={fetchAllData} className={`admin-refresh-btn ${refreshing ? 'spinning' : ''}`}>
                            <RefreshCw size={18} /><span>Refresh</span>
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="admin-stats-grid">
                                <StatCard icon={Users} value={stats?.totalUsers || 0} label="Total Users" sub={`${stats?.activeUsers || 0} active`} type="primary" />
                                <StatCard icon={Globe} value={stats?.totalWebsites || 0} label="Websites" sub={`${stats?.upWebsites || 0} online`} type="accent" />
                                <StatCard icon={Activity} value={stats?.recentPings || 0} label="Pings (24h)" type="success" />
                                <StatCard icon={AlertTriangle} value={stats?.downWebsites || 0} label="Sites Down" type="danger" />
                                <StatCard icon={UserPlus} value={stats?.recentUsers || 0} label="New Users (7d)" type="info" />
                                <StatCard icon={Wifi} value={stats?.activeWebsites || 0} label="Active Sites" type="warning" />
                            </div>

                            <div className="admin-charts-grid">
                                <div className="admin-chart-card">
                                    <h3><PieChart size={18} /> Quick Stats</h3>
                                    <div className="quick-stats-list">
                                        <div className="quick-stat"><span>Active Users</span><span>{stats?.activeUsers || 0}</span></div>
                                        <div className="quick-stat"><span>Sites Up</span><span className="success">{stats?.upWebsites || 0}</span></div>
                                        <div className="quick-stat"><span>Sites Down</span><span className="danger">{stats?.downWebsites || 0}</span></div>
                                        <div className="quick-stat"><span>New Users (7d)</span><span>{stats?.recentUsers || 0}</span></div>
                                    </div>
                                </div>

                                <div className="admin-chart-card">
                                    <h3><BarChart3 size={18} /> System Status</h3>
                                    <div className="quick-stats-list">
                                        <div className="quick-stat"><span>Total Websites</span><span>{stats?.totalWebsites || 0}</span></div>
                                        <div className="quick-stat"><span>Active Monitoring</span><span>{stats?.activeWebsites || 0}</span></div>
                                        <div className="quick-stat"><span>Recent Pings</span><span>{stats?.recentPings || 0}</span></div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && hasPermission('users.view') && (
                        <div className="admin-section">
                            <div className="admin-toolbar">
                                <div className="search-box"><Search size={18} />
                                    <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="toolbar-right">
                                    {hasPermission('reports.view') && (
                                        <button onClick={() => handleExport('users')} className="admin-btn secondary"><Download size={16} /> Export</button>
                                    )}
                                </div>
                            </div>

                            <div className="admin-table-card">
                                <table className="admin-table">
                                    <thead><tr><th>User</th><th>Email</th><th>Status</th><th>Sites</th><th>Joined</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())).map((user, i) => (
                                            <tr key={user._id} style={{ animationDelay: `${i * 0.03}s` }}>
                                                <td><div className="user-cell"><div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div><span>{user.name}</span></div></td>
                                                <td className="muted">{user.email}</td>
                                                <td>{user.isActive !== false ? <span className="status-badge active"><CheckCircle size={12} /> Active</span> : <span className="status-badge suspended"><XCircle size={12} /> Suspended</span>}</td>
                                                <td>{user.websiteCount || 0}</td>
                                                <td className="muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {hasPermission('users.manage') && (
                                                        <div className="action-btns">
                                                            {user.isActive !== false ? (
                                                                <button onClick={() => handleSuspendUser(user._id)} className="action-btn warning" title="Suspend"><UserX size={14} /></button>
                                                            ) : (
                                                                <button onClick={() => handleActivateUser(user._id)} className="action-btn success" title="Activate"><UserCheck size={14} /></button>
                                                            )}
                                                            <button onClick={() => handleResetPassword(user._id)} className="action-btn" title="Reset Password"><Key size={14} /></button>
                                                            <button onClick={() => handleDeleteUser(user._id)} className="action-btn danger" title="Delete"><Trash2 size={14} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Websites Tab */}
                    {activeTab === 'websites' && hasPermission('websites.view') && (
                        <div className="admin-section">
                            <div className="admin-toolbar">
                                <div className="search-box"><Search size={18} />
                                    <input type="text" placeholder="Search websites..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="toolbar-right">
                                    <button onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')} className="admin-btn ghost">
                                        {viewMode === 'cards' ? <List size={16} /> : <Grid size={16} />}
                                    </button>
                                    {hasPermission('reports.view') && (
                                        <button onClick={() => handleExport('websites')} className="admin-btn secondary"><Download size={16} /> Export</button>
                                    )}
                                </div>
                            </div>

                            {viewMode === 'cards' ? (
                                <div className="websites-grid">
                                    {websites.filter(w => w.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((site, i) => (
                                        <div key={site._id} className={`website-card ${site.lastStatus}`} style={{ animationDelay: `${i * 0.05}s` }}>
                                            <div className="website-card-header"><h4>{site.name}</h4><span className={`status-dot ${site.lastStatus}`} /></div>
                                            <p className="website-url">{site.url}</p>
                                            <div className="website-meta"><span><Clock size={12} /> {site.lastResponseTime || 0}ms</span><span><Users size={12} /> {site.userId?.name || 'Unknown'}</span></div>
                                            <div className="website-actions">
                                                {hasPermission('websites.manage') && (
                                                    <>
                                                        <button onClick={() => handleForcePing(site._id)} className="admin-btn sm primary"><Zap size={12} /> Ping</button>
                                                        <button onClick={() => handleDeleteWebsite(site._id)} className="admin-btn sm danger"><Trash2 size={12} /></button>
                                                    </>
                                                )}
                                                <a href={site.url} target="_blank" rel="noopener noreferrer" className="admin-btn sm ghost"><ExternalLink size={12} /></a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="admin-table-card">
                                    <table className="admin-table">
                                        <thead><tr><th>Website</th><th>Status</th><th>Response</th><th>Owner</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {websites.filter(w => w.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((site, i) => (
                                                <tr key={site._id} style={{ animationDelay: `${i * 0.03}s` }}>
                                                    <td><div className="website-cell"><span className="website-name">{site.name}</span><span className="website-url-small">{site.url}</span></div></td>
                                                    <td><span className={`status-badge ${site.lastStatus}`}>{site.lastStatus?.toUpperCase()}</span></td>
                                                    <td>{site.lastResponseTime || 0}ms</td>
                                                    <td className="muted">{site.userId?.name || 'Unknown'}</td>
                                                    <td>
                                                        {hasPermission('websites.manage') && (
                                                            <div className="action-btns">
                                                                <button onClick={() => handleForcePing(site._id)} className="action-btn primary"><Zap size={14} /></button>
                                                                <button onClick={() => handleDeleteWebsite(site._id)} className="action-btn danger"><Trash2 size={14} /></button>
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
                    )}

                    {/* Admins Tab (Super Admin Only) */}
                    {activeTab === 'admins' && isSuperAdmin() && (
                        <div className="admin-section">
                            <div className="admin-toolbar">
                                <h3><ShieldCheck size={18} /> Manage Admins</h3>
                                <button onClick={() => setModal({ type: 'add-admin' })} className="admin-btn primary">
                                    <Plus size={16} /> Add Admin
                                </button>
                            </div>

                            <div className="admins-grid">
                                {admins.map((adm, i) => (
                                    <div key={adm._id} className={`admin-card ${adm.role}`} style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="admin-card-header">
                                            <div className="admin-card-avatar">{adm.name?.[0]?.toUpperCase()}</div>
                                            <div className="admin-card-info">
                                                <h4>{adm.name}</h4>
                                                <p>{adm.email}</p>
                                            </div>
                                            <span className={`role-badge ${adm.role}`}>{adm.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span>
                                        </div>

                                        {adm.role !== 'superadmin' && (
                                            <>
                                                <div className="admin-card-permissions">
                                                    <p>Permissions ({adm.permissions?.length || 0})</p>
                                                    <div className="permission-tags">
                                                        {adm.permissions?.slice(0, 4).map(p => (
                                                            <span key={p} className="permission-tag">{p.split('.')[0]}</span>
                                                        ))}
                                                        {adm.permissions?.length > 4 && <span className="permission-tag more">+{adm.permissions.length - 4}</span>}
                                                    </div>
                                                </div>
                                                <div className="admin-card-actions">
                                                    <button onClick={() => setModal({ type: 'edit-admin', data: adm })} className="admin-btn sm secondary"><Edit size={12} /> Edit</button>
                                                    <button onClick={() => handleDeleteAdmin(adm._id)} className="admin-btn sm danger"><Trash2 size={12} /></button>
                                                </div>
                                            </>
                                        )}

                                        {adm.role === 'superadmin' && (
                                            <div className="superadmin-note">
                                                <ShieldCheck size={14} /> Full access to all features
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && hasPermission('system.view') && (
                        <div className="admin-system-grid">
                            <div className="system-card"><div className="system-icon server"><Server size={24} /></div><h3>Server Status</h3>
                                <div className="system-stats">
                                    <div className="system-stat"><span className="stat-label">Status</span><span className="stat-value online">● Online</span></div>
                                    <div className="system-stat"><span className="stat-label">Node Version</span><span className="stat-value">{typeof process !== 'undefined' ? process.version : 'N/A'}</span></div>
                                </div>
                            </div>
                            <div className="system-card"><div className="system-icon database"><Database size={24} /></div><h3>Database</h3>
                                <div className="system-stats">
                                    <div className="system-stat"><span className="stat-label">Status</span><span className="stat-value online">● Connected</span></div>
                                    <div className="system-stat"><span className="stat-label">Users</span><span className="stat-value">{stats?.totalUsers || 0}</span></div>
                                    <div className="system-stat"><span className="stat-label">Websites</span><span className="stat-value">{stats?.totalWebsites || 0}</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div className="admin-table-card">
                            <div className="table-header"><h3><Activity size={18} /> Recent Activity</h3>
                                {hasPermission('reports.view') && (
                                    <button onClick={() => handleExport('activity')} className="admin-btn sm secondary"><Download size={14} /> Export</button>
                                )}
                            </div>
                            <div className="activity-list">
                                <div className="activity-item"><div className="activity-icon user"><Users size={14} /></div>
                                    <div className="activity-content"><p className="activity-text">{stats?.recentUsers || 0} new users registered</p><span className="activity-detail">Last 7 days</span></div>
                                </div>
                                <div className="activity-item"><div className="activity-icon website"><Globe size={14} /></div>
                                    <div className="activity-content"><p className="activity-text">{stats?.recentPings || 0} pings performed</p><span className="activity-detail">Last 24 hours</span></div>
                                </div>
                                <div className="activity-item"><div className="activity-icon system"><Server size={14} /></div>
                                    <div className="activity-content"><p className="activity-text">{stats?.upWebsites || 0} websites online</p><span className="activity-detail">{stats?.downWebsites || 0} currently down</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && hasPermission('settings.view') && (
                        <div className="admin-grid cols-2">
                            <div className="settings-card">
                                <h3><Download size={18} /> Data Export</h3>
                                {hasPermission('reports.view') && (
                                    <div className="settings-buttons">
                                        <button onClick={() => handleExport('users')} className="admin-btn primary"><Users size={16} /> Export Users</button>
                                        <button onClick={() => handleExport('websites')} className="admin-btn secondary"><Globe size={16} /> Export Websites</button>
                                        <button onClick={() => handleExport('activity')} className="admin-btn secondary"><Activity size={16} /> Export Activity</button>
                                    </div>
                                )}
                            </div>
                            <div className="settings-card">
                                <h3><Shield size={18} /> Your Permissions</h3>
                                <div className="permission-list">
                                    {admin?.permissions?.map(p => (
                                        <div key={p} className="permission-item"><CheckCircle size={14} /> {p}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {modal.type === 'add-admin' && (
                    <AdminFormModal
                        onClose={() => setModal({ type: null })}
                        onSubmit={handleCreateAdmin}
                    />
                )}
                {modal.type === 'edit-admin' && (
                    <AdminFormModal
                        admin={modal.data}
                        onClose={() => setModal({ type: null })}
                        onSubmit={(data) => handleUpdateAdmin(modal.data._id, data)}
                    />
                )}
                {modal.type === 'password-reset' && (
                    <div className="modal-overlay" onClick={() => setModal({ type: null })}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Password Reset</h3>
                            <p>New temporary password:</p>
                            <code className="password-display">{modal.data.password}</code>
                            <p className="modal-note">Please share this password securely with the user.</p>
                            <button onClick={() => setModal({ type: null })} className="admin-btn primary">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

// Stat Card Component
const StatCard = ({ icon: Icon, value, label, sub, type }) => (
    <div className={`admin-stat-card stat-${type}`}>
        <div className="stat-icon"><Icon size={24} /></div>
        <div className="stat-content">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
            {sub && <span className="stat-sub">{sub}</span>}
        </div>
        <div className="stat-glow" />
    </div>
);

// Admin Form Modal Component
const AdminFormModal = ({ admin, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: admin?.name || '',
        email: admin?.email || '',
        password: '',
        permissions: admin?.permissions || []
    });

    const allPermissions = [
        { id: 'users.view', label: 'View Users' },
        { id: 'users.manage', label: 'Manage Users' },
        { id: 'websites.view', label: 'View Websites' },
        { id: 'websites.manage', label: 'Manage Websites' },
        { id: 'system.view', label: 'View System' },
        { id: 'settings.view', label: 'View Settings' },
        { id: 'settings.manage', label: 'Manage Settings' },
        { id: 'reports.view', label: 'Export Reports' }
    ];

    const togglePermission = (permId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...formData };
        if (admin && !data.password) delete data.password;
        onSubmit(data);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{admin ? 'Edit Admin' : 'Add New Admin'}</h3>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>{admin ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                        <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} minLength={admin ? 0 : 6} required={!admin} placeholder={admin ? 'Leave blank to keep current password' : 'Enter password'} />
                    </div>
                    <div className="form-group">
                        <label>Permissions</label>
                        <div className="permissions-grid">
                            {allPermissions.map(perm => (
                                <label key={perm.id} className={`permission-checkbox ${formData.permissions.includes(perm.id) ? 'checked' : ''}`}>
                                    <input type="checkbox" checked={formData.permissions.includes(perm.id)} onChange={() => togglePermission(perm.id)} />
                                    <span>{perm.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="admin-btn secondary">Cancel</button>
                        <button type="submit" className="admin-btn primary">{admin ? 'Update Admin' : 'Create Admin'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
