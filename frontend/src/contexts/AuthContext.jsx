import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, adminAuthAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing tokens on mount
    useEffect(() => {
        const checkAuth = async () => {
            const userToken = localStorage.getItem('token');
            const adminToken = localStorage.getItem('adminToken');

            const promises = [];

            if (userToken) {
                promises.push(fetchUser());
            }

            if (adminToken) {
                promises.push(fetchAdmin());
            }

            if (promises.length > 0) {
                await Promise.all(promises);
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const fetchUser = async () => {
        try {
            const data = await authAPI.getMe();
            setUser(data.data.user);
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const fetchAdmin = async () => {
        try {
            const data = await adminAuthAPI.getMe();
            // Store full admin data including role and permissions
            setAdmin({
                ...data.data.user,
                permissions: data.data.user.permissions || []
            });
        } catch (err) {
            localStorage.removeItem('adminToken');
            setAdmin(null);
        }
    };

    // User login
    const login = async (email, password) => {
        try {
            setError(null);
            const data = await authAPI.login({ email, password });
            localStorage.setItem('token', data.data.token);
            setUser(data.data.user);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // Admin login (separate)
    const adminLogin = async (email, password) => {
        try {
            setError(null);
            const data = await adminAuthAPI.login({ email, password });
            localStorage.setItem('adminToken', data.data.token);
            // Store full admin data including role and permissions
            setAdmin({
                ...data.data.user,
                permissions: data.data.user.permissions || []
            });
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // User register
    const register = async (name, email, password) => {
        try {
            setError(null);
            const data = await authAPI.register({ name, email, password });
            localStorage.setItem('token', data.data.token);
            setUser(data.data.user);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // User logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Admin logout
    const logoutAdmin = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    // Check if admin has specific permission
    const hasPermission = useCallback((permission) => {
        if (!admin) return false;
        // Super admin has all permissions
        if (admin.role === 'superadmin') return true;
        // Check if permission exists in admin's permissions array
        return admin.permissions?.includes(permission) || false;
    }, [admin]);

    // Check if admin is super admin
    const isSuperAdmin = useCallback(() => {
        return admin?.role === 'superadmin';
    }, [admin]);

    return (
        <AuthContext.Provider value={{
            // User auth
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user,

            // Admin auth (separate)
            admin,
            adminLogin,
            logoutAdmin,
            isAdmin: !!admin,

            // Permission helpers
            hasPermission,
            isSuperAdmin,

            // Common
            loading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
