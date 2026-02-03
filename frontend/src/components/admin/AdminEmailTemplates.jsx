import { useState } from 'react';
import AdminLayout from './AdminLayout';
import {
    Mail, Save, Plus, Edit, Trash2, Eye, Copy,
    CheckCircle, X, AlertTriangle, RefreshCw
} from 'lucide-react';

const AdminEmailTemplates = () => {
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Welcome Email', subject: 'Welcome to Site Monitor!', type: 'welcome', active: true, lastEdited: new Date().toISOString() },
        { id: 2, name: 'Password Reset', subject: 'Reset Your Password', type: 'password_reset', active: true, lastEdited: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, name: 'Website Down Alert', subject: 'Alert: Your website is DOWN', type: 'alert_down', active: true, lastEdited: new Date(Date.now() - 172800000).toISOString() },
        { id: 4, name: 'Website Up', subject: 'Great news: Your website is back UP', type: 'alert_up', active: true, lastEdited: new Date(Date.now() - 259200000).toISOString() },
        { id: 5, name: 'Weekly Report', subject: 'Your Weekly Monitoring Report', type: 'report', active: false, lastEdited: new Date(Date.now() - 604800000).toISOString() },
    ]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editContent, setEditContent] = useState('');

    const templateContent = {
        welcome: `Hi {{name}},\n\nWelcome to Site Monitor! We're excited to have you on board.\n\nYou can start adding websites to monitor right away.\n\nBest regards,\nThe Site Monitor Team`,
        password_reset: `Hi {{name}},\n\nYou requested a password reset. Click the link below:\n\n{{reset_link}}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Site Monitor Team`,
        alert_down: `ALERT: {{website_name}} is DOWN!\n\nWe detected that your website {{website_url}} is not responding.\n\nStatus: DOWN\nLast Check: {{timestamp}}\nResponse Time: {{response_time}}\n\nWe'll continue monitoring and notify you when it's back up.`,
        alert_up: `Great news! {{website_name}} is back UP!\n\nYour website {{website_url}} is responding again.\n\nDowntime Duration: {{downtime}}\nCurrent Status: UP\n\nThank you for using Site Monitor!`,
        report: `Weekly Monitoring Report for {{name}}\n\n---\n\nSummary:\n• Total Websites: {{total_websites}}\n• Uptime Rate: {{uptime_rate}}\n• Total Pings: {{total_pings}}\n• Incidents: {{incidents}}\n\n---\n\nView detailed report: {{report_link}}`
    };

    const selectTemplate = (template) => {
        setSelectedTemplate(template);
        setEditContent(templateContent[template.type] || '');
        setEditMode(false);
    };

    const saveTemplate = () => {
        alert('Template saved successfully!');
        setEditMode(false);
    };

    const toggleActive = (id) => {
        setTemplates(prev => prev.map(t =>
            t.id === id ? { ...t, active: !t.active } : t
        ));
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <Mail size={28} style={{ color: 'var(--primary)' }} /> Email Templates
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Customize email notifications sent to users</p>
                    </div>
                    <button
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <Plus size={16} /> New Template
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem' }}>
                    {/* Template List */}
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Templates</h3>
                        </div>
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => selectTemplate(template)}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        background: selectedTemplate?.id === template.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{template.name}</span>
                                        <span style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: template.active ? 'var(--success)' : 'var(--text-muted)'
                                        }} />
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{template.subject}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Template Editor */}
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        {selectedTemplate ? (
                            <>
                                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{selectedTemplate.name}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Subject: {selectedTemplate.subject}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => toggleActive(selectedTemplate.id)}
                                            style={{
                                                background: selectedTemplate.active ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                                                border: `1px solid ${selectedTemplate.active ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                color: selectedTemplate.active ? 'var(--success)' : 'var(--text-muted)',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {selectedTemplate.active ? '● Active' : '○ Inactive'}
                                        </button>
                                        {editMode ? (
                                            <button
                                                onClick={saveTemplate}
                                                style={{ background: 'var(--success)', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <Save size={14} /> Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setEditMode(true)}
                                                style={{ background: 'var(--primary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <Edit size={14} /> Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    {editMode ? (
                                        <textarea
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            style={{
                                                width: '100%',
                                                minHeight: '300px',
                                                background: 'var(--bg-tertiary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'monospace',
                                                fontSize: '0.9rem',
                                                resize: 'vertical'
                                            }}
                                        />
                                    ) : (
                                        <pre style={{
                                            background: 'var(--bg-tertiary)',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                            whiteSpace: 'pre-wrap',
                                            fontFamily: 'monospace',
                                            margin: 0
                                        }}>
                                            {editContent}
                                        </pre>
                                    )}
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Available Variables</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {['{{name}}', '{{email}}', '{{website_name}}', '{{website_url}}', '{{timestamp}}', '{{reset_link}}'].map(v => (
                                                <code key={v} style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v}</code>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '4rem', textAlign: 'center' }}>
                                <Mail size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Select a Template</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Choose a template from the list to view or edit</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminEmailTemplates;
