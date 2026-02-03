import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Layers, RefreshCw, Search, Globe, CheckCircle, Trash2,
    Zap, Power, PowerOff, CheckSquare, Square, AlertTriangle
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminBulkOperations = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(url, {
            ...options,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers }
        });
        return res.json();
    };

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const data = await fetchWithAuth(`${API_BASE}/websites`);
                setWebsites(data.data?.websites || []);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWebsites();
    }, []);

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === filteredWebsites.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredWebsites.map(w => w._id));
        }
    };

    const bulkPing = async () => {
        if (selectedIds.length === 0) return alert('Select websites first');
        setProcessing(true);
        try {
            for (const id of selectedIds) {
                await fetchWithAuth(`${API_BASE}/websites/${id}/force-ping`, { method: 'POST' });
            }
            alert(`Pinged ${selectedIds.length} websites`);
            setSelectedIds([]);
            // Refresh
            const data = await fetchWithAuth(`${API_BASE}/websites`);
            setWebsites(data.data?.websites || []);
        } catch (error) {
            console.error('Bulk ping error:', error);
        } finally {
            setProcessing(false);
        }
    };

    const bulkDelete = async () => {
        if (selectedIds.length === 0) return alert('Select websites first');
        if (!confirm(`Delete ${selectedIds.length} websites? This cannot be undone!`)) return;
        setProcessing(true);
        try {
            for (const id of selectedIds) {
                await fetchWithAuth(`${API_BASE}/websites/${id}`, { method: 'DELETE' });
            }
            setWebsites(prev => prev.filter(w => !selectedIds.includes(w._id)));
            setSelectedIds([]);
            alert(`Deleted ${selectedIds.length} websites`);
        } catch (error) {
            console.error('Bulk delete error:', error);
        } finally {
            setProcessing(false);
        }
    };

    const filteredWebsites = websites.filter(w =>
        w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.url?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <Layers size={28} style={{ color: 'var(--primary)' }} /> Bulk Operations
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Perform batch actions on multiple websites at once</p>
                    </div>
                </header>

                {/* Bulk Actions Bar */}
                <div style={{
                    background: selectedIds.length > 0 ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))' : 'var(--bg-glass)',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${selectedIds.length > 0 ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-color)'}`,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{
                            fontWeight: 600,
                            color: selectedIds.length > 0 ? 'var(--primary)' : 'var(--text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            {selectedIds.length} of {filteredWebsites.length} selected
                        </span>
                        <button onClick={selectAll} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                            {selectedIds.length === filteredWebsites.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={bulkPing}
                            disabled={selectedIds.length === 0 || processing}
                            style={{
                                background: 'var(--primary)',
                                border: 'none',
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                                opacity: selectedIds.length > 0 ? 1 : 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 500
                            }}
                        >
                            <Zap size={16} /> Ping All
                        </button>
                        <button
                            onClick={bulkDelete}
                            disabled={selectedIds.length === 0 || processing}
                            style={{
                                background: 'var(--error)',
                                border: 'none',
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
                                opacity: selectedIds.length > 0 ? 1 : 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 500
                            }}
                        >
                            <Trash2 size={16} /> Delete All
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem', width: 'fit-content' }}>
                    <Search size={18} style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search websites..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '250px' }}
                    />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading websites...</p>
                    </div>
                ) : (
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', width: '40px' }}>
                                        <button onClick={selectAll} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            {selectedIds.length === filteredWebsites.length && filteredWebsites.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </button>
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>WEBSITE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>STATUS</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>OWNER</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>LAST PING</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWebsites.map((website) => (
                                    <tr
                                        key={website._id}
                                        onClick={() => toggleSelect(website._id)}
                                        style={{
                                            borderBottom: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            background: selectedIds.includes(website._id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                                        }}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            {selectedIds.includes(website._id) ?
                                                <CheckSquare size={18} style={{ color: 'var(--primary)' }} /> :
                                                <Square size={18} style={{ color: 'var(--text-muted)' }} />
                                            }
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{website.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{website.url}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: website.lastStatus === 'up' ? 'rgba(16, 185, 129, 0.2)' :
                                                    website.lastStatus === 'down' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: website.lastStatus === 'up' ? 'var(--success)' :
                                                    website.lastStatus === 'down' ? 'var(--error)' : 'var(--warning)'
                                            }}>
                                                {website.lastStatus?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{website.userId?.name || 'Unknown'}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {website.lastChecked ? new Date(website.lastChecked).toLocaleString() : 'Never'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminBulkOperations;
