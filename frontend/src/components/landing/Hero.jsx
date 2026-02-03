import { Link } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    Zap,
    Shield,
    Clock,
    CheckCircle2
} from 'lucide-react';

const Hero = () => {
    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                animation: 'float 6s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                animation: 'float 8s ease-in-out infinite reverse'
            }} />

            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--spacing-2xl)',
                    alignItems: 'center'
                }}>
                    {/* Left Content */}
                    <div style={{ maxWidth: '600px' }}>
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: 'var(--radius-full)',
                            marginBottom: 'var(--spacing-lg)',
                            animation: 'fadeIn 0.5s ease'
                        }}>
                            <Zap size={16} style={{ color: 'var(--accent)' }} />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Free Forever • No Credit Card Required
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 style={{
                            marginBottom: 'var(--spacing-lg)',
                            animation: 'fadeIn 0.5s ease 0.1s both'
                        }}>
                            Keep Your Websites{' '}
                            <span className="text-gradient">Alive 24/7</span>
                        </h1>

                        {/* Subheading */}
                        <p style={{
                            fontSize: '1.2rem',
                            marginBottom: 'var(--spacing-xl)',
                            lineHeight: 1.7,
                            animation: 'fadeIn 0.5s ease 0.2s both'
                        }}>
                            Automated uptime monitoring and periodic pinging to prevent your websites
                            from sleeping. Get instant alerts when your sites go down.
                        </p>

                        {/* Feature List */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-md)',
                            marginBottom: 'var(--spacing-xl)',
                            animation: 'fadeIn 0.5s ease 0.3s both'
                        }}>
                            {[
                                'Ping every 5, 15, 30, or 60 minutes',
                                'Real-time uptime monitoring',
                                'Detailed response time analytics',
                                '100% free with no limits'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-sm">
                                    <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                                    <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-md)',
                            animation: 'fadeIn 0.5s ease 0.4s both'
                        }}>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                                Start Monitoring Free
                                <ArrowRight size={18} />
                            </Link>
                            <a href="#features" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Right - Animated Visual */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        {/* Main Card */}
                        <div style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-xl)',
                            width: '100%',
                            maxWidth: '400px',
                            backdropFilter: 'blur(20px)',
                            animation: 'slideUp 0.6s ease 0.3s both'
                        }}>
                            {/* Header */}
                            <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Activity size={24} color="white" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Site Monitor</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● All Systems Online</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 'var(--spacing-md)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                {[
                                    { label: 'Uptime', value: '99.9%', color: 'var(--success)' },
                                    { label: 'Sites', value: '12', color: 'var(--primary)' },
                                    { label: 'Alerts', value: '0', color: 'var(--accent)' }
                                ].map((stat, i) => (
                                    <div key={i} style={{
                                        textAlign: 'center',
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            color: stat.color,
                                            marginBottom: '4px'
                                        }}>
                                            {stat.value}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Website List Preview */}
                            {[
                                { name: 'portfolio.dev', status: 'up', time: '124ms' },
                                { name: 'api.myapp.io', status: 'up', time: '89ms' },
                                { name: 'docs.example.com', status: 'up', time: '156ms' }
                            ].map((site, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: i < 2 ? 'var(--spacing-sm)' : 0
                                }}>
                                    <div className="flex items-center gap-sm">
                                        <span className={`status-dot ${site.status}`} />
                                        <span style={{ fontSize: '0.9rem' }}>{site.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {site.time}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Floating elements */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '20px',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--success)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'white',
                            animation: 'float 3s ease-in-out infinite',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                        }}>
                            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            24/7 Active
                        </div>

                        <div style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '-30px',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: '0.85rem',
                            animation: 'float 4s ease-in-out infinite reverse',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)'
                        }}>
                            <Shield size={16} style={{ color: 'var(--primary)' }} />
                            <span>100% Uptime</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 1024px) {
          section > div > div {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          
          section > div > div > div:last-child {
            display: none !important;
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;
