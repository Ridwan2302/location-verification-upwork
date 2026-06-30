// ============================================
// TYPES TYPESCRIPT - University SaaS
// ============================================

export type UserRole =
  | 'super_admin_plateforme'
  | 'admin_universite'
  | 'teacher'
  | 'student'
  | 'parent';

export type SubscriptionPlan = 'standard' | 'premium' | 'enterprise';
export type UniversityStatus = 'active' | 'suspended' | 'trial';
export type StudentStatus = 'active' | 'suspended' | 'graduated';
export type TeacherStatus = 'active' | 'on_leave' | 'terminated';
export type CourseStatus = 'active' | 'archived' | 'cancelled';
export type GradeStatus = 'draft' | 'published' | 'archived';
export type EnrollmentStatus = 'active' | 'dropped' | 'completed' | 'withdrawn';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentType = 'tuition' | 'fee' | 'other';
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trial';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  universityId?: string;
  profile: UserProfile;
  createdAt: number;
  lastLogin?: number;
  isActive: boolean;
}

export interface UniversityConfig {
  academicYears: string[];
  departments: string[];
  programs: string[];
  gradingScale: Record<string, number>;
}

export interface UniversitySubscriptionStatus {
  tier: SubscriptionPlan;
  startDate: number;
  endDate: number;
  isActive: boolean;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  subscriptionPlan: SubscriptionPlan;
  maxStudents: number;
  status: UniversityStatus;
  createdAt: number;
  subscriptionStatus: UniversitySubscriptionStatus;
  config: UniversityConfig;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  adminEmail: string;
}

export interface AcademicHistory {
  year: string;
  semester: string;
  gpa: number;
  courses: string[];
  status: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  email?: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Student {
  id: string;
  userId: string;
  universityId: string;
  matricule: string;
  status: StudentStatus;
  program: string;
  department: string;
  currentYear: number;
  startYear: number;
  enrollmentHistory: string[];
  academicHistory: AcademicHistory[];
  parentId?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

export interface TeacherWorkload {
  totalHours: number;
  maxHours: number;
  currentSemester: string;
}

export interface Teacher {
  id: string;
  userId: string;
  universityId: string;
  employeeId: string;
  department: string;
  specialization: string[];
  qualifications: string[];
  courses: string[];
  workload: TeacherWorkload;
  hireDate: number;
  status: TeacherStatus;
}

export interface CourseSchedule {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  uploadedAt: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: number;
  maxScore: number;
  weight: number;
  publishedAt: number;
}

export interface Course {
  id: string;
  universityId: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  department: string;
  program: string;
  year: number;
  semester: string;
  teacherId: string;
  schedule: CourseSchedule[];
  enrolledStudents: string[];
  maxStudents: number;
  status: CourseStatus;
  materials: CourseMaterial[];
  assignments: Assignment[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface Grade {
  id: string;
  universityId: string;
  studentId: string;
  courseId: string;
  assignmentId?: string;
  score: number;
  maxScore: number;
  weight: number;
  letterGrade: string;
  gpaPoints: number;
  semester: string;
  academicYear: string;
  gradedBy: string;
  gradedAt: number;
  feedback?: string;
  status: GradeStatus;
}

export interface Enrollment {
  id: string;
  universityId: string;
  studentId: string;
  courseId: string;
  enrollmentDate: number;
  status: EnrollmentStatus;
  grade?: number;
  letterGrade?: string;
  semester: string;
  academicYear: string;
  paymentStatus: PaymentStatus;
  tuitionAmount: number;
}

export interface Payment {
  id: string;
  universityId: string;
  studentId: string;
  amount: number;
  currency: string;
  type: PaymentType;
  description: string;
  status: PaymentStatus;
  dueDate: number;
  paidDate?: number;
  paymentMethod?: string;
  transactionId?: string;
  receiptUrl?: string;
  lateFee?: number;
  installmentNumber?: number;
  totalInstallments?: number;
}

export interface AuditLog {
  id: string;
  universityId: string;
  userId: string;
  userRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  details: string;
  ipAddress?: string;
  timestamp: number;
  severity: AuditSeverity;
}

export interface Subscription {
  id: string;
  universityId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: number;
  endDate: number;
  trialEndDate?: number;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  autoRenew: boolean;
  features: string[];
}

// Plans tarifaires
export const PLAN_DETAILS: Record<SubscriptionPlan, {
  name: string;
  price: number;
  maxStudents: number;
  features: string[];
}> = {
  standard: {
    name: 'Standard',
    price: 100,
    maxStudents: 500,
    features: [
      'Gestion de base',
      'Support email',
      'Jusqu\'à 500 étudiants',
      'Tableaux de bord',
      'Gestion des cours',
      'Notes et évaluations',
    ],
  },
  premium: {
    name: 'Premium',
    price: 250,
    maxStudents: 2000,
    features: [
      'Gestion avancée',
      'E-learning intégré',
      'Support prioritaire',
      'Jusqu\'à 2000 étudiants',
      'Rapports avancés',
      'Import CSV/Excel',
      'API access',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 500,
    maxStudents: 999999,
    features: [
      'Tout inclus',
      'Étudiants illimités',
      'Support dédié 24/7',
      'API access complet',
      'Personnalisation avancée',
      'SLA garanti',
      'Onboarding dédié',
    ],
  },
};
