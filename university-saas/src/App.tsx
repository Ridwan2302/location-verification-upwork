import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase/config';
import { getUserData } from './lib/firebase/auth';
import { useAuthStore } from './store/authStore';
import { useUniversity } from './hooks/useUniversity';

// Layouts
import { DashboardLayout } from './components/common/Layout';
import { ProtectedRoute, RoleRedirect } from './components/common/ProtectedRoute';
import { NotificationContainer } from './components/ui/Alert';
import { Loader } from './components/common/Loader';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import UniversityAdminDashboard from './pages/dashboards/UniversityAdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setFirebaseUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser({ uid: fbUser.uid, email: fbUser.email });
        const userData = await getUserData(fbUser.uid);
        setUser(userData);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setFirebaseUser, setLoading]);

  return <>{children}</>;
};

const UniversityDataLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useUniversity();
  return <>{children}</>;
};

function App() {
  const { loading } = useAuthStore();

  if (loading) return <Loader fullScreen message="Initialisation de l'application..." />;

  return (
    <BrowserRouter>
      <AppInitializer>
        <UniversityDataLoader>
          <NotificationContainer />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Auto-redirect after login */}
            <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Super Admin */}
            <Route
              path="/dashboard/super-admin/*"
              element={
                <ProtectedRoute allowedRoles={['super_admin_plateforme']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<SuperAdminDashboard />} />
            </Route>

            {/* University Admin */}
            <Route
              path="/dashboard/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin_universite']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<UniversityAdminDashboard />} />
            </Route>

            {/* Teacher */}
            <Route
              path="/dashboard/enseignant/*"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<TeacherDashboard />} />
            </Route>

            {/* Student */}
            <Route
              path="/dashboard/etudiant/*"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<StudentDashboard />} />
            </Route>

            {/* Parent */}
            <Route
              path="/dashboard/parent/*"
              element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="*" element={<ParentDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UniversityDataLoader>
      </AppInitializer>
    </BrowserRouter>
  );
}

export default App;
