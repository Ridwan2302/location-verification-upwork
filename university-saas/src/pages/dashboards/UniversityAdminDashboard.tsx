import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Users, BookOpen, CreditCard, GraduationCap,
  Plus, Search, Filter, Download, UserCheck,
  AlertTriangle, CheckCircle, Clock, Edit, Trash2, ClipboardList
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { useUniversityStore } from '../../store/universityStore';
import { useAuthStore } from '../../store/authStore';
import { useTenant } from '../../hooks/useTenant';
import {
  createStudent, updateStudent, deleteStudent,
  createTeacher, createCourse, createPayment,
  getAuditLogs
} from '../../lib/firebase/database';
import { registerUser } from '../../lib/firebase/auth';
import { formatDate, formatCurrency, generateMatricule, getCurrentAcademicYear } from '../../lib/utils/helpers';
import { STATUS_COLORS, DEPARTMENTS, PROGRAMS } from '../../lib/utils/constants';
import { studentSchema, teacherSchema, courseSchema, type StudentFormData, type TeacherFormData, type CourseFormData } from '../../lib/utils/validators';
import type { Student, Teacher, Course, Payment, AuditLog } from '../../types';

// =========== Overview ===========
const Overview: React.FC = () => {
  const { students, teachers, courses, payments } = useUniversityStore();
  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const totalRevenu = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Administration</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion complète de votre établissement</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Étudiants" value={students.length} icon={<Users className="w-6 h-6" />} color="blue" />
        <StatCard title="Enseignants" value={teachers.length} icon={<UserCheck className="w-6 h-6" />} color="green" />
        <StatCard title="Cours actifs" value={courses.filter((c) => c.status === 'active').length} icon={<BookOpen className="w-6 h-6" />} color="purple" />
        <StatCard title="Revenu total" value={formatCurrency(totalRevenu)} icon={<CreditCard className="w-6 h-6" />} color="orange" />
      </div>

      {pendingPayments > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-800 font-medium">
            {pendingPayments} paiement(s) en attente de règlement
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Étudiants récents</h3>
          <div className="space-y-3">
            {students.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {s.matricule.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.matricule}</p>
                  <p className="text-xs text-gray-500">{s.program} — {s.department}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status]}`}>
                  {s.status === 'active' ? 'Actif' : s.status === 'graduated' ? 'Diplômé' : 'Suspendu'}
                </span>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">Aucun étudiant inscrit</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Paiements récents</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  p.status === 'paid' ? 'bg-green-100' : p.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {p.status === 'paid' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   p.status === 'failed' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                   <Clock className="w-4 h-4 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(p.dueDate)}</p>
                </div>
                <span className="font-semibold text-sm">{formatCurrency(p.amount)}</span>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">Aucun paiement enregistré</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// =========== Students ===========
const StudentsManagement: React.FC = () => {
  const { students, university, addStudent, updateStudentInStore } = useUniversityStore();
  const { logAction } = useTenant();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const filtered = students.filter((s) =>
    s.matricule.toLowerCase().includes(search.toLowerCase()) ||
    s.program.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (data: StudentFormData) => {
    if (!user?.universityId) return;
    setLoading(true);
    setError(null);
    try {
      // Créer le compte utilisateur
      const fbUser = await registerUser(
        data.email,
        `Temp${Date.now()}!`,
        'student',
        user.universityId,
        { firstName: data.firstName, lastName: data.lastName, phone: data.phone }
      );

      const matricule = generateMatricule(
        university?.slug ?? 'UNIV',
        new Date().getFullYear(),
        students.length + 1
      );

      const studentId = await createStudent(user.universityId, {
        userId: fbUser.uid,
        universityId: user.universityId,
        matricule,
        status: 'active',
        program: data.program,
        department: data.department,
        currentYear: data.currentYear,
        startYear: data.startYear,
        enrollmentHistory: [],
        academicHistory: [],
      });

      addStudent({
        id: studentId,
        userId: fbUser.uid,
        universityId: user.universityId,
        matricule,
        status: 'active',
        program: data.program,
        department: data.department,
        currentYear: data.currentYear,
        startYear: data.startYear,
        enrollmentHistory: [],
        academicHistory: [],
      });

      await logAction('CREATE_STUDENT', 'student', studentId, matricule, `Nouvel étudiant créé: ${data.firstName} ${data.lastName}`);
      reset();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Étudiants</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} étudiants inscrits</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Ajouter un étudiant
        </Button>
      </div>

      <Card>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par matricule, programme..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="md" icon={<Filter className="w-4 h-4" />}>Filtres</Button>
          <Button variant="outline" size="md" icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>

        <Table
          columns={[
            { key: 'matricule', header: 'Matricule', render: (s: Student) => (
              <span className="font-mono text-sm font-medium text-blue-600">{s.matricule}</span>
            )},
            { key: 'program', header: 'Programme', render: (s: Student) => (
              <div>
                <p className="font-medium text-sm text-gray-900">{s.program}</p>
                <p className="text-xs text-gray-500">{s.department}</p>
              </div>
            )},
            { key: 'currentYear', header: 'Année', render: (s: Student) => `Année ${s.currentYear}` },
            { key: 'status', header: 'Statut', render: (s: Student) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[s.status]}`}>
                {s.status === 'active' ? 'Actif' : s.status === 'graduated' ? 'Diplômé' : 'Suspendu'}
              </span>
            )},
            { key: 'actions', header: 'Actions', render: (s: Student) => (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" icon={<Edit className="w-4 h-4" />} />
                <Button
                  size="sm"
                  variant={s.status === 'active' ? 'danger' : 'secondary'}
                  onClick={() => updateStudentInStore(s.id, { status: s.status === 'active' ? 'suspended' : 'active' })}
                >
                  {s.status === 'active' ? 'Suspendre' : 'Activer'}
                </Button>
              </div>
            )},
          ]}
          data={filtered}
          keyExtractor={(s) => s.id}
          emptyMessage="Aucun étudiant trouvé"
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Inscrire un étudiant" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" required error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Nom" required error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          <Input label="Téléphone" error={errors.phone?.message} {...register('phone')} />
          <Select
            label="Programme"
            required
            error={errors.program?.message}
            options={[{ value: '', label: 'Sélectionner...' }, ...PROGRAMS.map((p) => ({ value: p, label: p }))]}
            {...register('program')}
          />
          <Select
            label="Département"
            required
            error={errors.department?.message}
            options={[{ value: '', label: 'Sélectionner...' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
            {...register('department')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Année en cours" type="number" defaultValue={1} error={errors.currentYear?.message} {...register('currentYear', { valueAsNumber: true })} />
            <Input label="Année d'entrée" type="number" defaultValue={new Date().getFullYear()} error={errors.startYear?.message} {...register('startYear', { valueAsNumber: true })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Annuler</Button>
            <Button type="submit" loading={loading} className="flex-1 justify-center">Inscrire l'étudiant</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// =========== Teachers ===========
const TeachersManagement: React.FC = () => {
  const { teachers, addTeacher } = useUniversityStore();
  const { user } = useAuthStore();
  const { logAction } = useTenant();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  });

  const filtered = teachers.filter((t) =>
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (data: TeacherFormData) => {
    if (!user?.universityId) return;
    setLoading(true);
    try {
      const fbUser = await registerUser(
        data.email, `Temp${Date.now()}!`, 'teacher', user.universityId,
        { firstName: data.firstName, lastName: data.lastName }
      );
      const employeeId = `EMP-${(teachers.length + 1).toString().padStart(5, '0')}`;
      const teacherId = await createTeacher(user.universityId, {
        userId: fbUser.uid,
        universityId: user.universityId,
        employeeId,
        department: data.department,
        specialization: data.specialization,
        qualifications: data.qualifications,
        courses: [],
        workload: { totalHours: 0, maxHours: data.maxHours, currentSemester: 'S1' },
        hireDate: Date.now(),
        status: 'active',
      });
      addTeacher({ id: teacherId, userId: fbUser.uid, universityId: user.universityId, employeeId, department: data.department, specialization: data.specialization, qualifications: data.qualifications, courses: [], workload: { totalHours: 0, maxHours: data.maxHours, currentSemester: 'S1' }, hireDate: Date.now(), status: 'active' });
      await logAction('CREATE_TEACHER', 'teacher', teacherId, employeeId, `Nouvel enseignant: ${data.firstName} ${data.lastName}`);
      reset();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Enseignants</h1>
          <p className="text-gray-500 text-sm">{teachers.length} enseignants</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Ajouter un enseignant
        </Button>
      </div>

      <Card>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <Table
          columns={[
            { key: 'employeeId', header: 'ID Employé', render: (t: Teacher) => <span className="font-mono text-sm text-blue-600">{t.employeeId}</span> },
            { key: 'department', header: 'Département' },
            { key: 'specialization', header: 'Spécialisation', render: (t: Teacher) => (
              <div className="flex gap-1 flex-wrap">
                {t.specialization.slice(0, 2).map((s) => (
                  <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            )},
            { key: 'workload', header: 'Charge', render: (t: Teacher) => (
              <div>
                <div className="w-24 bg-gray-100 rounded-full h-1.5 mb-1">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (t.workload.totalHours / t.workload.maxHours) * 100)}%` }} />
                </div>
                <p className="text-xs text-gray-500">{t.workload.totalHours}/{t.workload.maxHours}h</p>
              </div>
            )},
            { key: 'status', header: 'Statut', render: (t: Teacher) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[t.status]}`}>
                {t.status === 'active' ? 'Actif' : t.status === 'on_leave' ? 'Congé' : 'Terminé'}
              </span>
            )},
          ]}
          data={filtered}
          keyExtractor={(t) => t.id}
          emptyMessage="Aucun enseignant"
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Ajouter un enseignant" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" required error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Nom" required error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          <Select label="Département" required error={errors.department?.message} options={[{ value: '', label: 'Sélectionner...' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} {...register('department')} />
          <Input label="Spécialisation (séparées par virgule)" required placeholder="Mathématiques, Physique" error={errors.specialization?.message} {...register('specialization', { setValueAs: (v: string) => v.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
          <Input label="Qualifications (séparées par virgule)" placeholder="Doctorat, HDR" {...register('qualifications', { setValueAs: (v: string) => v.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
          <Input label="Heures max / an" type="number" defaultValue={300} error={errors.maxHours?.message} {...register('maxHours', { valueAsNumber: true })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Annuler</Button>
            <Button type="submit" loading={loading} className="flex-1 justify-center">Créer l'enseignant</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// =========== Courses ===========
const CoursesManagement: React.FC = () => {
  const { courses, teachers, addCourse } = useUniversityStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseFormData) => {
    if (!user?.universityId) return;
    setLoading(true);
    try {
      const courseId = await createCourse(user.universityId, {
        ...data,
        universityId: user.universityId,
        schedule: [],
        enrolledStudents: [],
        status: 'active',
        materials: [],
        assignments: [],
        prerequisites: [],
        learningObjectives: [],
      });
      addCourse({ id: courseId, ...data, universityId: user.universityId, schedule: [], enrolledStudents: [], status: 'active', materials: [], assignments: [], prerequisites: [], learningObjectives: [] });
      reset();
      setShowModal(false);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cours & Programmes</h1>
          <p className="text-gray-500 text-sm">{courses.length} cours au catalogue</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>Créer un cours</Button>
      </div>

      <Card>
        <Table
          columns={[
            { key: 'code', header: 'Code', render: (c: Course) => <span className="font-mono text-sm text-blue-600">{c.code}</span> },
            { key: 'name', header: 'Cours', render: (c: Course) => (
              <div>
                <p className="font-medium text-sm text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.department} — {c.program}</p>
              </div>
            )},
            { key: 'credits', header: 'Crédits', render: (c: Course) => `${c.credits} ECTS` },
            { key: 'enrolledStudents', header: 'Inscrits', render: (c: Course) => (
              <span>{c.enrolledStudents.length}/{c.maxStudents}</span>
            )},
            { key: 'status', header: 'Statut', render: (c: Course) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>
                {c.status === 'active' ? 'Actif' : c.status === 'archived' ? 'Archivé' : 'Annulé'}
              </span>
            )},
          ]}
          data={courses}
          keyExtractor={(c) => c.id}
          emptyMessage="Aucun cours créé"
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Créer un cours" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Code du cours" placeholder="INF101" required error={errors.code?.message} {...register('code')} />
            <Input label="Crédits ECTS" type="number" defaultValue={3} required error={errors.credits?.message} {...register('credits', { valueAsNumber: true })} />
          </div>
          <Input label="Nom du cours" placeholder="Introduction à la Programmation" required error={errors.name?.message} {...register('name')} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Département" required error={errors.department?.message} options={[{ value: '', label: 'Sélectionner...' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} {...register('department')} />
            <Select label="Programme" required error={errors.program?.message} options={[{ value: '', label: 'Sélectionner...' }, ...PROGRAMS.map((p) => ({ value: p, label: p }))]} {...register('program')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Année" type="number" defaultValue={1} error={errors.year?.message} {...register('year', { valueAsNumber: true })} />
            <Select label="Semestre" required error={errors.semester?.message} options={['S1','S2','S3','S4'].map((s) => ({ value: s, label: s }))} {...register('semester')} />
          </div>
          <Select label="Enseignant" required error={errors.teacherId?.message} options={[{ value: '', label: 'Sélectionner...' }, ...teachers.map((t) => ({ value: t.id, label: `${t.employeeId} — ${t.department}` }))]} {...register('teacherId')} />
          <Input label="Capacité max" type="number" defaultValue={30} error={errors.maxStudents?.message} {...register('maxStudents', { valueAsNumber: true })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Annuler</Button>
            <Button type="submit" loading={loading} className="flex-1 justify-center">Créer le cours</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// =========== Payments ===========
const PaymentsManagement: React.FC = () => {
  const { payments, students } = useUniversityStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Frais de scolarité');

  const paid = payments.filter((p) => p.status === 'paid');
  const pending = payments.filter((p) => p.status === 'pending');

  const handleCreatePayment = async () => {
    if (!user?.universityId || !studentId) return;
    setLoading(true);
    try {
      await createPayment(user.universityId, {
        universityId: user.universityId,
        studentId,
        amount: Number(amount),
        currency: 'EUR',
        type: 'tuition',
        description,
        status: 'pending',
        dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
      setShowModal(false);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
          <p className="text-gray-500 text-sm">{payments.length} transactions</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>Créer un paiement</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total encaissé" value={formatCurrency(paid.reduce((s, p) => s + p.amount, 0))} icon={<CheckCircle className="w-6 h-6" />} color="green" />
        <StatCard title="En attente" value={formatCurrency(pending.reduce((s, p) => s + p.amount, 0))} icon={<Clock className="w-6 h-6" />} color="orange" />
        <StatCard title="Transactions" value={payments.length} icon={<CreditCard className="w-6 h-6" />} color="blue" />
      </div>

      <Card>
        <Table
          columns={[
            { key: 'description', header: 'Description' },
            { key: 'amount', header: 'Montant', render: (p: Payment) => <span className="font-semibold">{formatCurrency(p.amount)}</span> },
            { key: 'status', header: 'Statut', render: (p: Payment) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                {p.status === 'paid' ? 'Payé' : p.status === 'pending' ? 'En attente' : p.status === 'failed' ? 'Échec' : 'Remboursé'}
              </span>
            )},
            { key: 'dueDate', header: 'Échéance', render: (p: Payment) => formatDate(p.dueDate) },
          ]}
          data={payments}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucun paiement"
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Créer un paiement">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Étudiant</label>
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.matricule}</option>)}
            </select>
          </div>
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input label="Montant (€)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Annuler</Button>
            <Button onClick={handleCreatePayment} loading={loading} className="flex-1 justify-center">Créer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// =========== Audit Logs ===========
const AuditLogsView: React.FC = () => {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.universityId) return;
    getAuditLogs(user.universityId).then((l) => {
      setLogs(l.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    });
  }, [user?.universityId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Journal d'Audit</h1>
        <p className="text-gray-500 text-sm">Historique de toutes les actions critiques</p>
      </div>
      <Card>
        <Table
          loading={loading}
          columns={[
            { key: 'action', header: 'Action', render: (l: AuditLog) => <span className="font-medium text-sm">{l.action}</span> },
            { key: 'targetName', header: 'Cible' },
            { key: 'details', header: 'Détails', render: (l: AuditLog) => <span className="text-xs text-gray-500">{l.details}</span> },
            { key: 'severity', header: 'Sévérité', render: (l: AuditLog) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                l.severity === 'critical' ? 'bg-red-100 text-red-700' :
                l.severity === 'error' ? 'bg-orange-100 text-orange-700' :
                l.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>{l.severity}</span>
            )},
            { key: 'timestamp', header: 'Date', render: (l: AuditLog) => formatDate(l.timestamp) },
          ]}
          data={logs}
          keyExtractor={(l) => l.id}
          emptyMessage="Aucun log d'audit"
        />
      </Card>
    </div>
  );
};

const UniversityAdminDashboard: React.FC = () => (
  <Routes>
    <Route index element={<Overview />} />
    <Route path="etudiants" element={<StudentsManagement />} />
    <Route path="enseignants" element={<TeachersManagement />} />
    <Route path="cours" element={<CoursesManagement />} />
    <Route path="paiements" element={<PaymentsManagement />} />
    <Route path="audit" element={<AuditLogsView />} />
    <Route path="*" element={<Overview />} />
  </Routes>
);

export default UniversityAdminDashboard;
