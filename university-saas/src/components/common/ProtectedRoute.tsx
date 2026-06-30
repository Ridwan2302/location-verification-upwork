import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loader } from './Loader';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ROLE_DASHBOARD: Record<UserRole, string> = {
  super_admin_plateforme: '/dashboard/super-admin',
  admin_universite: '/dashboard/admin',
  teacher: '/dashboard/enseignant',
  student: '/dashboard/etudiant',
  parent: '/dashboard/parent',
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <Loader fullScreen message="Vérification de la session..." />;

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
  }

  return <>{children}</>;
};

export const RoleRedirect: React.FC = () => {
  const { user, loading } = useAuthStore();

  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/connexion" replace />;

  return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
};
