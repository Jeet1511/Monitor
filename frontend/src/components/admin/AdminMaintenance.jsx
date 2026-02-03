import { useState } from 'react';
import AdminLayout from './AdminLayout';
import {
    Wrench, Power, AlertTriangle, Clock, Calendar, Save,
    CheckCircle, XCircle, Bell, Shield
} from 'lucide-react';

const AdminMaintenance = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [scheduledMaintenance, setScheduledMaintenance] = useState(null);
    const [message, setMessage] = useState('We are currently undergoing scheduled maintenance. Please check back soon!');
    const [notifyUsers, setNotifyUsers] = useState(true);

    const toggleMaintenance = () => {
        if (!maintenanceMode) {
            if (confirm('Enable maintenance mode? Users will see a maintenance page instead of the app.')) {
                setMaintenanceMode(true);
            }
        } else {
            setMaintenanceMode(false);
        }
    };

    const scheduleMaintenance = () => {
        const date = prompt('Enter maintenance date and time (YYYY-MM-DD HH:MM):');
        if (date) {
            setScheduledMaintenance(new Date(date).toISOString());
            alert('Maintenance scheduled! Users will be notified.');
        }
    };

    const cancelScheduled = () => {
        setScheduledMaintenance(null);
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <Wrench size={28} style={{ color: 'var(--warning)' }} /> Maintenance Mode
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Control system availability and scheduled downtime</p>
                    </div>
                </header>

                {/* Current Status */}
                <div style={{
                    background: maintenanceMode ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
                    border: `1px solid ${maintenanceMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: maintenanceMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {maintenanceMode ?
                                <Wrench size={40} style={{ color: 'var(--error)' }} /> :
                                <CheckCircle size={40} style={{ color: 'var(--success)' }} />
                            }
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                System is {maintenanceMode ? 'Under Maintenance' : 'Online'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {maintenanceMode ? 'Users are seeing the maintenance page' : 'All services are running normally'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleMaintenance}
                        style={{
                            background: maintenanceMode ? 'var(--success)' : 'var(--error)',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: 600,
                            fontSize: '1rem'
                        }}
                    >
                        <Power size={20} />
                        {maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Scheduled Maintenance */}
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                            <Calendar size={18} /> Scheduled Maintenance
                        </h3>

                        {scheduledMaintenance ? (
                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ color: 'var(--warning)', fontWeight: 600, marginBottom: '0.25rem' }}>Maintenance Scheduled</div>
                                        <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={14} />
                                            {new Date(scheduledMaintenance).toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={cancelScheduled}
                                        style={{ background: 'transparent', border: '1px solid var(--error)', padding: '0.5rem 1rem', borderRadius: '6px', color: 'var(--error)', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <Clock size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No maintenance scheduled</p>
                                <button
                                    onClick={scheduleMaintenance}
                                    style={{ background: 'var(--primary)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                                >
                                    Schedule Maintenance
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Maintenance Message */}
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                            <Bell size={18} /> Maintenance Message
                        </h3>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '1rem',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                resize: 'vertical',
                                marginBottom: '1rem'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={notifyUsers}
                                    onChange={e => setNotifyUsers(e.target.checked)}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                Notify users via email
                            </label>
                            <button
                                style={{ background: 'var(--success)', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Save size={14} /> Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ marginTop: '2rem', background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <button style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'center' }}>
                            <Shield size={20} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                            Clear Cache
                        </button>
                        <button style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'center' }}>
                            <Wrench size={20} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                            Restart Services
                        </button>
                        <button style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'center' }}>
                            <Bell size={20} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                            Send Notice
                        </button>
                        <button style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'center' }}>
                            <XCircle size={20} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                            Force Logout All
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMaintenance;
