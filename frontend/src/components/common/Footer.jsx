import { Activity, Github, Instagram, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            padding: 'var(--spacing-2xl) 0'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
                            <Activity size={28} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '1.25rem', fontWeight: 700 }} className="text-gradient">
                                Site Monitor
                            </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                            Keep your websites alive 24/7 with automated pinging and real-time uptime monitoring. Never miss a downtime again.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: 'var(--spacing-md)',
                            color: 'var(--text-primary)'
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            <li>
                                <a href="#features" style={{
                                    color: 'var(--text-secondary)',
                                    transition: 'color var(--transition-fast)',
                                    fontSize: '0.9rem'
                                }}
                                    className="nav-link"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#about" style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}
                                    className="nav-link"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="/signup" style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}
                                    className="nav-link"
                                >
                                    Get Started
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: 'var(--spacing-md)',
                            color: 'var(--text-primary)'
                        }}>
                            Connect
                        </h4>
                        <div className="flex gap-md">
                            <a
                                href="https://github.com/Jeet1511"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: 44,
                                    height: 44,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                    transition: 'all var(--transition-normal)'
                                }}
                                className="social-link"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-glass)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                <Github size={20} />
                            </a>

                            <a
                                href="https://www.instagram.com/_echo.del.alma_?igsh=MTFocmpxYW03em94aA%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: 44,
                                    height: 44,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                    transition: 'all var(--transition-normal)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-glass)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: 'var(--spacing-xl)',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-xs)',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                }}>
                    <span>© {currentYear} Site Monitor. Made with</span>
                    <Heart size={14} style={{ color: 'var(--error)', animation: 'pulse-opacity 1.5s ease-in-out infinite' }} />
                    <span>by Jeet</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
