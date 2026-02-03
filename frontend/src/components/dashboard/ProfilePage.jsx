import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../utils/api';
import DashboardLayout from './DashboardLayout';
import {
    User,
    Mail,
    Phone,
    Building,
    Clock,
    Shield,
    Bell,
    Key,
    Trash2,
    Save,
    Camera,
    Check,
    AlertTriangle,
    Globe,
    Webhook,
    Eye,
    EyeOff
} from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile data
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        bio: '',
        timezone: 'UTC',
        avatar: null
    });

    // Password change
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        email: {
            enabled: true,
            onDown: true,
            onUp: true,
            onSSLExpiry: true,
            dailyReport: false,
            weeklyReport: true
        },
        webhook: {
            enabled: false,
            url: '',
            type: 'discord'
        },
        alertThreshold: 2
    });

    // Security settings
    const [security, setSecurity] = useState({
        twoFactorEnabled: false,
        lastPasswordChange: null
    });

    // Delete account
    const [deletePassword, setDeletePassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const timezones = [
        'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo',
        'Asia/Shanghai', 'Asia/Kolkata', 'Asia/Dubai', 'Australia/Sydney',
        'Pacific/Auckland'
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileAPI.get();
            const u = data.data.user;
            setProfile({
                name: u.name || '',
                email: u.email || '',
                phone: u.phone || '',
                company: u.company || '',
                bio: u.bio || '',
                timezone: u.timezone || 'UTC',
                avatar: u.avatar
            });
            if (u.notifications) setNotifications(u.notifications);
            if (u.security) setSecurity({
                twoFactorEnabled: u.security.twoFactorEnabled || false,
                lastPasswordChange: u.security.lastPasswordChange
            });
        } catch (error) {
            showMessage('error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await profileAPI.update(profile);
            showMessage('success', 'Profile updated successfully');
        } catch (error) {
            showMessage('error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            showMessage('error', 'New passwords do not match');
            return;
        }
        if (passwords.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            await profileAPI.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            showMessage('success', 'Password changed successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showMessage('error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            await profileAPI.updateNotifications(notifications);
            showMessage('success', 'Notification preferences saved');
        } catch (error) {
            showMessage('error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleToggle2FA = async () => {
        setSaving(true);
        try {
            await profileAPI.updateSecurity({ twoFactorEnabled: !security.twoFactorEnabled });
            setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled });
            showMessage('success', `Two-factor authentication ${!security.twoFactorEnabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            showMessage('error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            showMessage('error', 'Please enter your password');
            return;
        }

        setSaving(true);
        try {
            await profileAPI.deleteAccount(deletePassword);
            logout();
        } catch (error) {
            showMessage('error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-center">
                    <div className="loading-spinner"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Account Settings</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your profile, notifications, and security</p>
                </div>
            </div>

            {/* Message Toast */}
            {message.text && (
                <div style={{
                    position: 'fixed',
                    top: 'var(--spacing-lg)',
                    right: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    background: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                    color: 'white',
                    borderRadius: 'var(--radius-lg)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    animation: 'slideIn 0.3s ease'
                }}>
                    {message.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--spacing-xl)' }}>
                {/* Sidebar Tabs */}
                <div className="card" style={{ padding: 'var(--spacing-md)', height: 'fit-content' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-md)',
                                background: activeTab === tab.id ? 'var(--bg-glass)' : 'transparent',
                                border: '1px solid',
                                borderColor: activeTab === tab.id ? 'var(--border-color)' : 'transparent',
                                borderRadius: 'var(--radius-md)',
                                color: tab.id === 'danger' ? 'var(--error)' :
                                    activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                marginBottom: 'var(--spacing-xs)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Profile Information</h2>

                            {/* Avatar */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-lg)',
                                marginBottom: 'var(--spacing-xl)'
                            }}>
                                <div style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    position: 'relative'
                                }}>
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }} />
                                    ) : (
                                        profile.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                    <button style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: 'var(--bg-card)',
                                        border: '2px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600 }}>{profile.name}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {profile.email}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">
                                        <User size={14} style={{ marginRight: 6 }} />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Mail size={14} style={{ marginRight: 6 }} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="form-input"
                                        style={{ opacity: 0.6 }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Phone size={14} style={{ marginRight: 6 }} />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="form-input"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Building size={14} style={{ marginRight: 6 }} />
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.company}
                                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                        className="form-input"
                                        placeholder="Your company name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Clock size={14} style={{ marginRight: 6 }} />
                                        Timezone
                                    </label>
                                    <select
                                        value={profile.timezone}
                                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                        className="form-input"
                                    >
                                        {timezones.map(tz => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: 'var(--spacing-lg)' }}>
                                <label className="form-label">Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="form-input"
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                    maxLength={500}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    {profile.bio?.length || 0}/500 characters
                                </p>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="btn btn-primary"
                                style={{ marginTop: 'var(--spacing-lg)' }}
                            >
                                {saving ? <div className="loading-spinner" style={{ width: 18, height: 18 }} /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Notification Preferences</h2>

                            {/* Email Notifications */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Mail size={18} style={{ color: 'var(--primary)' }} />
                                    Email Notifications
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                    {[
                                        { key: 'enabled', label: 'Enable email notifications' },
                                        { key: 'onDown', label: 'Alert when website goes down' },
                                        { key: 'onUp', label: 'Alert when website comes back up' },
                                        { key: 'onSSLExpiry', label: 'SSL certificate expiry warnings' },
                                        { key: 'dailyReport', label: 'Daily summary report' },
                                        { key: 'weeklyReport', label: 'Weekly summary report' }
                                    ].map(item => (
                                        <label key={item.key} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--bg-glass)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer'
                                        }}>
                                            <span>{item.label}</span>
                                            <input
                                                type="checkbox"
                                                checked={notifications.email[item.key]}
                                                onChange={(e) => setNotifications({
                                                    ...notifications,
                                                    email: { ...notifications.email, [item.key]: e.target.checked }
                                                })}
                                                style={{ width: 18, height: 18, cursor: 'pointer' }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Webhook Integration */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Webhook size={18} style={{ color: 'var(--accent)' }} />
                                    Webhook Integration
                                </h3>

                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--spacing-md)',
                                    cursor: 'pointer'
                                }}>
                                    <span>Enable webhook notifications</span>
                                    <input
                                        type="checkbox"
                                        checked={notifications.webhook.enabled}
                                        onChange={(e) => setNotifications({
                                            ...notifications,
                                            webhook: { ...notifications.webhook, enabled: e.target.checked }
                                        })}
                                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                                    />
                                </label>

                                {notifications.webhook.enabled && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Webhook Type</label>
                                            <select
                                                value={notifications.webhook.type}
                                                onChange={(e) => setNotifications({
                                                    ...notifications,
                                                    webhook: { ...notifications.webhook, type: e.target.value }
                                                })}
                                                className="form-input"
                                            >
                                                <option value="discord">Discord</option>
                                                <option value="slack">Slack</option>
                                                <option value="custom">Custom</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Webhook URL</label>
                                            <input
                                                type="url"
                                                value={notifications.webhook.url}
                                                onChange={(e) => setNotifications({
                                                    ...notifications,
                                                    webhook: { ...notifications.webhook, url: e.target.value }
                                                })}
                                                className="form-input"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Alert Threshold */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Alert Threshold</h3>
                                <div className="form-group">
                                    <label className="form-label">Consecutive failures before alerting</label>
                                    <select
                                        value={notifications.alertThreshold}
                                        onChange={(e) => setNotifications({
                                            ...notifications,
                                            alertThreshold: parseInt(e.target.value)
                                        })}
                                        className="form-input"
                                        style={{ maxWidth: 200 }}
                                    >
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n} failure{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveNotifications}
                                disabled={saving}
                                className="btn btn-primary"
                            >
                                {saving ? <div className="loading-spinner" style={{ width: 18, height: 18 }} /> : <Save size={18} />}
                                Save Preferences
                            </button>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Security Settings</h2>

                            {/* Change Password */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Key size={18} style={{ color: 'var(--primary)' }} />
                                    Change Password
                                </h3>

                                <form onSubmit={handleChangePassword}>
                                    <div style={{ display: 'grid', gap: 'var(--spacing-md)', maxWidth: 400 }}>
                                        {[
                                            { key: 'currentPassword', label: 'Current Password', show: 'current' },
                                            { key: 'newPassword', label: 'New Password', show: 'new' },
                                            { key: 'confirmPassword', label: 'Confirm New Password', show: 'confirm' }
                                        ].map(field => (
                                            <div key={field.key} className="form-group">
                                                <label className="form-label">{field.label}</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showPasswords[field.show] ? 'text' : 'password'}
                                                        value={passwords[field.key]}
                                                        onChange={(e) => setPasswords({ ...passwords, [field.key]: e.target.value })}
                                                        className="form-input"
                                                        style={{ paddingRight: 44 }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, [field.show]: !showPasswords[field.show] })}
                                                        style={{
                                                            position: 'absolute',
                                                            right: 12,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {showPasswords[field.show] ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="btn btn-primary"
                                            style={{ width: 'fit-content' }}
                                        >
                                            {saving ? <div className="loading-spinner" style={{ width: 18, height: 18 }} /> : <Key size={18} />}
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Two-Factor Auth */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Shield size={18} style={{ color: 'var(--accent)' }} />
                                    Two-Factor Authentication
                                </h3>

                                <div style={{
                                    padding: 'var(--spacing-lg)',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: 600 }}>
                                            {security.twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            Add an extra layer of security to your account
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleToggle2FA}
                                        disabled={saving}
                                        className={`btn ${security.twoFactorEnabled ? 'btn-ghost' : 'btn-primary'}`}
                                    >
                                        {security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                    </button>
                                </div>
                            </div>

                            {/* Last Password Change */}
                            {security.lastPasswordChange && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Last password change: {new Date(security.lastPasswordChange).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Danger Zone Tab */}
                    {activeTab === 'danger' && (
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--error)' }}>Danger Zone</h2>

                            <div style={{
                                padding: 'var(--spacing-lg)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius-lg)'
                            }}>
                                <h3 style={{ color: 'var(--error)', marginBottom: 'var(--spacing-sm)' }}>
                                    Delete Account
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                                    Once you delete your account, there is no going back. All your websites,
                                    monitoring data, and settings will be permanently deleted.
                                </p>

                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="btn"
                                        style={{
                                            background: 'var(--error)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        <Trash2 size={18} />
                                        Delete My Account
                                    </button>
                                ) : (
                                    <div style={{ maxWidth: 400 }}>
                                        <div className="form-group">
                                            <label className="form-label">Enter your password to confirm</label>
                                            <input
                                                type="password"
                                                value={deletePassword}
                                                onChange={(e) => setDeletePassword(e.target.value)}
                                                className="form-input"
                                                placeholder="Your password"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                            <button
                                                onClick={handleDeleteAccount}
                                                disabled={saving}
                                                className="btn"
                                                style={{
                                                    background: 'var(--error)',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                {saving ? 'Deleting...' : 'Yes, Delete My Account'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowDeleteConfirm(false);
                                                    setDeletePassword('');
                                                }}
                                                className="btn btn-ghost"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default ProfilePage;
