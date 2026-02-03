import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Flag, RefreshCw, Search, Globe, CheckCircle, XCircle,
    Eye, AlertTriangle, Trash2, ExternalLink, User, Shield, Ban
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminFlaggedSites = () => {
    const [flaggedSites, setFlaggedSites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(url, {
            ...options,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers }
        });
        return res.json();
    };

    useEffect(() => {
        const fetchFlaggedSites = async () => {
            try {
                const data = await fetchWithAuth(`${API_BASE}/websites`);
                // Mock flagged sites - in production this would be based on actual flagging system
                const sites = (data.data?.websites || []).slice(0, 2).map((site, i) => ({
                    ...site,
                    flagReason: ['Suspicious activity detected', 'High error rate', 'Malware detected', 'Phishing report'][i % 4],
                    flaggedAt: new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString(),
                    flagCount: Math.floor(Math.random() * 5) + 1,
                    severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)]
                }));
                setFlaggedSites(sites);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlaggedSites();
    }, []);

    const dismissFlag = (siteId) => {
        if (confirm('Dismiss this flag? The site will be marked as reviewed.')) {
            setFlaggedSites(prev => prev.filter(s => s._id !== siteId));
        }
    };

    const blockSite = async (siteId) => {
        if (confirm('Block this website? It will be disabled and the owner notified.')) {
            try {
                await fetchWithAuth(`${API_BASE}/websites/${siteId}`, { method: 'DELETE' });
                setFlaggedSites(prev => prev.filter(s => s._id !== siteId));
            } catch (error) {
                console.error('Block error:', error);
            }
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'var(--error)';
            case 'high': return '#f97316';
            case 'medium': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <Flag size={28} style={{ color: 'var(--error)' }} /> Flagged Websites
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Review websites flagged for security issues or policy violations</p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>{flaggedSites.filter(s => s.severity === 'critical').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Critical</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316' }}>{flaggedSites.filter(s => s.severity === 'high').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>High</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{flaggedSites.filter(s => s.severity === 'medium').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Medium</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-muted)' }}>{flaggedSites.filter(s => s.severity === 'low').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Low</div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading flagged sites...</p>
                    </div>
                ) : flaggedSites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <Shield size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Flagged Websites</h3>
                        <p style={{ color: 'var(--text-muted)' }}>All sites are operating normally</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {flaggedSites.map((site) => (
                            <div key={site._id} style={{
                                background: 'var(--bg-glass)',
                                borderRadius: '12px',
                                border: `1px solid ${getSeverityColor(site.severity)}30`,
                                borderLeft: `4px solid ${getSeverityColor(site.severity)}`,
                                padding: '1.5rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <AlertTriangle size={20} style={{ color: getSeverityColor(site.severity) }} />
                                            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{site.name}</h3>
                                            <span style={{
                                                background: `${getSeverityColor(site.severity)}20`,
                                                color: getSeverityColor(site.severity),
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase'
                                            }}>{site.severity}</span>
                                        </div>
                                        <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                                            {site.url} <ExternalLink size={12} />
                                        </a>
                                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                                            <div style={{ color: 'var(--error)', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Flag size={14} /> {site.flagReason}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <span><User size={14} style={{ marginRight: '0.25rem' }} /> {site.userId?.name || 'Unknown'}</span>
                                            <span>Flagged: {new Date(site.flaggedAt).toLocaleDateString()}</span>
                                            <span>{site.flagCount} report(s)</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => dismissFlag(site._id)}
                                            style={{
                                                background: 'var(--bg-tertiary)',
                                                border: '1px solid var(--border-color)',
                                                padding: '0.6rem 1rem',
                                                borderRadius: '8px',
                                                color: 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <CheckCircle size={16} /> Dismiss
                                        </button>
                                        <button
                                            onClick={() => blockSite(site._id)}
                                            style={{
                                                background: 'var(--error)',
                                                border: 'none',
                                                padding: '0.6rem 1rem',
                                                borderRadius: '8px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <Ban size={16} /> Block Site
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminFlaggedSites;
