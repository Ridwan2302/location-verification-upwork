import { useState } from 'react';
import { useNotificationStore } from '../store/notificationStore';

export const useFirebase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();

  const execute = async <T>(
    fn: () => Promise<T>,
    successMsg?: string,
    errorMsg?: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (successMsg) {
        addNotification({ type: 'success', title: 'Succès', message: successMsg });
      }
      return result;
    } catch (err) {
      const msg = errorMsg ?? (err instanceof Error ? err.message : 'Une erreur est survenue');
      setError(msg);
      addNotification({ type: 'error', title: 'Erreur', message: msg });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};
