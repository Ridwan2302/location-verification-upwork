import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from './config';
import { User, UserRole } from '../../types';

export const registerUser = async (
  email: string,
  password: string,
  role: UserRole,
  universityId: string,
  profile: { firstName: string; lastName: string; phone?: string }
): Promise<FirebaseUser> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  await updateProfile(user, {
    displayName: `${profile.firstName} ${profile.lastName}`,
  });

  const userData: User = {
    id: user.uid,
    email,
    role,
    universityId,
    profile,
    createdAt: Date.now(),
    isActive: true,
  };

  await set(ref(database, `users/${user.uid}`), userData);

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await update(ref(database, `users/${credential.user.uid}`), {
    lastLogin: Date.now(),
  });
  return credential.user;
};

export const logoutUser = () => signOut(auth);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const getUserData = async (uid: string): Promise<User | null> => {
  const snapshot = await get(ref(database, `users/${uid}`));
  return snapshot.exists() ? (snapshot.val() as User) : null;
};
