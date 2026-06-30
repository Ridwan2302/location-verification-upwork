import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  const fileRef = storageRef(storage, path);
  const snapshot = await uploadBytes(fileRef, file);
  return getDownloadURL(snapshot.ref);
};

export const deleteFile = async (path: string): Promise<void> => {
  const fileRef = storageRef(storage, path);
  await deleteObject(fileRef);
};

export const getFileUrl = (path: string) => {
  const fileRef = storageRef(storage, path);
  return getDownloadURL(fileRef);
};
