import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <Activity
                        size={32}
                        style={{
                            color: 'var(--primary)',
                            filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
                        }}
                    />
                    <span className="text-gradient">Site Monitor</span>
                </Link>

                <div className="nav-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#contact" className="nav-link">Contact</a>

                    {isAuthenticated ? (
                        <Link to="/dashboard" className="btn btn-primary">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="btn btn-primary">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                <button
                    className="btn-icon mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ display: 'none' }}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-nav" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <a href="#features" className="nav-link" style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>Features</a>
                    <a href="#about" className="nav-link" style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>About</a>
                    <a href="#contact" className="nav-link" style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>Contact</a>
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="btn btn-secondary w-full" style={{ marginBottom: 'var(--spacing-md)' }}>Login</Link>
                            <Link to="/signup" className="btn btn-primary w-full">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
