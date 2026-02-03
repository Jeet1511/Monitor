import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Clock, RefreshCw, Search, Globe, CheckCircle, XCircle,
    Eye, Zap, Trash2, AlertTriangle, ExternalLink, User
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminPendingWebsites = () => {
    const [websites, setWebsites] = useState([]);
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
        const fetchPendingWebsites = async () => {
            try {
                const data = await fetchWithAuth(`${API_BASE}/websites`);
                const pending = (data.data?.websites || []).filter(w => w.lastStatus === 'pending');
                setWebsites(pending);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingWebsites();
    }, []);

    const forcePing = async (websiteId) => {
        try {
            await fetchWithAuth(`${API_BASE}/websites/${websiteId}/force-ping`, { method: 'POST' });
            // Refresh list
            const data = await fetchWithAuth(`${API_BASE}/websites`);
            const pending = (data.data?.websites || []).filter(w => w.lastStatus === 'pending');
            setWebsites(pending);
            alert('Ping initiated! Status will update shortly.');
        } catch (error) {
            console.error('Ping error:', error);
        }
    };

    const approveWebsite = async (websiteId) => {
        await forcePing(websiteId);
    };

    const rejectWebsite = async (websiteId) => {
        if (confirm('Reject and delete this website?')) {
            try {
                await fetchWithAuth(`${API_BASE}/websites/${websiteId}`, { method: 'DELETE' });
                setWebsites(prev => prev.filter(w => w._id !== websiteId));
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <Clock size={28} style={{ color: 'var(--warning)' }} /> Pending Websites
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Review and approve newly added websites awaiting first ping</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--warning)' }}>{websites.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Approval</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>0</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Approved Today</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--error)' }}>0</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rejected Today</div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading pending websites...</p>
                    </div>
                ) : websites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Pending Websites</h3>
                        <p style={{ color: 'var(--text-muted)' }}>All websites have been reviewed</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {websites.map((website) => (
                            <div key={website._id} style={{
                                background: 'var(--bg-glass)',
                                borderRadius: '12px',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                padding: '1.5rem',
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '1rem',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Globe size={20} style={{ color: 'var(--warning)' }} />
                                        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{website.name}</h3>
                                        <span style={{
                                            background: 'rgba(245, 158, 11, 0.2)',
                                            color: 'var(--warning)',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 600
                                        }}>PENDING</span>
                                    </div>
                                    <a href={website.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        {website.url} <ExternalLink size={12} />
                                    </a>
                                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <User size={14} /> {website.userId?.name || 'Unknown'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={14} /> Added {new Date(website.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => approveWebsite(website._id)}
                                        style={{
                                            background: 'linear-gradient(135deg, var(--success), #059669)',
                                            border: 'none',
                                            padding: '0.75rem 1.25rem',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        <Zap size={16} /> Ping & Approve
                                    </button>
                                    <button
                                        onClick={() => rejectWebsite(website._id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            color: 'var(--error)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Trash2 size={16} /> Reject
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

export default AdminPendingWebsites;
