import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminLogin, isAdmin } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already logged in as admin, redirect
    useEffect(() => {
        if (isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await adminLogin(formData.email, formData.password);

        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)'
        }}>
            <div style={{
                position: 'fixed',
                top: '30%',
                right: '30%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                zIndex: -1
            }} />

            <div style={{
                width: '100%',
                maxWidth: '440px',
                animation: 'slideUp 0.5s ease'
            }}>
                <Link to="/" className="flex items-center justify-center gap-sm" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <Shield size={36} style={{ color: 'var(--error)' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Admin Panel
                    </span>
                </Link>

                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--spacing-xl)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: 'var(--spacing-xs)',
                        fontSize: '1.5rem'
                    }}>
                        Admin Login
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        marginBottom: 'var(--spacing-xl)',
                        color: 'var(--text-secondary)'
                    }}>
                        Access the administration panel
                    </p>

                    {error && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--error)',
                            fontSize: '0.9rem',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Admin Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input"
                                    placeholder="admin@sitemonitor.com"
                                    required
                                    style={{ paddingLeft: '44px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="form-input"
                                    placeholder="••••••••"
                                    required
                                    style={{ paddingLeft: '44px', paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                            style={{
                                marginTop: 'var(--spacing-md)',
                                padding: '14px',
                                background: 'linear-gradient(135deg, var(--error), #dc2626)'
                            }}
                        >
                            {loading ? (
                                <div className="loading-spinner" style={{ width: 20, height: 20 }} />
                            ) : (
                                <>
                                    Access Admin Panel
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p style={{
                    textAlign: 'center',
                    marginTop: 'var(--spacing-lg)',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                }}>
                    <Link to="/login" style={{ color: 'var(--text-secondary)' }}>
                        ← Back to User Login
                    </Link>
                </p>
            </div>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AdminLogin;
