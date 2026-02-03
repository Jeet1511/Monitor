import { useState } from 'react';
import AdminLayout from './AdminLayout';
import {
    Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw,
    CheckCircle, AlertTriangle, Clock, Shield
} from 'lucide-react';

const AdminApiKeys = () => {
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'Production API', key: 'sm_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: new Date(Date.now() - 30 * 86400000).toISOString(), lastUsed: new Date(Date.now() - 3600000).toISOString(), status: 'active', permissions: ['read', 'write'] },
        { id: 2, name: 'Development API', key: 'sm_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: new Date(Date.now() - 60 * 86400000).toISOString(), lastUsed: new Date(Date.now() - 86400000).toISOString(), status: 'active', permissions: ['read'] },
        { id: 3, name: 'Webhook Integration', key: 'sm_hook_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', created: new Date(Date.now() - 90 * 86400000).toISOString(), lastUsed: null, status: 'inactive', permissions: ['webhook'] },
    ]);
    const [showKey, setShowKey] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');

    const toggleShowKey = (id) => {
        setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyKey = (key) => {
        navigator.clipboard.writeText(key);
        alert('API key copied to clipboard!');
    };

    const regenerateKey = (id) => {
        if (confirm('Regenerate this API key? The old key will stop working immediately.')) {
            const newKey = 'sm_live_' + Math.random().toString(36).substring(2, 34);
            setApiKeys(prev => prev.map(k =>
                k.id === id ? { ...k, key: newKey, created: new Date().toISOString() } : k
            ));
            alert('Key regenerated successfully!');
        }
    };

    const deleteKey = (id) => {
        if (confirm('Delete this API key? This action cannot be undone.')) {
            setApiKeys(prev => prev.filter(k => k.id !== id));
        }
    };

    const createKey = () => {
        if (!newKeyName.trim()) return alert('Please enter a key name');
        const newKey = {
            id: Date.now(),
            name: newKeyName,
            key: 'sm_live_' + Math.random().toString(36).substring(2, 34),
            created: new Date().toISOString(),
            lastUsed: null,
            status: 'active',
            permissions: ['read', 'write']
        };
        setApiKeys(prev => [...prev, newKey]);
        setNewKeyName('');
        setShowCreateModal(false);
        alert('API key created! Make sure to copy it now - you won\'t be able to see it again.');
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <Key size={28} style={{ color: 'var(--warning)' }} /> API Keys
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage API keys for external integrations</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <Plus size={16} /> Create New Key
                    </button>
                </header>

                {/* Warning Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Keep your API keys secure</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Never share your API keys publicly or commit them to source control.</div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{apiKeys.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Keys</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{apiKeys.filter(k => k.status === 'active').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-muted)' }}>{apiKeys.filter(k => k.status === 'inactive').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Inactive</div>
                    </div>
                </div>

                {/* API Keys List */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} style={{
                            background: 'var(--bg-glass)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            padding: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{apiKey.name}</h3>
                                        <span style={{
                                            background: apiKey.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                            color: apiKey.status === 'active' ? 'var(--success)' : 'var(--text-muted)',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>{apiKey.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span><Clock size={12} style={{ marginRight: '0.25rem' }} /> Created: {new Date(apiKey.created).toLocaleDateString()}</span>
                                        <span>Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => regenerateKey(apiKey.id)}
                                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
                                        title="Regenerate"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteKey(apiKey.id)}
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem', borderRadius: '6px', color: 'var(--error)', cursor: 'pointer' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'var(--bg-tertiary)',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <code style={{ flex: 1, fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {showKey[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 8) + '••••••••••••••••••••••••••••••••'}
                                </code>
                                <button
                                    onClick={() => toggleShowKey(apiKey.id)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                                >
                                    {showKey[apiKey.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={() => copyKey(apiKey.key)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.25rem' }}
                                >
                                    <Copy size={16} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Permissions:</span>
                                {apiKey.permissions.map(p => (
                                    <span key={p} style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--primary)',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem'
                                    }}>{p}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowCreateModal(false)}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', width: '400px' }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Create New API Key</h3>
                            <input
                                type="text"
                                placeholder="Key name (e.g., Production API)"
                                value={newKeyName}
                                onChange={e => setNewKeyName(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', marginBottom: '1.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={createKey} style={{ flex: 1, padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Create Key</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminApiKeys;
