import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { websitesAPI } from '../../utils/api';
import {
    Plus,
    Globe,
    Clock,
    Trash2,
    Edit2,
    ExternalLink,
    X,
    RefreshCw,
    Search,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WebsitesList = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWebsite, setEditingWebsite] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        pingInterval: 15
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [pinging, setPinging] = useState({});

    const fetchWebsites = async () => {
        try {
            const data = await websitesAPI.getAll();
            setWebsites(data.data.websites);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebsites();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);

        try {
            if (editingWebsite) {
                await websitesAPI.update(editingWebsite._id, formData);
            } else {
                await websitesAPI.create(formData);
            }
            setShowModal(false);
            setFormData({ name: '', url: '', pingInterval: 15 });
            setEditingWebsite(null);
            fetchWebsites();
        } catch (error) {
            setFormError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this website?')) return;
        try {
            await websitesAPI.delete(id);
            fetchWebsites();
        } catch (error) {
            alert('Failed to delete website');
        }
    };

    const handlePing = async (id) => {
        setPinging(prev => ({ ...prev, [id]: true }));
        try {
            await websitesAPI.ping(id);
            fetchWebsites();
        } catch (error) {
            console.error('Ping failed:', error);
        } finally {
            setPinging(prev => ({ ...prev, [id]: false }));
        }
    };

    const openEditModal = (website) => {
        setEditingWebsite(website);
        setFormData({
            name: website.name,
            url: website.url,
            pingInterval: website.pingInterval
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingWebsite(null);
        setFormData({ name: '', url: '', pingInterval: 15 });
        setFormError('');
    };

    const filteredWebsites = websites.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-center" style={{ minHeight: '400px' }}>
                    <div className="loading-spinner" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>Websites</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage your monitored websites
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Add Website
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 'var(--spacing-lg)', position: 'relative', maxWidth: '400px' }}>
                <Search size={18} style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                }} />
                <input
                    type="text"
                    placeholder="Search websites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                />
            </div>

            {/* Websites Grid */}
            {filteredWebsites.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <Globe size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
                    <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>
                        {searchTerm ? 'No websites found' : 'No websites yet'}
                    </h3>
                    <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {searchTerm ? 'Try a different search term' : 'Add your first website to start monitoring'}
                    </p>
                    {!searchTerm && (
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={18} />
                            Add Website
                        </button>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    {filteredWebsites.map((website) => (
                        <div key={website._id} className="card">
                            <div className="flex justify-between items-start" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm">
                                        <h4>{website.name}</h4>
                                        <span className={`badge badge-${website.lastStatus === 'up' ? 'success' : website.lastStatus === 'down' ? 'error' : 'warning'}`}>
                                            {website.lastStatus}
                                        </span>
                                    </div>
                                    <a
                                        href={website.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            wordBreak: 'break-all'
                                        }}
                                    >
                                        {website.url}
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 'var(--spacing-sm)',
                                marginBottom: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Uptime</div>
                                    <div style={{ fontWeight: 600, color: website.uptime >= 99 ? 'var(--success)' : 'var(--warning)' }}>
                                        {website.uptime}%
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Response</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {website.lastResponseTime ? `${website.lastResponseTime}ms` : '--'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Interval</div>
                                    <div className="flex items-center gap-xs">
                                        <Clock size={12} />
                                        <span style={{ fontWeight: 600 }}>{website.pingInterval}m</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-sm">
                                <Link
                                    to={`/websites/${website._id}`}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}
                                >
                                    View Details
                                </Link>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: '10px' }}
                                    onClick={() => handlePing(website._id)}
                                    disabled={pinging[website._id]}
                                >
                                    <Zap size={16} className={pinging[website._id] ? 'animate-pulse' : ''} />
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: '10px' }}
                                    onClick={() => openEditModal(website)}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    style={{ padding: '10px', color: 'var(--error)' }}
                                    onClick={() => handleDelete(website._id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingWebsite ? 'Edit Website' : 'Add Website'}
                            </h3>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {formError && (
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--error)',
                                        fontSize: '0.9rem',
                                        marginBottom: 'var(--spacing-lg)'
                                    }}>
                                        {formError}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Website Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="form-input"
                                        placeholder="My Portfolio"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">URL</label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="form-input"
                                        placeholder="https://example.com"
                                        required
                                        disabled={!!editingWebsite}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ping Interval</label>
                                    <select
                                        value={formData.pingInterval}
                                        onChange={(e) => setFormData({ ...formData, pingInterval: parseInt(e.target.value) })}
                                        className="form-select"
                                    >
                                        <option value={5}>Every 5 minutes</option>
                                        <option value={15}>Every 15 minutes</option>
                                        <option value={30}>Every 30 minutes</option>
                                        <option value={60}>Every 60 minutes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? (
                                        <div className="loading-spinner" style={{ width: 18, height: 18 }} />
                                    ) : (
                                        editingWebsite ? 'Save Changes' : 'Add Website'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default WebsitesList;
