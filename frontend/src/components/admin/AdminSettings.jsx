import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Settings, Save, RefreshCw, Globe, Mail, Bell, Shield,
    Clock, Database, Wrench, AlertTriangle, Check, X,
    Power, Palette, Key
} from 'lucide-react';
import './AdminDashboard.css';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'Site Monitor',
        siteUrl: 'http://localhost:5173',
        adminEmail: 'admin@example.com',
        maxWebsitesPerUser: 10,
        defaultPingInterval: 5,
        maintenanceMode: false,
        emailNotifications: true,
        slackNotifications: false,
        discordNotifications: false,
        darkModeDefault: true,
        allowRegistration: true,
        requireEmailVerification: false,
        maxLoginAttempts: 5,
        sessionTimeout: 24,
        apiRateLimit: 100,
        dataRetentionDays: 90
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });
            const data = await response.json();
            if (data.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const SettingSection = ({ title, icon: Icon, children }) => (
        <div className="admin-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{
                marginBottom: 'var(--spacing-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                color: 'var(--text-primary)',
                paddingBottom: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <Icon size={20} />
                {title}
            </h3>
            {children}
        </div>
    );

    const SettingRow = ({ label, description, children }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--spacing-md) 0',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
                {description && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {description}
                    </div>
                )}
            </div>
            {children}
        </div>
    );

    const Toggle = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: 'none',
                background: checked ? 'var(--success)' : 'var(--bg-glass)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s'
            }}
        >
            <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: 3,
                left: checked ? 25 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
        </button>
    );

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">
                        <Settings size={32} />
                        Global Settings
                    </h1>
                    <p className="admin-subtitle">Configure platform-wide settings and preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    className="admin-btn admin-btn-primary"
                    disabled={saving}
                    style={{ gap: 'var(--spacing-sm)' }}
                >
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* General Settings */}
            <SettingSection title="General Settings" icon={Globe}>
                <SettingRow label="Site Name" description="Display name for the platform">
                    <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleChange('siteName', e.target.value)}
                        className="setting-input"
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '200px'
                        }}
                    />
                </SettingRow>
                <SettingRow label="Admin Email" description="Primary admin contact email">
                    <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => handleChange('adminEmail', e.target.value)}
                        className="setting-input"
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '200px'
                        }}
                    />
                </SettingRow>
            </SettingSection>

            {/* Monitoring Settings */}
            <SettingSection title="Monitoring Settings" icon={Clock}>
                <SettingRow label="Max Websites Per User" description="Maximum websites each user can monitor">
                    <input
                        type="number"
                        value={settings.maxWebsitesPerUser}
                        onChange={(e) => handleChange('maxWebsitesPerUser', parseInt(e.target.value))}
                        min="1"
                        max="100"
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '100px'
                        }}
                    />
                </SettingRow>
                <SettingRow label="Default Ping Interval" description="Default monitoring interval (minutes)">
                    <select
                        value={settings.defaultPingInterval}
                        onChange={(e) => handleChange('defaultPingInterval', parseInt(e.target.value))}
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '120px'
                        }}
                    >
                        <option value={1}>1 minute</option>
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                    </select>
                </SettingRow>
                <SettingRow label="Data Retention" description="How long to keep ping history (days)">
                    <select
                        value={settings.dataRetentionDays}
                        onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '120px'
                        }}
                    >
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                        <option value={180}>180 days</option>
                        <option value={365}>1 year</option>
                    </select>
                </SettingRow>
            </SettingSection>

            {/* Notifications */}
            <SettingSection title="Notifications" icon={Bell}>
                <SettingRow label="Email Notifications" description="Send email alerts for website status changes">
                    <Toggle
                        checked={settings.emailNotifications}
                        onChange={(v) => handleChange('emailNotifications', v)}
                    />
                </SettingRow>
                <SettingRow label="Slack Notifications" description="Send alerts to Slack channels">
                    <Toggle
                        checked={settings.slackNotifications}
                        onChange={(v) => handleChange('slackNotifications', v)}
                    />
                </SettingRow>
                <SettingRow label="Discord Notifications" description="Send alerts to Discord webhooks">
                    <Toggle
                        checked={settings.discordNotifications}
                        onChange={(v) => handleChange('discordNotifications', v)}
                    />
                </SettingRow>
            </SettingSection>

            {/* Security Settings */}
            <SettingSection title="Security Settings" icon={Shield}>
                <SettingRow label="Allow Registration" description="Allow new users to register">
                    <Toggle
                        checked={settings.allowRegistration}
                        onChange={(v) => handleChange('allowRegistration', v)}
                    />
                </SettingRow>
                <SettingRow label="Require Email Verification" description="Users must verify email before access">
                    <Toggle
                        checked={settings.requireEmailVerification}
                        onChange={(v) => handleChange('requireEmailVerification', v)}
                    />
                </SettingRow>
                <SettingRow label="Max Login Attempts" description="Lock account after failed attempts">
                    <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                        min="3"
                        max="20"
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '100px'
                        }}
                    />
                </SettingRow>
                <SettingRow label="Session Timeout" description="Session expiration time (hours)">
                    <select
                        value={settings.sessionTimeout}
                        onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '120px'
                        }}
                    >
                        <option value={1}>1 hour</option>
                        <option value={8}>8 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={168}>1 week</option>
                    </select>
                </SettingRow>
                <SettingRow label="API Rate Limit" description="Requests per minute per user">
                    <input
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => handleChange('apiRateLimit', parseInt(e.target.value))}
                        min="10"
                        max="1000"
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            width: '100px'
                        }}
                    />
                </SettingRow>
            </SettingSection>

            {/* Maintenance */}
            <SettingSection title="Maintenance" icon={Wrench}>
                <SettingRow
                    label="Maintenance Mode"
                    description="Disable public access during maintenance"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        {settings.maintenanceMode && (
                            <span style={{
                                padding: '4px 12px',
                                background: 'rgba(245, 158, 11, 0.2)',
                                color: 'var(--warning)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>
                                ACTIVE
                            </span>
                        )}
                        <Toggle
                            checked={settings.maintenanceMode}
                            onChange={(v) => handleChange('maintenanceMode', v)}
                        />
                    </div>
                </SettingRow>
            </SettingSection>

            {/* Appearance */}
            <SettingSection title="Appearance" icon={Palette}>
                <SettingRow label="Dark Mode Default" description="Use dark mode for new users">
                    <Toggle
                        checked={settings.darkModeDefault}
                        onChange={(v) => handleChange('darkModeDefault', v)}
                    />
                </SettingRow>
            </SettingSection>
        </AdminLayout>
    );
};

export default AdminSettings;
