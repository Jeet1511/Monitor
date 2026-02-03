import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    FileText, RefreshCw, Download, Calendar, Filter,
    Users, Globe, Activity, TrendingUp, Clock, BarChart3
} from 'lucide-react';

const API_BASE = '/api/admin';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('7days');
    const [stats, setStats] = useState(null);

    const fetchWithAuth = async (url) => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await fetchWithAuth(`${API_BASE}/stats`);
                setStats(statsData.data);

                // Generate sample reports
                setReports([
                    { id: 1, name: 'User Activity Report', type: 'users', generated: new Date().toISOString(), records: 156, status: 'ready' },
                    { id: 2, name: 'Website Uptime Report', type: 'websites', generated: new Date(Date.now() - 86400000).toISOString(), records: 45, status: 'ready' },
                    { id: 3, name: 'Ping Statistics Report', type: 'pings', generated: new Date(Date.now() - 172800000).toISOString(), records: 2340, status: 'ready' },
                    { id: 4, name: 'Error Summary Report', type: 'errors', generated: new Date(Date.now() - 259200000).toISOString(), records: 23, status: 'ready' },
                ]);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const generateReport = (type) => {
        alert(`Generating ${type} report... This would trigger a download in production.`);
    };

    const downloadReport = (report) => {
        alert(`Downloading ${report.name}...`);
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            <FileText size={28} style={{ color: 'var(--primary)' }} /> Reports
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Generate and download system reports</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            value={dateRange}
                            onChange={e => setDateRange(e.target.value)}
                            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                        >
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                        </select>
                    </div>
                </header>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <Users size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats?.totalUsers || 0}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Users</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <Globe size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats?.totalWebsites || 0}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Websites</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <Activity size={24} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats?.recentPings || 0}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pings (24h)</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <TrendingUp size={24} style={{ color: 'var(--warning)', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{stats?.upWebsites || 0}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sites Up</div>
                    </div>
                </div>

                {/* Generate New Reports */}
                <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Generate New Report</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <button
                            onClick={() => generateReport('users')}
                            style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <Users size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>User Report</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Activity & signups</div>
                        </button>
                        <button
                            onClick={() => generateReport('websites')}
                            style={{
                                background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(167, 139, 250, 0.05))',
                                border: '1px solid rgba(167, 139, 250, 0.3)',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <Globe size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Website Report</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uptime & status</div>
                        </button>
                        <button
                            onClick={() => generateReport('pings')}
                            style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <Activity size={24} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Ping Report</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Response times</div>
                        </button>
                        <button
                            onClick={() => generateReport('full')}
                            style={{
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <BarChart3 size={24} style={{ color: 'var(--warning)', marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Full Report</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>All metrics</div>
                        </button>
                    </div>
                </div>

                {/* Recent Reports */}
                <div style={{ background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Recent Reports</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>REPORT NAME</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>GENERATED</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>RECORDS</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>STATUS</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <FileText size={18} style={{ color: 'var(--primary)' }} />
                                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{report.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={14} />
                                            {new Date(report.generated).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{report.records.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: 'var(--success)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>Ready</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => downloadReport(report)}
                                            style={{
                                                background: 'var(--primary)',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <Download size={14} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
