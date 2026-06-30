import { ref, set, get, update, remove, push, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './config';
import type {
  University, Student, Teacher, Course,
  Grade, Enrollment, Payment, AuditLog, Subscription
} from '../../types';

// ---- Universités ----
export const createUniversity = async (data: Omit<University, 'id'>): Promise<string> => {
  const newRef = push(ref(database, 'universities'));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
  return id;
};

export const getUniversity = async (id: string): Promise<University | null> => {
  const snap = await get(ref(database, `universities/${id}`));
  return snap.exists() ? snap.val() : null;
};

export const updateUniversity = (id: string, data: Partial<University>) =>
  update(ref(database, `universities/${id}`), data);

export const getAllUniversities = async (): Promise<University[]> => {
  const snap = await get(ref(database, 'universities'));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as University[];
};

// ---- Étudiants ----
export const createStudent = async (universityId: string, data: Omit<Student, 'id'>): Promise<string> => {
  const newRef = push(ref(database, `universities/${universityId}/students`));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
  return id;
};

export const getStudents = async (universityId: string): Promise<Student[]> => {
  const snap = await get(ref(database, `universities/${universityId}/students`));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as Student[];
};

export const getStudent = async (universityId: string, studentId: string): Promise<Student | null> => {
  const snap = await get(ref(database, `universities/${universityId}/students/${studentId}`));
  return snap.exists() ? snap.val() : null;
};

export const updateStudent = (universityId: string, studentId: string, data: Partial<Student>) =>
  update(ref(database, `universities/${universityId}/students/${studentId}`), data);

export const deleteStudent = (universityId: string, studentId: string) =>
  remove(ref(database, `universities/${universityId}/students/${studentId}`));

// ---- Enseignants ----
export const createTeacher = async (universityId: string, data: Omit<Teacher, 'id'>): Promise<string> => {
  const newRef = push(ref(database, `universities/${universityId}/teachers`));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
  return id;
};

export const getTeachers = async (universityId: string): Promise<Teacher[]> => {
  const snap = await get(ref(database, `universities/${universityId}/teachers`));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as Teacher[];
};

export const updateTeacher = (universityId: string, teacherId: string, data: Partial<Teacher>) =>
  update(ref(database, `universities/${universityId}/teachers/${teacherId}`), data);

// ---- Cours ----
export const createCourse = async (universityId: string, data: Omit<Course, 'id'>): Promise<string> => {
  const newRef = push(ref(database, `universities/${universityId}/courses`));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
  return id;
};

export const getCourses = async (universityId: string): Promise<Course[]> => {
  const snap = await get(ref(database, `universities/${universityId}/courses`));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as Course[];
};

export const updateCourse = (universityId: string, courseId: string, data: Partial<Course>) =>
  update(ref(database, `universities/${universityId}/courses/${courseId}`), data);

// ---- Notes ----
export const createGrade = async (universityId: string, data: Omit<Grade, 'id'>): Promise<string> => {
  const newRef = push(ref(database, `universities/${universityId}/grades`));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
  return id;
};

export const getGrades = async (universityId: string): Promise<Grade[]> => {
  const snap = await get(ref(database, `universities/${universityId}/grades`));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as Grade[];
};

export const updateGrade = (universityId: string, gradeId: string, data: Partial<Grade>) =>
  update(ref(database, `universities/${universityId}/grades/${gradeId}`), data);

// ---- Inscriptions ----
export const createEnrollment = async (universityId: string, data: Omit<Enrollment, 'id'>): Promise<string> => {
  const newRef = push(ref(database, `universities/${universityId}/enrollments`));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
  return id;
};

export const getEnrollments = async (universityId: string): Promise<Enrollment[]> => {
  const snap = await get(ref(database, `universities/${universityId}/enrollments`));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as Enrollment[];
};

// ---- Paiements ----
export const createPayment = async (universityId: string, data: Omit<Payment, 'id'>): Promise<string> => {
  const newRef = push(ref(database, `universities/${universityId}/payments`));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
  return id;
};

export const getPayments = async (universityId: string): Promise<Payment[]> => {
  const snap = await get(ref(database, `universities/${universityId}/payments`));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as Payment[];
};

export const updatePayment = (universityId: string, paymentId: string, data: Partial<Payment>) =>
  update(ref(database, `universities/${universityId}/payments/${paymentId}`), data);

// ---- Audit Logs ----
export const createAuditLog = async (universityId: string, data: Omit<AuditLog, 'id'>): Promise<void> => {
  const newRef = push(ref(database, `universities/${universityId}/auditLogs`));
  const id = newRef.key!;
  await set(newRef, { ...data, id });
};

export const getAuditLogs = async (universityId: string): Promise<AuditLog[]> => {
  const snap = await get(ref(database, `universities/${universityId}/auditLogs`));
  if (!snap.exists()) return [];
  return Object.values(snap.val()) as AuditLog[];
};

// ---- Abonnements (Platform) ----
export const createSubscription = async (data: Subscription): Promise<void> => {
  await set(ref(database, `platform/subscriptions/${data.id}`), data);
};

export const getSubscription = async (id: string): Promise<Subscription | null> => {
  const snap = await get(ref(database, `platform/subscriptions/${id}`));
  return snap.exists() ? snap.val() : null;
};
