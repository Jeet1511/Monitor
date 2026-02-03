import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Activity,
    LayoutDashboard,
    Globe,
    Settings,
    LogOut,
    Menu,
    X,
    HelpCircle,
    BarChart3,
    User,
    Moon,
    Sun
} from 'lucide-react';
import { useState, useEffect } from 'react';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        // Check saved theme preference
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            setDarkMode(false);
            document.documentElement.classList.add('light-theme');
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/websites', icon: Globe, label: 'Websites' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/settings', icon: Settings, label: 'Settings' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 99,
                        display: 'none'
                    }}
                    className="mobile-overlay"
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <Link to="/" className="sidebar-logo">
                    <Activity size={28} style={{ color: 'var(--primary)' }} />
                    <span className="text-gradient">Site Monitor</span>
                </Link>

                <nav className="sidebar-nav">
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <span style={{
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            letterSpacing: '1px',
                            padding: '0 var(--spacing-lg)'
                        }}>
                            Main Menu
                        </span>
                    </div>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Help & Support */}
                <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(34, 211, 238, 0.05))',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                        <HelpCircle size={18} style={{ color: 'var(--accent)' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Need Help?</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                        Check our documentation for tips on monitoring.
                    </p>
                    <a
                        href="https://github.com/Jeet1511"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--primary)',
                            fontWeight: 500
                        }}
                    >
                        View Docs →
                    </a>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        marginBottom: 'var(--spacing-lg)',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <span className="flex items-center gap-sm">
                        {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                        <span style={{ fontSize: '0.9rem' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                    </span>
                    <div style={{
                        width: 40,
                        height: 22,
                        borderRadius: 11,
                        background: darkMode ? 'var(--primary)' : 'var(--text-muted)',
                        position: 'relative',
                        transition: 'background 0.2s ease'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 2,
                            left: darkMode ? 20 : 2,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: 'white',
                            transition: 'left 0.2s ease'
                        }} />
                    </div>
                </button>
                <div style={{
                    paddingTop: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {user?.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="sidebar-link w-full"
                        style={{ color: 'var(--error)', justifyContent: 'flex-start' }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content">
                {/* Mobile header */}
                <div style={{
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                }} className="mobile-header">
                    <Link to="/" className="flex items-center gap-sm">
                        <Activity size={24} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontWeight: 700 }} className="text-gradient">Site Monitor</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {children}
            </main>

            <style>{`
        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 260px;
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            background: var(--bg-secondary);
          }
          .sidebar.open {
            transform: translateX(0);
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
          }
          .main-content {
            margin-left: 0 !important;
            padding: var(--spacing-md) !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .mobile-overlay {
            display: block !important;
          }
        }
        @media (max-width: 768px) {
          .main-content {
            padding: var(--spacing-sm) !important;
          }
          .sidebar {
            width: 85vw;
            max-width: 300px;
          }
        }
        @media (max-width: 480px) {
          .mobile-header {
            padding: var(--spacing-sm) !important;
          }
        }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
