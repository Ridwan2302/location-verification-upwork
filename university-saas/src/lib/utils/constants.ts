export const DEPARTMENTS = [
  'Sciences et Technologies',
  'Lettres et Sciences Humaines',
  'Droit et Sciences Politiques',
  'Économie et Gestion',
  'Médecine et Santé',
  'Ingénierie',
  'Arts et Design',
  'Sciences de l\'Éducation',
];

export const PROGRAMS = [
  'Licence 1',
  'Licence 2',
  'Licence 3',
  'Master 1',
  'Master 2',
  'Doctorat',
  'DUT',
  'BTS',
  'Ingénieur',
];

export const ACADEMIC_YEARS = [
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
];

export const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];

export const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export const ROLE_LABELS: Record<string, string> = {
  super_admin_plateforme: 'Super Administrateur',
  admin_universite: 'Administrateur Université',
  teacher: 'Enseignant',
  student: 'Étudiant',
  parent: 'Parent / Tuteur',
};

export const ROLE_COLORS: Record<string, string> = {
  super_admin_plateforme: 'bg-purple-100 text-purple-800',
  admin_universite: 'bg-blue-100 text-blue-800',
  teacher: 'bg-green-100 text-green-800',
  student: 'bg-yellow-100 text-yellow-800',
  parent: 'bg-orange-100 text-orange-800',
};

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  trial: 'bg-yellow-100 text-yellow-800',
  graduated: 'bg-blue-100 text-blue-800',
  on_leave: 'bg-orange-100 text-orange-800',
  terminated: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const GRADE_SCALE = {
  'A+': { min: 90, points: 4.0 },
  'A': { min: 85, points: 4.0 },
  'A-': { min: 80, points: 3.7 },
  'B+': { min: 75, points: 3.3 },
  'B': { min: 70, points: 3.0 },
  'B-': { min: 65, points: 2.7 },
  'C+': { min: 60, points: 2.3 },
  'C': { min: 55, points: 2.0 },
  'C-': { min: 50, points: 1.7 },
  'D': { min: 45, points: 1.0 },
  'F': { min: 0, points: 0.0 },
};
