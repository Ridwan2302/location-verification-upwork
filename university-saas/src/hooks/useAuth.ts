import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { getUserData } from '../lib/firebase/auth';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, loading, setUser, setFirebaseUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setFirebaseUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        const userData = await getUserData(firebaseUser.uid);
        setUser(userData);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setFirebaseUser, setLoading]);

  return { user, loading, isAuthenticated: !!user };
};
