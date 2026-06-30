import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (min. 6 caractères)'),
});

export const registerSchema = z.object({
  universityName: z.string().min(3, 'Nom trop court (min. 3 caractères)'),
  slug: z
    .string()
    .min(3, 'Slug trop court')
    .max(30, 'Slug trop long')
    .regex(/^[a-z0-9-]+$/, 'Slug : lettres minuscules, chiffres et tirets uniquement'),
  adminEmail: z.string().email('Email administrateur invalide'),
  password: z.string().min(8, 'Mot de passe trop court (min. 8 caractères)'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const studentSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  program: z.string().min(1, 'Programme requis'),
  department: z.string().min(1, 'Département requis'),
  currentYear: z.number().min(1).max(7),
  startYear: z.number().min(2000),
});

export const teacherSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Département requis'),
  specialization: z.array(z.string()).min(1, 'Spécialisation requise'),
  qualifications: z.array(z.string()),
  maxHours: z.number().min(1).max(2000),
});

export const courseSchema = z.object({
  code: z.string().min(3, 'Code du cours requis'),
  name: z.string().min(3, 'Nom du cours requis'),
  description: z.string().optional(),
  credits: z.number().min(1).max(30),
  department: z.string().min(1, 'Département requis'),
  program: z.string().min(1, 'Programme requis'),
  year: z.number().min(1).max(7),
  semester: z.string().min(1, 'Semestre requis'),
  teacherId: z.string().min(1, 'Enseignant requis'),
  maxStudents: z.number().min(1),
});

export const gradeSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  score: z.number().min(0),
  maxScore: z.number().min(1),
  weight: z.number().min(0).max(1),
  semester: z.string().min(1),
  academicYear: z.string().min(1),
  feedback: z.string().optional(),
});

export const paymentSchema = z.object({
  studentId: z.string().min(1),
  amount: z.number().min(0),
  type: z.enum(['tuition', 'fee', 'other']),
  description: z.string().min(1, 'Description requise'),
  dueDate: z.number(),
  currency: z.string().default('EUR'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type GradeFormData = z.infer<typeof gradeSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
