import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUniversityStore } from '../store/universityStore';
import {
  getUniversity, getStudents, getTeachers,
  getCourses, getGrades, getEnrollments, getPayments
} from '../lib/firebase/database';

export const useUniversity = () => {
  const { user } = useAuthStore();
  const {
    university, students, teachers, courses, grades, enrollments, payments,
    setUniversity, setStudents, setTeachers, setCourses,
    setGrades, setEnrollments, setPayments
  } = useUniversityStore();

  useEffect(() => {
    if (!user?.universityId) return;

    const load = async () => {
      const [uni, studs, teach, crs, grd, enr, pay] = await Promise.all([
        getUniversity(user.universityId!),
        getStudents(user.universityId!),
        getTeachers(user.universityId!),
        getCourses(user.universityId!),
        getGrades(user.universityId!),
        getEnrollments(user.universityId!),
        getPayments(user.universityId!),
      ]);
      setUniversity(uni);
      setStudents(studs);
      setTeachers(teach);
      setCourses(crs);
      setGrades(grd);
      setEnrollments(enr);
      setPayments(pay);
    };

    load();
  }, [user?.universityId]);

  return { university, students, teachers, courses, grades, enrollments, payments };
};
