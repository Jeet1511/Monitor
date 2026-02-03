import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Shield, LayoutDashboard, Users, Globe, LogOut, Home,
    Activity, Server, AlertTriangle, Settings, UserCog,
    Database, Lock, Mail, History, Key, FileText, Download,
    BarChart3, PieChart, Flag, Layers, Wrench, Power,
    ChevronDown, ChevronRight, UserX, TrendingUp, Zap
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { admin, adminLogout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [expandedSections, setExpandedSections] = useState({
        dashboard: true,
        users: true,
        websites: true,
        monitoring: true,
        security: true,
        configuration: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const menuSections = [
        {
            id: 'dashboard',
            label: 'DASHBOARD',
            items: [
                { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
                { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
                { path: '/admin/reports', icon: FileText, label: 'Reports' },
            ]
        },
        {
            id: 'users',
            label: 'USER MANAGEMENT',
            items: [
                { path: '/admin/users', icon: Users, label: 'All Users' },
                { path: '/admin/users/sessions', icon: Activity, label: 'User Sessions' },
                { path: '/admin/users/roles', icon: UserCog, label: 'User Roles' },
                { path: '/admin/users/banned', icon: UserX, label: 'Banned Users' },
            ]
        },
        {
            id: 'websites',
            label: 'WEBSITE MANAGEMENT',
            items: [
                { path: '/admin/websites', icon: Globe, label: 'All Websites' },
                { path: '/admin/websites/pending', icon: History, label: 'Pending Approval' },
                { path: '/admin/websites/flagged', icon: Flag, label: 'Flagged Sites' },
                { path: '/admin/websites/bulk', icon: Layers, label: 'Bulk Operations' },
            ]
        },
        {
            id: 'monitoring',
            label: 'MONITORING',
            items: [
                { path: '/admin/system', icon: Server, label: 'System Health' },
                { path: '/admin/activity', icon: Activity, label: 'Activity Logs' },
                { path: '/admin/errors', icon: AlertTriangle, label: 'Error Logs' },
                { path: '/admin/performance', icon: TrendingUp, label: 'Performance' },
            ]
        },
        {
            id: 'security',
            label: 'SECURITY',
            items: [
                { path: '/admin/security/logins', icon: History, label: 'Login History' },
                { path: '/admin/security/ips', icon: Lock, label: 'IP Management' },
                { path: '/admin/security/alerts', icon: AlertTriangle, label: 'Security Alerts' },
                { path: '/admin/security/audit', icon: FileText, label: 'Audit Trail' },
            ]
        },
        {
            id: 'configuration',
            label: 'CONFIGURATION',
            items: [
                { path: '/admin/admins', icon: Shield, label: 'Admin Accounts' },
                { path: '/admin/settings', icon: Settings, label: 'Global Settings' },
                { path: '/admin/email', icon: Mail, label: 'Email Templates' },
                { path: '/admin/api', icon: Key, label: 'API Keys' },
                { path: '/admin/maintenance', icon: Wrench, label: 'Maintenance Mode' },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;
    const isSectionActive = (items) => items.some(item => location.pathname === item.path);

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside className="sidebar" style={{
                background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
                width: '280px',
                overflowY: 'auto',
                maxHeight: '100vh'
            }}>
                <div className="sidebar-logo" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <Shield size={28} style={{ color: 'var(--error)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>Admin Panel</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0 var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>
                    {admin?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                </div>

                <nav className="sidebar-nav" style={{ flex: 1 }}>
                    {menuSections.map((section) => (
                        <div key={section.id} style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <button
                                onClick={() => toggleSection(section.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: isSectionActive(section.items) ? 'var(--error)' : 'var(--text-muted)',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.5px',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                {section.label}
                                {expandedSections[section.id] ?
                                    <ChevronDown size={14} /> :
                                    <ChevronRight size={14} />
                                }
                            </button>

                            {expandedSections[section.id] && (
                                <div style={{ paddingLeft: 'var(--spacing-md)' }}>
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                            style={{
                                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                                fontSize: '0.85rem',
                                                ...(isActive(item.path) ? {
                                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
                                                    borderColor: 'rgba(239, 68, 68, 0.3)'
                                                } : {})
                                            }}
                                        >
                                            <item.icon size={16} />
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div style={{
                    padding: 'var(--spacing-md)',
                    borderTop: '1px solid var(--border-color)',
                    marginTop: 'auto'
                }}>
                    <Link
                        to="/"
                        className="sidebar-link"
                        style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.85rem' }}
                    >
                        <Home size={16} />
                        Back to Site
                    </Link>

                    <div style={{
                        padding: 'var(--spacing-sm)',
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--error), #dc2626)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                {admin?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{admin?.name || 'Admin'}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{admin?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="sidebar-link w-full"
                        style={{ color: 'var(--error)', justifyContent: 'flex-start', fontSize: '0.85rem' }}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
