import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    AlertTriangle, RefreshCw, Search, XCircle, Clock,
    Filter, ChevronDown, ExternalLink, Copy, Trash2
} from 'lucide-react';

const AdminErrorLogs = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Generate mock error logs
        setTimeout(() => {
            const mockErrors = [
                { id: 1, type: 'PING_FAILED', message: 'Connection timeout to api.example.com', timestamp: new Date(Date.now() - 3600000).toISOString(), source: 'Monitor Service', severity: 'high', count: 3 },
                { id: 2, type: 'AUTH_ERROR', message: 'Invalid token for user session', timestamp: new Date(Date.now() - 7200000).toISOString(), source: 'Auth Service', severity: 'medium', count: 1 },
                { id: 3, type: 'DATABASE', message: 'Query timeout exceeded 30s limit', timestamp: new Date(Date.now() - 10800000).toISOString(), source: 'MongoDB', severity: 'critical', count: 2 },
                { id: 4, type: 'API_ERROR', message: 'Rate limit exceeded for external API', timestamp: new Date(Date.now() - 14400000).toISOString(), source: 'API Gateway', severity: 'low', count: 5 },
                { id: 5, type: 'SSL_ERROR', message: 'Certificate validation failed', timestamp: new Date(Date.now() - 18000000).toISOString(), source: 'Monitor Service', severity: 'high', count: 1 },
            ];
            setErrors(mockErrors);
            setLoading(false);
        }, 500);
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'var(--error)';
            case 'high': return '#f97316';
            case 'medium': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    const filteredErrors = errors.filter(e => {
        if (filter !== 'all' && e.severity !== filter) return false;
        if (searchTerm && !e.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const clearError = (id) => {
        setErrors(prev => prev.filter(e => e.id !== id));
    };

    const clearAll = () => {
        if (confirm('Clear all error logs?')) {
            setErrors([]);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <AlertTriangle size={28} style={{ color: 'var(--error)' }} /> Error Logs
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Monitor and troubleshoot system errors</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={clearAll}
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        >
                            <Trash2 size={16} /> Clear All
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        >
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>{errors.filter(e => e.severity === 'critical').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Critical</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316' }}>{errors.filter(e => e.severity === 'high').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>High</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{errors.filter(e => e.severity === 'medium').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Medium</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-muted)' }}>{errors.filter(e => e.severity === 'low').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Low</div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Search size={18} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search errors..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '200px' }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                        <option value="all">All Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading error logs...</p>
                    </div>
                ) : filteredErrors.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <XCircle size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Errors Found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>All systems operating normally</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {filteredErrors.map((error) => (
                            <div key={error.id} style={{
                                background: 'var(--bg-glass)',
                                borderRadius: '12px',
                                border: `1px solid ${getSeverityColor(error.severity)}30`,
                                borderLeft: `4px solid ${getSeverityColor(error.severity)}`,
                                padding: '1rem 1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            background: `${getSeverityColor(error.severity)}20`,
                                            color: getSeverityColor(error.severity),
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 600
                                        }}>{error.type}</span>
                                        <span style={{
                                            background: `${getSeverityColor(error.severity)}20`,
                                            color: getSeverityColor(error.severity),
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.65rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>{error.severity}</span>
                                        {error.count > 1 && (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>×{error.count} occurrences</span>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>{error.message}</p>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={12} /> {new Date(error.timestamp).toLocaleString()}
                                        </span>
                                        <span>Source: {error.source}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(error.message)}
                                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
                                        title="Copy error"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <button
                                        onClick={() => clearError(error.id)}
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem', borderRadius: '6px', color: 'var(--error)', cursor: 'pointer' }}
                                        title="Dismiss"
                                    >
                                        <XCircle size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminErrorLogs;
