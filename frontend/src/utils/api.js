// TEMPORARY HARDCODED FIX - Bypassing environment variable issues
const API_URL = 'https://sitemonitor-9iaz.onrender.com';

// Helper to get auth token (separate storage for user and admin)
const getToken = () => localStorage.getItem('token');
const getAdminToken = () => localStorage.getItem('adminToken');

// Base fetch with auth
const fetchWithAuth = async (endpoint, options = {}, useAdminToken = false) => {
    const token = useAdminToken ? getAdminToken() : getToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// User Auth API
export const authAPI = {
    register: (userData) =>
        fetchWithAuth('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    login: (credentials) =>
        fetchWithAuth('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    getMe: () => fetchWithAuth('/api/auth/me'),

    updateProfile: (data) =>
        fetchWithAuth('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// Admin Auth API (separate from user auth)
export const adminAuthAPI = {
    login: (credentials) =>
        fetchWithAuth('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    getMe: () => fetchWithAuth('/api/admin/me', {}, true),
};

// Websites API (user)
export const websitesAPI = {
    getAll: () => fetchWithAuth('/api/websites'),

    getOne: (id) => fetchWithAuth(`/api/websites/${id}`),

    create: (data) =>
        fetchWithAuth('/api/websites', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id, data) =>
        fetchWithAuth(`/api/websites/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id) =>
        fetchWithAuth(`/api/websites/${id}`, {
            method: 'DELETE',
        }),

    ping: (id) =>
        fetchWithAuth(`/api/websites/${id}/ping`, {
            method: 'POST',
        }),
};

// Dashboard API (user)
export const dashboardAPI = {
    getStats: () => fetchWithAuth('/api/dashboard/stats'),
    getActivity: () => fetchWithAuth('/api/dashboard/activity'),
};

// Admin API (uses admin token)
export const adminAPI = {
    getStats: () => fetchWithAuth('/api/admin/stats', {}, true),

    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchWithAuth(`/api/admin/users${query ? `?${query}` : ''}`, {}, true);
    },

    getUser: (id) => fetchWithAuth(`/api/admin/users/${id}`, {}, true),

    updateUser: (id, data) =>
        fetchWithAuth(`/api/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, true),

    deleteUser: (id) =>
        fetchWithAuth(`/api/admin/users/${id}`, {
            method: 'DELETE',
        }, true),

    getWebsites: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchWithAuth(`/api/admin/websites${query ? `?${query}` : ''}`, {}, true);
    },

    deleteWebsite: (id) =>
        fetchWithAuth(`/api/admin/websites/${id}`, {
            method: 'DELETE',
        }, true),
};

// Profile API (user profile management)
export const profileAPI = {
    get: () => fetchWithAuth('/api/profile'),

    update: (data) =>
        fetchWithAuth('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    changePassword: (data) =>
        fetchWithAuth('/api/profile/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateNotifications: (data) =>
        fetchWithAuth('/api/profile/notifications', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateSecurity: (data) =>
        fetchWithAuth('/api/profile/security', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deleteAccount: (password) =>
        fetchWithAuth('/api/profile', {
            method: 'DELETE',
            body: JSON.stringify({ password }),
        }),
};

export default {
    auth: authAPI,
    adminAuth: adminAuthAPI,
    websites: websitesAPI,
    dashboard: dashboardAPI,
    admin: adminAPI,
    profile: profileAPI,
};
