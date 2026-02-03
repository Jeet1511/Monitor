import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
    return (
        <section id="contact" className="section" style={{
            paddingTop: 'var(--spacing-2xl)',
            paddingBottom: 'var(--spacing-2xl)'
        }}>
            <div className="container">
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(34, 211, 238, 0.1))',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--spacing-2xl)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative elements */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        opacity: 0.3
                    }}>
                        <Sparkles size={40} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        opacity: 0.3
                    }}>
                        <Sparkles size={40} style={{ color: 'var(--primary)' }} />
                    </div>

                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
                        Ready to Keep Your{' '}
                        <span className="text-gradient">Sites Alive?</span>
                    </h2>

                    <p style={{
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-xl)'
                    }}>
                        Join thousands of developers who trust Site Monitor to keep their applications
                        running smoothly. It's completely free!
                    </p>

                    <div className="flex justify-center gap-md" style={{ flexWrap: 'wrap' }}>
                        <Link
                            to="/signup"
                            className="btn btn-primary"
                            style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1rem'
                            }}
                        >
                            Get Started Free
                            <ArrowRight size={18} />
                        </Link>

                        <a
                            href="https://github.com/Jeet1511"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1rem'
                            }}
                        >
                            View on GitHub
                        </a>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--spacing-2xl)',
                        marginTop: 'var(--spacing-2xl)',
                        paddingTop: 'var(--spacing-xl)',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        {[
                            { value: '100%', label: 'Free Forever' },
                            { value: '24/7', label: 'Monitoring' },
                            { value: '∞', label: 'Websites' }
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: 'var(--spacing-xs)'
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
