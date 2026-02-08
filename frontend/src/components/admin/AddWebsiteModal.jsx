import { useState } from 'react';
import { X, Globe, Clock, CheckCircle, User, Link as LinkIcon } from 'lucide-react';
import './AddWebsiteModal.css';

const AddWebsiteModal = ({ users, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        url: '',
        pingInterval: 5,
        expectedStatusCode: 200
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.userId) {
            setError('Please select a user');
            return;
        }

        if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
            setError('URL must start with http:// or https://');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create website');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-website-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <Globe size={24} />
                        <h2>Add Website</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            <User size={16} />
                            Owner
                        </label>
                        <select
                            className="form-input"
                            value={formData.userId}
                            onChange={e => setFormData({ ...formData, userId: e.target.value })}
                            required
                        >
                            <option value="">Select a user...</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Globe size={16} />
                            Website Name
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="My Awesome Website"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <LinkIcon size={16} />
                            URL
                        </label>
                        <input
                            type="url"
                            className="form-input"
                            placeholder="https://example.com"
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            required
                        />
                        <span className="form-hint">Must start with http:// or https://</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Clock size={16} />
                                Ping Interval (minutes)
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                min="1"
                                max="60"
                                value={formData.pingInterval}
                                onChange={e => setFormData({ ...formData, pingInterval: parseInt(e.target.value) })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <CheckCircle size={16} />
                                Expected Status Code
                            </label>
                            <select
                                className="form-input"
                                value={formData.expectedStatusCode}
                                onChange={e => setFormData({ ...formData, expectedStatusCode: parseInt(e.target.value) })}
                            >
                                <option value="200">200 OK</option>
                                <option value="201">201 Created</option>
                                <option value="204">204 No Content</option>
                                <option value="301">301 Moved Permanently</option>
                                <option value="302">302 Found</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Website'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWebsiteModal;
