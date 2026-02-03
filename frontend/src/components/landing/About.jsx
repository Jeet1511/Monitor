import { Target, Rocket, Heart, Github, Instagram, ExternalLink } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="section" style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--spacing-2xl)',
                    alignItems: 'center'
                }}>
                    {/* Left - Content */}
                    <div>
                        <span style={{
                            display: 'inline-block',
                            padding: 'var(--spacing-sm) var(--spacing-lg)',
                            background: 'rgba(34, 211, 238, 0.1)',
                            border: '1px solid rgba(34, 211, 238, 0.2)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.85rem',
                            color: 'var(--accent)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            About
                        </span>

                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>
                            Why <span className="text-gradient">Site Monitor?</span>
                        </h2>

                        <p style={{
                            fontSize: '1.05rem',
                            lineHeight: 1.8,
                            marginBottom: 'var(--spacing-xl)'
                        }}>
                            Many free hosting platforms like Render, Railway, and Glitch put your applications
                            to sleep after periods of inactivity. This means your users experience slow load
                            times or even errors when visiting your site.
                        </p>

                        <p style={{
                            fontSize: '1.05rem',
                            lineHeight: 1.8,
                            marginBottom: 'var(--spacing-xl)'
                        }}>
                            <strong style={{ color: 'var(--text-primary)' }}>Site Monitor</strong> solves this
                            by periodically pinging your websites to keep them active and responsive. It's like
                            having a friend who continuously checks on your sites so they're always ready for
                            real visitors.
                        </p>

                        {/* Benefits */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 'var(--spacing-lg)'
                        }}>
                            {[
                                { icon: Target, title: 'Purpose', text: 'Keep sites awake & monitor uptime' },
                                { icon: Rocket, title: 'Performance', text: 'Faster response for real users' },
                                { icon: Heart, title: 'Free', text: 'No cost, no limits, forever' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-md">
                                    <div style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-glass)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <item.icon size={20} style={{ color: 'var(--primary)' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Developer Card */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-xl)',
                            maxWidth: '380px',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Gradient overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '100px',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(34, 211, 238, 0.1))',
                                zIndex: 0
                            }} />

                            {/* Avatar */}
                            <div style={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                margin: '0 auto var(--spacing-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 700,
                                color: 'white',
                                position: 'relative',
                                zIndex: 1,
                                border: '4px solid var(--bg-secondary)',
                                boxShadow: 'var(--shadow-lg)'
                            }}>
                                J
                            </div>

                            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Jeet</h3>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-muted)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                Full Stack Developer
                            </p>

                            <p style={{
                                fontSize: '0.9rem',
                                lineHeight: 1.7,
                                marginBottom: 'var(--spacing-xl)'
                            }}>
                                Passionate about building tools that help developers and make the web better.
                                Site Monitor is my contribution to the open-source community.
                            </p>

                            {/* Social Links */}
                            <div className="flex justify-center gap-md">
                                <a
                                    href="https://github.com/Jeet1511"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}
                                >
                                    <Github size={18} />
                                    GitHub
                                    <ExternalLink size={14} />
                                </a>

                                <a
                                    href="https://www.instagram.com/_echo.del.alma_?igsh=MTFocmpxYW03em94aA%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        padding: 'var(--spacing-md) var(--spacing-lg)',
                                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-lg)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        transition: 'all var(--transition-normal)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(188, 24, 136, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <Instagram size={18} />
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          #about > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    );
};

export default About;
