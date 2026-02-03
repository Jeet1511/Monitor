import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { websitesAPI } from '../../utils/api';
import {
    ArrowLeft,
    ExternalLink,
    Clock,
    Zap,
    CheckCircle2,
    XCircle,
    Activity,
    RefreshCw,
    Trash2
} from 'lucide-react';

const WebsiteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [website, setWebsite] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pinging, setPinging] = useState(false);

    const fetchData = async () => {
        try {
            const data = await websitesAPI.getOne(id);
            setWebsite(data.data.website);
            setLogs(data.data.logs || []);
        } catch (error) {
            console.error('Failed to fetch website:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handlePing = async () => {
        setPinging(true);
        try {
            await websitesAPI.ping(id);
            fetchData();
        } catch (error) {
            console.error('Ping failed:', error);
        } finally {
            setPinging(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this website?')) return;
        try {
            await websitesAPI.delete(id);
            navigate('/websites');
        } catch (error) {
            alert('Failed to delete website');
        }
    };

    const toggleActive = async () => {
        try {
            await websitesAPI.update(id, { isActive: !website.isActive });
            fetchData();
        } catch (error) {
            console.error('Toggle failed:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-center" style={{ minHeight: '400px' }}>
                    <div className="loading-spinner" />
                </div>
            </DashboardLayout>
        );
    }

    if (!website) {
        return (
            <DashboardLayout>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <h3>Website not found</h3>
                    <Link to="/websites" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                        Back to Websites
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Back link */}
            <Link
                to="/websites"
                className="flex items-center gap-xs"
                style={{
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-lg)',
                    fontSize: '0.9rem'
                }}
            >
                <ArrowLeft size={16} />
                Back to Websites
            </Link>

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-xl)',
                flexWrap: 'wrap',
                gap: 'var(--spacing-lg)'
            }}>
                <div>
                    <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-sm)' }}>
                        <h1 style={{ fontSize: '1.75rem' }}>{website.name}</h1>
                        <span className={`badge badge-${website.lastStatus === 'up' ? 'success' : website.lastStatus === 'down' ? 'error' : 'warning'}`}>
                            {website.lastStatus}
                        </span>
                    </div>
                    <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-xs"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {website.url}
                        <ExternalLink size={14} />
                    </a>
                </div>

                <div className="flex gap-sm">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePing}
                        disabled={pinging}
                    >
                        <Zap size={18} className={pinging ? 'animate-pulse' : ''} />
                        Ping Now
                    </button>
                    <button
                        className={`btn ${website.isActive ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={toggleActive}
                    >
                        {website.isActive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                        className="btn btn-secondary"
                        style={{ color: 'var(--error)' }}
                        onClick={handleDelete}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                        <Activity size={24} style={{ color: 'var(--success)' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{website.uptime}%</div>
                        <div className="stat-label">Uptime</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                        <Zap size={24} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{website.lastResponseTime || '--'}ms</div>
                        <div className="stat-label">Response Time</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)' }}>
                        <Clock size={24} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{website.pingInterval}m</div>
                        <div className="stat-label">Ping Interval</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                        <RefreshCw size={24} style={{ color: 'var(--warning)' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{website.totalPings}</div>
                        <div className="stat-label">Total Pings</div>
                    </div>
                </div>
            </div>

            {/* Ping History */}
            <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)' }}>
                    Ping History
                </h2>

                {logs.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No ping history yet</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Response Time</th>
                                    <th>Status Code</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log._id}>
                                        <td>
                                            <div className="flex items-center gap-sm">
                                                {log.status === 'up' ? (
                                                    <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                                                ) : (
                                                    <XCircle size={16} style={{ color: 'var(--error)' }} />
                                                )}
                                                <span style={{
                                                    color: log.status === 'up' ? 'var(--success)' : 'var(--error)',
                                                    fontWeight: 500
                                                }}>
                                                    {log.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{log.responseTime}ms</td>
                                        <td>
                                            <span className={`badge ${log.statusCode && log.statusCode < 400 ? 'badge-success' : 'badge-error'}`}>
                                                {log.statusCode || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {formatDate(log.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default WebsiteDetails;
