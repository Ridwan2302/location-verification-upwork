import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BookOpen, GraduationCap, ClipboardList, Plus, Save, Users } from 'lucide-react';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useUniversityStore } from '../../store/universityStore';
import { useAuthStore } from '../../store/authStore';
import { useTenant } from '../../hooks/useTenant';
import { createGrade } from '../../lib/firebase/database';
import { computeLetterGrade, computeGpaPoints, formatDate } from '../../lib/utils/helpers';
import { STATUS_COLORS } from '../../lib/utils/constants';
import type { Course, Grade } from '../../types';

const TeacherOverview: React.FC = () => {
  const { courses, students, grades } = useUniversityStore();
  const { user } = useAuthStore();

  const myCourses = courses.filter((c) => c.teacherId === user?.id);
  const myGrades = grades.filter((g) => g.gradedBy === user?.id);
  const avgScore = myGrades.length > 0
    ? Math.round(myGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / myGrades.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Enseignant</h1>
        <p className="text-gray-500 text-sm">Bonjour, {user?.profile.firstName} {user?.profile.lastName}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Mes cours" value={myCourses.length} icon={<BookOpen className="w-6 h-6" />} color="blue" />
        <StatCard title="Notes saisies" value={myGrades.length} icon={<GraduationCap className="w-6 h-6" />} color="green" />
        <StatCard title="Moyenne classe" value={`${avgScore}%`} icon={<ClipboardList className="w-6 h-6" />} color="purple" />
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Mes cours assignés</h3>
        {myCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Aucun cours assigné</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myCourses.map((course) => (
              <div key={course.id} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{course.name}</p>
                    <p className="text-xs text-blue-600 font-mono">{course.code}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{course.credits} ECTS</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolledStudents.length}/{course.maxStudents}</span>
                  <span>{course.semester}</span>
                  <span>{course.department}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const GradeEntry: React.FC = () => {
  const { courses, students, grades, addGrade } = useUniversityStore();
  const { user } = useAuthStore();
  const { logAction } = useTenant();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const myCourses = courses.filter((c) => c.teacherId === user?.id);
  const currentYear = `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`;

  const handleSaveGrades = async () => {
    if (!selectedCourse || !user?.universityId) return;
    setSaving(true);
    try {
      for (const [studentId, scoreStr] of Object.entries(scores)) {
        const score = Number(scoreStr);
        if (isNaN(score) || score < 0) continue;
        const letterGrade = computeLetterGrade(score, 20);
        const gpaPoints = computeGpaPoints(letterGrade);

        const gradeId = await createGrade(user.universityId, {
          universityId: user.universityId,
          studentId,
          courseId: selectedCourse.id,
          score,
          maxScore: 20,
          weight: 1,
          letterGrade,
          gpaPoints,
          semester: selectedCourse.semester,
          academicYear: currentYear,
          gradedBy: user.id,
          gradedAt: Date.now(),
          status: 'draft',
        });
        addGrade({ id: gradeId, universityId: user.universityId, studentId, courseId: selectedCourse.id, score, maxScore: 20, weight: 1, letterGrade, gpaPoints, semester: selectedCourse.semester, academicYear: currentYear, gradedBy: user.id, gradedAt: Date.now(), status: 'draft' });
        await logAction('GRADE_ENTRY', 'grade', gradeId, studentId, `Note saisie: ${score}/20 pour ${selectedCourse.code}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setScores({});
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const enrolledStudents = selectedCourse
    ? students.filter((s) => selectedCourse.enrolledStudents.includes(s.id))
    : students.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saisie des Notes</h1>
        <p className="text-gray-500 text-sm">Interface rapide de saisie des évaluations</p>
      </div>

      <Card>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un cours</label>
          <select
            value={selectedCourse?.id ?? ''}
            onChange={(e) => {
              const c = myCourses.find((co) => co.id === e.target.value) ?? null;
              setSelectedCourse(c);
              setScores({});
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choisir un cours --</option>
            {myCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm font-medium">
            ✓ Notes enregistrées avec succès
          </div>
        )}

        {enrolledStudents.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Matricule</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Programme</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Note /20</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Lettre</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrolledStudents.map((student) => {
                    const score = scores[student.id] !== undefined ? Number(scores[student.id]) : null;
                    const letter = score !== null && !isNaN(score) ? computeLetterGrade(score, 20) : '—';
                    const gpa = score !== null && !isNaN(score) ? computeGpaPoints(letter) : '—';
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-blue-600">{student.matricule}</td>
                        <td className="px-4 py-3 text-gray-600">{student.program}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            step={0.5}
                            value={scores[student.id] ?? ''}
                            onChange={(e) => setScores((prev) => ({ ...prev, [student.id]: e.target.value }))}
                            className="w-20 text-center border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="—"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${letter === 'F' ? 'text-red-600' : letter.startsWith('A') ? 'text-green-600' : 'text-gray-700'}`}>
                            {letter}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500">{gpa}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveGrades} loading={saving} icon={<Save className="w-4 h-4" />}>
                Enregistrer les notes
              </Button>
            </div>
          </>
        )}

        {!selectedCourse && (
          <div className="text-center py-12 text-gray-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Sélectionnez un cours pour saisir les notes</p>
          </div>
        )}
      </Card>
    </div>
  );
};

const AssignmentsView: React.FC = () => {
  const { courses } = useUniversityStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [maxScore, setMaxScore] = useState('20');

  const myCourses = courses.filter((c) => c.teacherId === user?.id);
  const allAssignments = myCourses.flatMap((c) =>
    c.assignments.map((a) => ({ ...a, courseName: c.name, courseCode: c.code }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Devoirs</h1>
          <p className="text-gray-500 text-sm">{allAssignments.length} devoirs publiés</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>Nouveau devoir</Button>
      </div>

      <Card>
        {allAssignments.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucun devoir publié</p>
            <p className="text-gray-400 text-sm">Créez votre premier devoir pour vos étudiants</p>
          </div>
        ) : (
          <Table
            columns={[
              { key: 'title', header: 'Titre' },
              { key: 'courseName', header: 'Cours' },
              { key: 'maxScore', header: 'Note max', render: (a) => `/${(a as { maxScore: number }).maxScore}` },
              { key: 'dueDate', header: 'Date limite', render: (a) => formatDate((a as { dueDate: number }).dueDate) },
              { key: 'weight', header: 'Coefficient', render: (a) => `×${(a as { weight: number }).weight}` },
            ]}
            data={allAssignments}
            keyExtractor={(a) => (a as { id: string }).id}
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Créer un devoir">
        <div className="space-y-4">
          <Input label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Devoir 1 — Algorithmes" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Instructions du devoir..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Note maximale" type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
            <Input label="Date limite" type="date" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 justify-center">Annuler</Button>
            <Button className="flex-1 justify-center">Publier le devoir</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TeacherDashboard: React.FC = () => (
  <Routes>
    <Route index element={<TeacherOverview />} />
    <Route path="cours" element={<TeacherOverview />} />
    <Route path="notes" element={<GradeEntry />} />
    <Route path="devoirs" element={<AssignmentsView />} />
    <Route path="*" element={<TeacherOverview />} />
  </Routes>
);

export default TeacherDashboard;
