import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    UserCog, RefreshCw, Search, Shield, Users, Eye, Edit,
    Trash2, Plus, CheckCircle, X, Save
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminUserRoles = () => {
    const [roles, setRoles] = useState([
        { id: 'admin', name: 'Administrator', description: 'Full system access', users: 2, permissions: ['all'], color: '#ef4444' },
        { id: 'moderator', name: 'Moderator', description: 'Can manage users and content', users: 0, permissions: ['users.view', 'websites.view', 'websites.manage'], color: '#f59e0b' },
        { id: 'support', name: 'Support Staff', description: 'Can view and assist users', users: 0, permissions: ['users.view', 'websites.view'], color: '#3b82f6' },
        { id: 'viewer', name: 'Viewer', description: 'Read-only access to reports', users: 0, permissions: ['reports.view'], color: '#6b7280' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const allPermissions = [
        { id: 'users.view', label: 'View Users', category: 'Users' },
        { id: 'users.manage', label: 'Manage Users', category: 'Users' },
        { id: 'users.delete', label: 'Delete Users', category: 'Users' },
        { id: 'websites.view', label: 'View Websites', category: 'Websites' },
        { id: 'websites.manage', label: 'Manage Websites', category: 'Websites' },
        { id: 'websites.delete', label: 'Delete Websites', category: 'Websites' },
        { id: 'system.view', label: 'View System', category: 'System' },
        { id: 'system.manage', label: 'Manage System', category: 'System' },
        { id: 'reports.view', label: 'View Reports', category: 'Reports' },
        { id: 'reports.export', label: 'Export Reports', category: 'Reports' },
        { id: 'settings.view', label: 'View Settings', category: 'Settings' },
        { id: 'settings.manage', label: 'Manage Settings', category: 'Settings' },
    ];

    const handleDeleteRole = (roleId) => {
        if (roleId === 'admin') {
            alert('Cannot delete Administrator role');
            return;
        }
        if (confirm('Delete this role?')) {
            setRoles(prev => prev.filter(r => r.id !== roleId));
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <UserCog size={28} /> User Roles & Permissions
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Define roles and assign permissions to control access levels</p>
                    </div>
                    <button
                        onClick={() => { setEditingRole(null); setShowModal(true); }}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}
                    >
                        <Plus size={16} /> Create Role
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {roles.map((role) => (
                        <div key={role.id} style={{
                            background: 'var(--bg-glass)',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid var(--border-color)',
                                background: `linear-gradient(135deg, ${role.color}15, transparent)`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '10px',
                                            background: `${role.color}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Shield size={20} style={{ color: role.color }} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{role.name}</h3>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{role.description}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        background: `${role.color}20`,
                                        color: role.color,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {role.users} users
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.75rem' }}>PERMISSIONS</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {role.permissions.includes('all') ? (
                                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500 }}>
                                            <CheckCircle size={12} style={{ marginRight: '0.25rem' }} /> Full Access
                                        </span>
                                    ) : (
                                        role.permissions.map(p => (
                                            <span key={p} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                                                {p}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                            {role.id !== 'admin' && (
                                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => { setEditingRole(role); setShowModal(true); }}
                                        style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRole(role.id)}
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem', borderRadius: '6px', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Permission Reference</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {allPermissions.map(p => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <CheckCircle size={12} style={{ color: 'var(--success)' }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({p.id})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUserRoles;
