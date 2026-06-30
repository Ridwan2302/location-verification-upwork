import { format, fromUnixTime } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (timestamp: number): string =>
  format(fromUnixTime(timestamp / 1000), 'dd/MM/yyyy', { locale: fr });

export const formatDateTime = (timestamp: number): string =>
  format(fromUnixTime(timestamp / 1000), 'dd/MM/yyyy à HH:mm', { locale: fr });

export const formatCurrency = (amount: number, currency = 'EUR'): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);

export const generateMatricule = (universitySlug: string, year: number, sequence: number): string => {
  const slug = universitySlug.toUpperCase().slice(0, 4);
  const seq = String(sequence).padStart(4, '0');
  return `${slug}-${year}-${seq}`;
};

export const generateEmployeeId = (universitySlug: string, sequence: number): string => {
  const slug = universitySlug.toUpperCase().slice(0, 3);
  const seq = String(sequence).padStart(5, '0');
  return `EMP-${slug}-${seq}`;
};

export const computeLetterGrade = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  if (percentage >= 45) return 'D';
  return 'F';
};

export const computeGpaPoints = (letterGrade: string): number => {
  const gpaMap: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D': 1.0, 'F': 0.0,
  };
  return gpaMap[letterGrade] ?? 0;
};

export const computeGPA = (grades: Array<{ gpaPoints: number; weight: number }>): number => {
  if (grades.length === 0) return 0;
  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = grades.reduce((sum, g) => sum + g.gpaPoints * g.weight, 0);
  return Math.round((weightedSum / totalWeight) * 100) / 100;
};

export const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const clsx = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');

export const truncate = (text: string, length: number): string =>
  text.length > length ? `${text.slice(0, length)}...` : text;

export const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

export const getCurrentSemester = (): string => {
  const month = new Date().getMonth() + 1;
  return month >= 9 || month <= 1 ? 'S1' : 'S2';
};
