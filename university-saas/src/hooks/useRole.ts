import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

export const useRole = () => {
  const { user } = useAuthStore();

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  };

  const isSuperAdmin = () => hasRole('super_admin_plateforme');
  const isUniversityAdmin = () => hasRole('admin_universite');
  const isTeacher = () => hasRole('teacher');
  const isStudent = () => hasRole('student');
  const isParent = () => hasRole('parent');

  const canManageUniversity = () =>
    hasRole(['super_admin_plateforme', 'admin_universite']);

  const canManageStudents = () =>
    hasRole(['super_admin_plateforme', 'admin_universite']);

  const canManageGrades = () =>
    hasRole(['super_admin_plateforme', 'admin_universite', 'teacher']);

  return {
    role: user?.role,
    hasRole,
    isSuperAdmin,
    isUniversityAdmin,
    isTeacher,
    isStudent,
    isParent,
    canManageUniversity,
    canManageStudents,
    canManageGrades,
  };
};
