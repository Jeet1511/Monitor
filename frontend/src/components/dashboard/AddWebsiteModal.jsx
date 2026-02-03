import { useState } from 'react';
import {
    X,
    Globe,
    Clock,
    Settings,
    Shield,
    Tag,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Zap,
    AlertTriangle,
    FileText,
    Wifi,
    Power
} from 'lucide-react';

const AddWebsiteModal = ({ isOpen, onClose, onSubmit, editWebsite = null }) => {
    const [activeSection, setActiveSection] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Basic Info
        name: editWebsite?.name || '',
        url: editWebsite?.url || '',
        description: editWebsite?.description || '',

        // Monitoring Config
        interval: editWebsite?.monitoring?.interval || 5,
        timeout: editWebsite?.monitoring?.timeout || 30,
        method: editWebsite?.monitoring?.method || 'GET',
        followRedirects: editWebsite?.monitoring?.followRedirects ?? true,

        // Expected Response
        statusCodes: editWebsite?.expected?.statusCodes?.join(', ') || '200, 201, 204',
        contentMatch: editWebsite?.expected?.contentMatch || '',
        maxResponseTime: editWebsite?.expected?.maxResponseTime || 5000,

        // Custom Headers
        headers: editWebsite?.headers || [],

        // Organization
        tags: editWebsite?.tags?.join(', ') || '',
        category: editWebsite?.category || 'production',
        priority: editWebsite?.priority || 'medium',

        // Alerting
        alertEnabled: editWebsite?.alerting?.enabled ?? true,
        consecutiveFailures: editWebsite?.alerting?.consecutiveFailures || 2,

        // Maintenance
        maintenanceEnabled: editWebsite?.maintenance?.enabled || false,
        maintenanceReason: editWebsite?.maintenance?.reason || '',

        // Keep-Alive (for Replit, Render, etc.)
        keepAliveEnabled: editWebsite?.keepAlive?.enabled || false,
        keepAlivePlatform: editWebsite?.keepAlive?.platform || 'replit',
        keepAliveAggressive: editWebsite?.keepAlive?.aggressiveMode ?? true
    });

    const [newHeader, setNewHeader] = useState({ key: '', value: '' });

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: Globe },
        { id: 'monitoring', label: 'Monitoring', icon: Clock },
        { id: 'validation', label: 'Validation', icon: Shield },
        { id: 'headers', label: 'Headers', icon: FileText },
        { id: 'organization', label: 'Organization', icon: Tag },
        { id: 'alerting', label: 'Alerting', icon: AlertTriangle },
        { id: 'keepAlive', label: 'Keep-Alive', icon: Wifi }
    ];

    const platforms = [
        { value: 'replit', label: 'Replit', color: '#F26207' },
        { value: 'render', label: 'Render', color: '#46E3B7' },
        { value: 'railway', label: 'Railway', color: '#0B0D0E' },
        { value: 'glitch', label: 'Glitch', color: '#3333FF' },
        { value: 'heroku', label: 'Heroku', color: '#430098' },
        { value: 'other', label: 'Other', color: '#6366F1' }
    ];

    const intervals = [
        { value: 1, label: '1 minute' },
        { value: 5, label: '5 minutes' },
        { value: 15, label: '15 minutes' },
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' }
    ];

    const timeouts = [5, 10, 15, 30, 45, 60];
    const methods = ['GET', 'HEAD', 'POST'];
    const categories = ['production', 'staging', 'development', 'api', 'other'];
    const priorities = ['critical', 'high', 'medium', 'low'];

    const addHeader = () => {
        if (newHeader.key && newHeader.value) {
            setFormData({
                ...formData,
                headers: [...formData.headers, { ...newHeader }]
            });
            setNewHeader({ key: '', value: '' });
        }
    };

    const removeHeader = (index) => {
        setFormData({
            ...formData,
            headers: formData.headers.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                name: formData.name,
                url: formData.url,
                description: formData.description,
                monitoring: {
                    interval: parseInt(formData.interval),
                    timeout: parseInt(formData.timeout),
                    method: formData.method,
                    followRedirects: formData.followRedirects
                },
                expected: {
                    statusCodes: formData.statusCodes.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)),
                    contentMatch: formData.contentMatch || null,
                    maxResponseTime: parseInt(formData.maxResponseTime)
                },
                headers: formData.headers,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
                category: formData.category,
                priority: formData.priority,
                alerting: {
                    enabled: formData.alertEnabled,
                    consecutiveFailures: parseInt(formData.consecutiveFailures)
                },
                maintenance: {
                    enabled: formData.maintenanceEnabled,
                    reason: formData.maintenanceReason
                },
                keepAlive: {
                    enabled: formData.keepAliveEnabled,
                    platform: formData.keepAlivePlatform,
                    aggressiveMode: formData.keepAliveAggressive
                }
            };

            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: 700, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--border-color)',
                    flexShrink: 0
                }}>
                    <div>
                        <h2 style={{ marginBottom: 4 }}>{editWebsite ? 'Edit Website' : 'Add New Website'}</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Configure monitoring settings for your website
                        </p>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: 8 }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Section Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-md)',
                    borderBottom: '1px solid var(--border-color)',
                    overflowX: 'auto',
                    flexShrink: 0
                }}>
                    {sections.map(section => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => setActiveSection(section.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 12px',
                                background: activeSection === section.id ? 'var(--bg-glass)' : 'transparent',
                                border: `1px solid ${activeSection === section.id ? 'var(--border-color)' : 'transparent'}`,
                                borderRadius: 'var(--radius-md)',
                                color: activeSection === section.id ? 'var(--text-primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <section.icon size={14} />
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div style={{ flex: 1, overflow: 'auto', padding: 'var(--spacing-lg)' }}>
                        {/* Basic Info */}
                        {activeSection === 'basic' && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Website Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="form-input"
                                        placeholder="My Website"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">URL *</label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="form-input"
                                        placeholder="https://example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="form-input"
                                        placeholder="Brief description of this website..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Monitoring Settings */}
                        {activeSection === 'monitoring' && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <Clock size={14} style={{ marginRight: 6 }} />
                                        Check Interval
                                    </label>
                                    <select
                                        value={formData.interval}
                                        onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                                        className="form-input"
                                    >
                                        {intervals.map(i => (
                                            <option key={i.value} value={i.value}>{i.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Zap size={14} style={{ marginRight: 6 }} />
                                        Timeout
                                    </label>
                                    <select
                                        value={formData.timeout}
                                        onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                                        className="form-input"
                                    >
                                        {timeouts.map(t => (
                                            <option key={t} value={t}>{t} seconds</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">HTTP Method</label>
                                    <select
                                        value={formData.method}
                                        onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                        className="form-input"
                                    >
                                        {methods.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Follow Redirects</label>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        cursor: 'pointer',
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.followRedirects}
                                            onChange={(e) => setFormData({ ...formData, followRedirects: e.target.checked })}
                                            style={{ width: 18, height: 18 }}
                                        />
                                        <span>Follow HTTP redirects</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Validation Settings */}
                        {activeSection === 'validation' && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Expected Status Codes</label>
                                    <input
                                        type="text"
                                        value={formData.statusCodes}
                                        onChange={(e) => setFormData({ ...formData, statusCodes: e.target.value })}
                                        className="form-input"
                                        placeholder="200, 201, 204"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Comma-separated list of acceptable HTTP status codes
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Response Time (ms)</label>
                                    <input
                                        type="number"
                                        value={formData.maxResponseTime}
                                        onChange={(e) => setFormData({ ...formData, maxResponseTime: e.target.value })}
                                        className="form-input"
                                        min={100}
                                        max={30000}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Warning threshold for slow responses
                                    </p>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Content Verification</label>
                                    <input
                                        type="text"
                                        value={formData.contentMatch}
                                        onChange={(e) => setFormData({ ...formData, contentMatch: e.target.value })}
                                        className="form-input"
                                        placeholder="Text that should appear on the page..."
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Check if the response body contains this text
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Custom Headers */}
                        {activeSection === 'headers' && (
                            <div>
                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 'var(--spacing-sm)' }}>
                                        <input
                                            type="text"
                                            value={newHeader.key}
                                            onChange={(e) => setNewHeader({ ...newHeader, key: e.target.value })}
                                            className="form-input"
                                            placeholder="Header name"
                                        />
                                        <input
                                            type="text"
                                            value={newHeader.value}
                                            onChange={(e) => setNewHeader({ ...newHeader, value: e.target.value })}
                                            className="form-input"
                                            placeholder="Header value"
                                        />
                                        <button
                                            type="button"
                                            onClick={addHeader}
                                            className="btn btn-primary"
                                            style={{ padding: '0 16px' }}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>

                                {formData.headers.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                        {formData.headers.map((header, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: 'var(--spacing-md)',
                                                    background: 'var(--bg-glass)',
                                                    borderRadius: 'var(--radius-md)'
                                                }}
                                            >
                                                <div>
                                                    <span style={{ fontWeight: 600 }}>{header.key}:</span>
                                                    <span style={{ marginLeft: 8, color: 'var(--text-muted)' }}>{header.value}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeHeader(index)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--error)',
                                                        cursor: 'pointer',
                                                        padding: 4
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        padding: 'var(--spacing-xl)',
                                        textAlign: 'center',
                                        color: 'var(--text-muted)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-lg)'
                                    }}>
                                        <FileText size={24} style={{ opacity: 0.5, marginBottom: 8 }} />
                                        <p>No custom headers configured</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Organization */}
                        {activeSection === 'organization' && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="form-input"
                                    >
                                        {categories.map(c => (
                                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="form-input"
                                    >
                                        {priorities.map(p => (
                                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Tags</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="form-input"
                                        placeholder="frontend, api, critical"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Comma-separated tags for filtering
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Alerting */}
                        {activeSection === 'alerting' && (
                            <div className="form-grid">
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        cursor: 'pointer',
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.alertEnabled}
                                            onChange={(e) => setFormData({ ...formData, alertEnabled: e.target.checked })}
                                            style={{ width: 18, height: 18 }}
                                        />
                                        <span>Enable alerts for this website</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Consecutive Failures</label>
                                    <select
                                        value={formData.consecutiveFailures}
                                        onChange={(e) => setFormData({ ...formData, consecutiveFailures: e.target.value })}
                                        className="form-input"
                                        disabled={!formData.alertEnabled}
                                    >
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n} failure{n > 1 ? 's' : ''} before alert</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        cursor: 'pointer',
                                        padding: 'var(--spacing-md)',
                                        background: formData.maintenanceEnabled ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-glass)',
                                        border: formData.maintenanceEnabled ? '1px solid var(--warning)' : '1px solid transparent',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.maintenanceEnabled}
                                            onChange={(e) => setFormData({ ...formData, maintenanceEnabled: e.target.checked })}
                                            style={{ width: 18, height: 18 }}
                                        />
                                        <span>Enable maintenance mode (pauses alerts)</span>
                                    </label>
                                </div>

                                {formData.maintenanceEnabled && (
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Maintenance Reason</label>
                                        <input
                                            type="text"
                                            value={formData.maintenanceReason}
                                            onChange={(e) => setFormData({ ...formData, maintenanceReason: e.target.value })}
                                            className="form-input"
                                            placeholder="Scheduled server upgrade..."
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Keep-Alive Mode */}
                        {activeSection === 'keepAlive' && (
                            <div className="form-grid">
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: 'var(--spacing-md)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <Wifi size={16} style={{ color: 'var(--primary)' }} />
                                            <strong style={{ fontSize: '0.9rem' }}>Keep Your App Awake</strong>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                                            Free-tier hosting services (Replit, Render, Railway, etc.) shut down after inactivity.
                                            Enable keep-alive to ping your app every 1-5 minutes and prevent it from sleeping.
                                        </p>
                                    </div>
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        cursor: 'pointer',
                                        padding: 'var(--spacing-md)',
                                        background: formData.keepAliveEnabled ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-glass)',
                                        border: formData.keepAliveEnabled ? '1px solid var(--success)' : '1px solid transparent',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.keepAliveEnabled}
                                            onChange={(e) => setFormData({ ...formData, keepAliveEnabled: e.target.checked })}
                                            style={{ width: 18, height: 18 }}
                                        />
                                        <div>
                                            <span style={{ fontWeight: 500 }}>Enable Keep-Alive Mode</span>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                                Ping this URL frequently to prevent hosting from putting it to sleep
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {formData.keepAliveEnabled && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Hosting Platform</label>
                                            <select
                                                value={formData.keepAlivePlatform}
                                                onChange={(e) => setFormData({ ...formData, keepAlivePlatform: e.target.value })}
                                                className="form-input"
                                            >
                                                {platforms.map(p => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Ping Interval</label>
                                            <div style={{
                                                padding: 'var(--spacing-md)',
                                                background: 'var(--bg-glass)',
                                                borderRadius: 'var(--radius-md)',
                                                textAlign: 'center'
                                            }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                                                    {formData.keepAliveAggressive ? '1-2' : '5'}
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> minutes</span>
                                            </div>
                                        </div>

                                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                            <label style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-sm)',
                                                cursor: 'pointer',
                                                padding: 'var(--spacing-md)',
                                                background: formData.keepAliveAggressive ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-glass)',
                                                border: formData.keepAliveAggressive ? '1px solid var(--warning)' : '1px solid transparent',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.keepAliveAggressive}
                                                    onChange={(e) => setFormData({ ...formData, keepAliveAggressive: e.target.checked })}
                                                    style={{ width: 18, height: 18 }}
                                                />
                                                <div>
                                                    <span style={{ fontWeight: 500 }}>
                                                        <Zap size={14} style={{ marginRight: 4, color: 'var(--warning)' }} />
                                                        Aggressive Mode
                                                    </span>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                                        Ping every 1-2 minutes (recommended for Replit free tier)
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                            <div style={{
                                                padding: 'var(--spacing-md)',
                                                background: 'var(--bg-glass)',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>Platform Tips:</h4>
                                                {formData.keepAlivePlatform === 'replit' && (
                                                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, paddingLeft: 16 }}>
                                                        <li>Replit free tier sleeps after ~5 minutes of inactivity</li>
                                                        <li>Use aggressive mode for Discord bots and web apps</li>
                                                        <li>Make sure your URL returns a 200 status code</li>
                                                    </ul>
                                                )}
                                                {formData.keepAlivePlatform === 'render' && (
                                                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, paddingLeft: 16 }}>
                                                        <li>Render free tier spins down after 15 minutes</li>
                                                        <li>Cold starts can take 30+ seconds</li>
                                                        <li>Consider upgrading for production workloads</li>
                                                    </ul>
                                                )}
                                                {formData.keepAlivePlatform === 'railway' && (
                                                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, paddingLeft: 16 }}>
                                                        <li>Railway has limited free tier hours</li>
                                                        <li>Monitor your usage to avoid overages</li>
                                                    </ul>
                                                )}
                                                {formData.keepAlivePlatform === 'glitch' && (
                                                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, paddingLeft: 16 }}>
                                                        <li>Glitch projects sleep after 5 minutes</li>
                                                        <li>Projects can be banned for excessive keep-alive pings</li>
                                                    </ul>
                                                )}
                                                {formData.keepAlivePlatform === 'heroku' && (
                                                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, paddingLeft: 16 }}>
                                                        <li>Heroku free tier has been discontinued</li>
                                                        <li>Eco dynos sleep after 30 minutes</li>
                                                    </ul>
                                                )}
                                                {formData.keepAlivePlatform === 'other' && (
                                                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, paddingLeft: 16 }}>
                                                        <li>Adjust the ping interval based on your platform's timeout</li>
                                                        <li>Make sure the ping endpoint is lightweight</li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-lg)',
                        borderTop: '1px solid var(--border-color)',
                        flexShrink: 0
                    }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <div className="loading-spinner" style={{ width: 18, height: 18 }} />
                            ) : (
                                <Plus size={18} />
                            )}
                            {editWebsite ? 'Save Changes' : 'Add Website'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-md);
                }
            `}</style>
        </div>
    );
};

export default AddWebsiteModal;
