import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Landing
import Landing from './components/landing/Landing';

// Auth
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';
import WebsitesList from './components/dashboard/WebsitesList';
import WebsiteDetails from './components/dashboard/WebsiteDetails';
import Settings from './components/dashboard/Settings';
import ProfilePage from './components/dashboard/ProfilePage';
import AnalyticsPage from './components/dashboard/AnalyticsPage';

// Admin - Core
import AdminLogin from './components/admin/AdminLogin';
import AdvancedAdminDashboard from './components/admin/AdvancedAdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminUserDetails from './components/admin/AdminUserDetails';
import AdminWebsites from './components/admin/AdminWebsites';
import AdminSystemHealth from './components/admin/AdminSystemHealth';
import AdminActivityLogs from './components/admin/AdminActivityLogs';
import AdminSettings from './components/admin/AdminSettings';
import AdminSecurityPage from './components/admin/AdminSecurityPage';
import AdminAnalytics from './components/admin/AdminAnalytics';

// Admin - User Management
import AdminUserSessions from './components/admin/AdminUserSessions';
import AdminUserRoles from './components/admin/AdminUserRoles';
import AdminBannedUsers from './components/admin/AdminBannedUsers';

// Admin - Website Management
import AdminPendingWebsites from './components/admin/AdminPendingWebsites';
import AdminFlaggedSites from './components/admin/AdminFlaggedSites';
import AdminBulkOperations from './components/admin/AdminBulkOperations';

// Admin - Monitoring
import AdminErrorLogs from './components/admin/AdminErrorLogs';
import AdminPerformance from './components/admin/AdminPerformance';
import AdminReports from './components/admin/AdminReports';

// Admin - Configuration
import AdminEmailTemplates from './components/admin/AdminEmailTemplates';
import AdminApiKeys from './components/admin/AdminApiKeys';
import AdminMaintenance from './components/admin/AdminMaintenance';

// Admin - Security
import AdminLoginHistory from './components/admin/AdminLoginHistory';
import AdminIpManagement from './components/admin/AdminIpManagement';
import AdminSecurityAlerts from './components/admin/AdminSecurityAlerts';
import AdminAuditTrail from './components/admin/AdminAuditTrail';

// Loading Spinner
const LoadingScreen = () => (
    <div className="loading-center" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
    </div>
);

// Protected Route Component (for users)
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
};

// Admin Route Component (for admins - separate auth)
const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!isAdmin) return <Navigate to="/admin/login" replace />;

    return children;
};

// Guest Route (redirect if logged in as user)
const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return children;
};

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />

            {/* User Auth Routes */}
            <Route path="/login" element={
                <GuestRoute>
                    <Login />
                </GuestRoute>
            } />
            <Route path="/signup" element={
                <GuestRoute>
                    <Signup />
                </GuestRoute>
            } />

            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/websites" element={
                <ProtectedRoute>
                    <WebsitesList />
                </ProtectedRoute>
            } />
            <Route path="/websites/:id" element={
                <ProtectedRoute>
                    <WebsiteDetails />
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute>
                    <Settings />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute>
                    <AnalyticsPage />
                </ProtectedRoute>
            } />

            {/* Admin Routes (separate authentication) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
                <AdminRoute>
                    <AdvancedAdminDashboard />
                </AdminRoute>
            } />
            <Route path="/admin/users" element={
                <AdminRoute>
                    <AdminUsers />
                </AdminRoute>
            } />
            <Route path="/admin/users/:id" element={
                <AdminRoute>
                    <AdminUserDetails />
                </AdminRoute>
            } />
            <Route path="/admin/websites" element={
                <AdminRoute>
                    <AdminWebsites />
                </AdminRoute>
            } />

            {/* New Admin Pages */}
            <Route path="/admin/analytics" element={
                <AdminRoute>
                    <AdminAnalytics />
                </AdminRoute>
            } />
            <Route path="/admin/system" element={
                <AdminRoute>
                    <AdminSystemHealth />
                </AdminRoute>
            } />
            <Route path="/admin/activity" element={
                <AdminRoute>
                    <AdminActivityLogs />
                </AdminRoute>
            } />
            <Route path="/admin/settings" element={
                <AdminRoute>
                    <AdminSettings />
                </AdminRoute>
            } />
            <Route path="/admin/security/logins" element={
                <AdminRoute>
                    <AdminLoginHistory />
                </AdminRoute>
            } />
            <Route path="/admin/security/ips" element={
                <AdminRoute>
                    <AdminIpManagement />
                </AdminRoute>
            } />
            <Route path="/admin/security/alerts" element={
                <AdminRoute>
                    <AdminSecurityAlerts />
                </AdminRoute>
            } />
            <Route path="/admin/security/audit" element={
                <AdminRoute>
                    <AdminAuditTrail />
                </AdminRoute>
            } />
            <Route path="/admin/admins" element={
                <AdminRoute>
                    <AdvancedAdminDashboard />
                </AdminRoute>
            } />
            <Route path="/admin/errors" element={
                <AdminRoute>
                    <AdminErrorLogs />
                </AdminRoute>
            } />
            <Route path="/admin/performance" element={
                <AdminRoute>
                    <AdminPerformance />
                </AdminRoute>
            } />
            <Route path="/admin/reports" element={
                <AdminRoute>
                    <AdminReports />
                </AdminRoute>
            } />
            <Route path="/admin/email" element={
                <AdminRoute>
                    <AdminEmailTemplates />
                </AdminRoute>
            } />
            <Route path="/admin/api" element={
                <AdminRoute>
                    <AdminApiKeys />
                </AdminRoute>
            } />
            <Route path="/admin/maintenance" element={
                <AdminRoute>
                    <AdminMaintenance />
                </AdminRoute>
            } />
            <Route path="/admin/users/sessions" element={
                <AdminRoute>
                    <AdminUserSessions />
                </AdminRoute>
            } />
            <Route path="/admin/users/roles" element={
                <AdminRoute>
                    <AdminUserRoles />
                </AdminRoute>
            } />
            <Route path="/admin/users/banned" element={
                <AdminRoute>
                    <AdminBannedUsers />
                </AdminRoute>
            } />
            <Route path="/admin/websites/pending" element={
                <AdminRoute>
                    <AdminPendingWebsites />
                </AdminRoute>
            } />
            <Route path="/admin/websites/flagged" element={
                <AdminRoute>
                    <AdminFlaggedSites />
                </AdminRoute>
            } />
            <Route path="/admin/websites/bulk" element={
                <AdminRoute>
                    <AdminBulkOperations />
                </AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;

