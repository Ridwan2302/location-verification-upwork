import { useAuthStore } from '../store/authStore';
import { useUniversityStore } from '../store/universityStore';
import { createAuditLog } from '../lib/firebase/database';
import type { UserRole, AuditSeverity } from '../types';

export const useTenant = () => {
  const { user } = useAuthStore();
  const { university } = useUniversityStore();

  const universityId = user?.universityId ?? '';

  const logAction = async (
    action: string,
    targetType: string,
    targetId: string,
    targetName: string,
    details: string,
    severity: AuditSeverity = 'info'
  ) => {
    if (!user || !universityId) return;
    await createAuditLog(universityId, {
      universityId,
      userId: user.id,
      userRole: user.role as UserRole,
      action,
      targetType,
      targetId,
      targetName,
      details,
      timestamp: Date.now(),
      severity,
    });
  };

  return {
    universityId,
    university,
    user,
    logAction,
  };
};
