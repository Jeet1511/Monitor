import {
    Zap,
    BarChart3,
    Bell,
    Globe,
    Clock,
    Shield,
    Cpu,
    Users
} from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Lightning Fast Pings',
        description: 'Keep your websites active with automated pings every 5-60 minutes. Prevent cold starts on free hosting.',
        color: '#f59e0b'
    },
    {
        icon: BarChart3,
        title: 'Detailed Analytics',
        description: 'Track response times, uptime percentages, and historical data with beautiful visualizations.',
        color: '#6366f1'
    },
    {
        icon: Bell,
        title: 'Instant Alerts',
        description: 'Get notified immediately when your website goes down. Never miss critical downtime again.',
        color: '#ef4444'
    },
    {
        icon: Globe,
        title: 'Global Monitoring',
        description: 'Monitor websites from multiple locations worldwide for accurate uptime tracking.',
        color: '#22d3ee'
    },
    {
        icon: Clock,
        title: '24/7 Uptime',
        description: 'Our service runs continuously to ensure your websites are always being monitored.',
        color: '#10b981'
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Your data is encrypted and secure. We never share your website information.',
        color: '#8b5cf6'
    },
    {
        icon: Cpu,
        title: 'Zero Configuration',
        description: 'Just add your URL and we handle the rest. No complex setup or technical knowledge required.',
        color: '#ec4899'
    },
    {
        icon: Users,
        title: 'Free Forever',
        description: 'Monitor unlimited websites without paying a dime. No hidden fees or credit card required.',
        color: '#14b8a6'
    }
];

const Features = () => {
    return (
        <section id="features" className="section" style={{
            paddingTop: 'var(--spacing-2xl)',
            paddingBottom: 'var(--spacing-2xl)'
        }}>
            <div className="container">
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: 'var(--spacing-sm) var(--spacing-lg)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        color: 'var(--primary-light)',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        Features
                    </span>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
                        Everything You Need to{' '}
                        <span className="text-gradient">Keep Sites Alive</span>
                    </h2>
                    <p style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        fontSize: '1.1rem'
                    }}>
                        Powerful features to monitor and maintain your website uptime without any complexity.
                    </p>
                </div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                cursor: 'default',
                                animation: `fadeIn 0.5s ease ${index * 0.1}s both`
                            }}
                        >
                            <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: 'var(--radius-lg)',
                                background: `${feature.color}15`,
                                border: `1px solid ${feature.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                <feature.icon size={28} style={{ color: feature.color }} />
                            </div>

                            <h3 style={{
                                fontSize: '1.15rem',
                                marginBottom: 'var(--spacing-sm)',
                                color: 'var(--text-primary)'
                            }}>
                                {feature.title}
                            </h3>

                            <p style={{
                                fontSize: '0.9rem',
                                lineHeight: 1.7
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};

export default Features;
