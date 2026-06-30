import { create } from 'zustand';
import type { University, Student, Teacher, Course, Grade, Enrollment, Payment } from '../types';

interface UniversityState {
  university: University | null;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  grades: Grade[];
  enrollments: Enrollment[];
  payments: Payment[];
  setUniversity: (university: University | null) => void;
  setStudents: (students: Student[]) => void;
  setTeachers: (teachers: Teacher[]) => void;
  setCourses: (courses: Course[]) => void;
  setGrades: (grades: Grade[]) => void;
  setEnrollments: (enrollments: Enrollment[]) => void;
  setPayments: (payments: Payment[]) => void;
  addStudent: (student: Student) => void;
  updateStudentInStore: (id: string, data: Partial<Student>) => void;
  addTeacher: (teacher: Teacher) => void;
  addCourse: (course: Course) => void;
  addGrade: (grade: Grade) => void;
  reset: () => void;
}

export const useUniversityStore = create<UniversityState>((set) => ({
  university: null,
  students: [],
  teachers: [],
  courses: [],
  grades: [],
  enrollments: [],
  payments: [],
  setUniversity: (university) => set({ university }),
  setStudents: (students) => set({ students }),
  setTeachers: (teachers) => set({ teachers }),
  setCourses: (courses) => set({ courses }),
  setGrades: (grades) => set({ grades }),
  setEnrollments: (enrollments) => set({ enrollments }),
  setPayments: (payments) => set({ payments }),
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
  updateStudentInStore: (id, data) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),
  addTeacher: (teacher) => set((state) => ({ teachers: [...state.teachers, teacher] })),
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  addGrade: (grade) => set((state) => ({ grades: [...state.grades, grade] })),
  reset: () =>
    set({
      university: null,
      students: [],
      teachers: [],
      courses: [],
      grades: [],
      enrollments: [],
      payments: [],
    }),
}));
