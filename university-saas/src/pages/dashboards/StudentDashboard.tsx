import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  GraduationCap, BookOpen, CreditCard, Calendar,
  Download, TrendingUp, Award, AlertCircle, CheckCircle
} from 'lucide-react';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { useUniversityStore } from '../../store/universityStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate, formatCurrency, computeGPA } from '../../lib/utils/helpers';
import { STATUS_COLORS, DAYS_OF_WEEK } from '../../lib/utils/constants';
import type { Grade, Payment, Course } from '../../types';

const StudentOverview: React.FC = () => {
  const { grades, courses, payments, students } = useUniversityStore();
  const { user } = useAuthStore();

  const myStudent = students.find((s) => s.userId === user?.id);
  const myGrades = grades.filter((g) => g.studentId === myStudent?.id && g.status === 'published');
  const myPayments = payments.filter((p) => p.studentId === myStudent?.id);
  const myEnrolledCourses = courses.filter((c) => myStudent && c.enrolledStudents.includes(myStudent.id));

  const gpa = computeGPA(myGrades.map((g) => ({ gpaPoints: g.gpaPoints, weight: g.weight })));
  const pendingPayments = myPayments.filter((p) => p.status === 'pending');

  const exportData = () => {
    if (!user || !myStudent) return;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      profile: user.profile,
      email: user.email,
      academicRecord: {
        matricule: myStudent.matricule,
        program: myStudent.program,
        department: myStudent.department,
        currentYear: myStudent.currentYear,
        gpa,
        grades: myGrades,
      },
      payments: myPayments,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-donnees-rgpd-${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Espace Étudiant</h1>
          <p className="text-gray-500 text-sm">
            {myStudent ? `Matricule: ${myStudent.matricule} — ${myStudent.program}` : 'Bienvenue'}
          </p>
        </div>
        <Button variant="outline" onClick={exportData} icon={<Download className="w-4 h-4" />} size="sm">
          Export RGPD
        </Button>
      </div>

      {pendingPayments.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <p className="text-sm text-yellow-800 font-medium">
            {pendingPayments.length} paiement(s) en attente — Total : {formatCurrency(pendingPayments.reduce((s, p) => s + p.amount, 0))}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="GPA" value={gpa.toFixed(2)} icon={<Award className="w-6 h-6" />} color="purple" />
        <StatCard title="Cours inscrits" value={myEnrolledCourses.length} icon={<BookOpen className="w-6 h-6" />} color="blue" />
        <StatCard title="Notes reçues" value={myGrades.length} icon={<GraduationCap className="w-6 h-6" />} color="green" />
        <StatCard title="Paiements en attente" value={pendingPayments.length} icon={<CreditCard className="w-6 h-6" />} color={pendingPayments.length > 0 ? 'orange' : 'green'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Mes dernières notes</h3>
          {myGrades.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune note disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myGrades.slice(0, 5).map((grade) => {
                const course = courses.find((c) => c.id === grade.courseId);
                const pct = Math.round((grade.score / grade.maxScore) * 100);
                return (
                  <div key={grade.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      grade.letterGrade.startsWith('A') ? 'bg-green-100 text-green-700' :
                      grade.letterGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                      grade.letterGrade === 'F' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {grade.letterGrade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {course?.name ?? grade.courseId}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{grade.score}/{grade.maxScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Mes cours</h3>
          {myEnrolledCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun cours inscrit</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myEnrolledCourses.slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{course.name}</p>
                    <p className="text-xs text-gray-500">{course.code} — {course.credits} ECTS — {course.semester}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const GradesView: React.FC = () => {
  const { grades, courses, students } = useUniversityStore();
  const { user } = useAuthStore();
  const myStudent = students.find((s) => s.userId === user?.id);
  const myGrades = grades.filter((g) => g.studentId === myStudent?.id);
  const published = myGrades.filter((g) => g.status === 'published');
  const gpa = computeGPA(published.map((g) => ({ gpaPoints: g.gpaPoints, weight: g.weight })));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Notes & Bulletin</h1>
          <p className="text-gray-500 text-sm">GPA global : <span className="font-bold text-blue-600">{gpa.toFixed(2)}/4.0</span></p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />}>Télécharger le bulletin</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="GPA" value={gpa.toFixed(2)} icon={<Award className="w-6 h-6" />} color="purple" />
        <StatCard title="Notes publiées" value={published.length} icon={<CheckCircle className="w-6 h-6" />} color="green" />
        <StatCard title="Moyenne générale" value={`${published.length > 0 ? Math.round(published.reduce((s, g) => s + (g.score / g.maxScore) * 20, 0) / published.length * 10) / 10 : 0}/20`} icon={<TrendingUp className="w-6 h-6" />} color="blue" />
      </div>

      <Card>
        <Table
          columns={[
            { key: 'courseId', header: 'Cours', render: (g: Grade) => {
              const course = courses.find((c) => c.id === g.courseId);
              return (
                <div>
                  <p className="font-medium text-sm">{course?.name ?? g.courseId}</p>
                  <p className="text-xs text-gray-500">{course?.code}</p>
                </div>
              );
            }},
            { key: 'score', header: 'Note', render: (g: Grade) => (
              <span className="font-bold">{g.score}/{g.maxScore}</span>
            )},
            { key: 'letterGrade', header: 'Mention', render: (g: Grade) => (
              <span className={`font-bold text-lg ${
                g.letterGrade.startsWith('A') ? 'text-green-600' :
                g.letterGrade.startsWith('B') ? 'text-blue-600' :
                g.letterGrade === 'F' ? 'text-red-600' : 'text-gray-700'
              }`}>{g.letterGrade}</span>
            )},
            { key: 'gpaPoints', header: 'Points GPA' },
            { key: 'semester', header: 'Semestre' },
            { key: 'status', header: 'Statut', render: (g: Grade) => (
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[g.status]}`}>
                {g.status === 'published' ? 'Publié' : g.status === 'draft' ? 'Brouillon' : 'Archivé'}
              </span>
            )},
          ]}
          data={myGrades}
          keyExtractor={(g) => g.id}
          emptyMessage="Aucune note disponible"
        />
      </Card>
    </div>
  );
};

const PaymentsView: React.FC = () => {
  const { payments, students } = useUniversityStore();
  const { user } = useAuthStore();
  const myStudent = students.find((s) => s.userId === user?.id);
  const myPayments = payments.filter((p) => p.studentId === myStudent?.id);

  const exportData = () => {
    if (!user || !myStudent) return;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      profile: user.profile,
      email: user.email,
      academicRecord: { matricule: myStudent.matricule, program: myStudent.program },
      payments: myPayments,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-donnees-rgpd-${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Paiements</h1>
          <p className="text-gray-500 text-sm">{myPayments.length} transactions</p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={exportData}>
          Export RGPD
        </Button>
      </div>

      <Card>
        <Table
          columns={[
            { key: 'description', header: 'Description' },
            { key: 'amount', header: 'Montant', render: (p: Payment) => (
              <span className="font-bold">{formatCurrency(p.amount, p.currency)}</span>
            )},
            { key: 'status', header: 'Statut', render: (p: Payment) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                {p.status === 'paid' ? 'Payé' : p.status === 'pending' ? 'En attente' : p.status === 'failed' ? 'Échec' : 'Remboursé'}
              </span>
            )},
            { key: 'dueDate', header: 'Échéance', render: (p: Payment) => formatDate(p.dueDate) },
            { key: 'paidDate', header: 'Payé le', render: (p: Payment) => p.paidDate ? formatDate(p.paidDate) : '—' },
            { key: 'action', header: '', render: (p: Payment) => (
              p.status === 'pending' ? (
                <Button size="sm" icon={<CreditCard className="w-4 h-4" />}>Payer</Button>
              ) : p.status === 'paid' ? (
                <Button size="sm" variant="ghost" icon={<Download className="w-4 h-4" />}>Reçu</Button>
              ) : null
            )},
          ]}
          data={myPayments}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucun paiement enregistré"
        />
      </Card>
    </div>
  );
};

const ScheduleView: React.FC = () => {
  const { courses, students } = useUniversityStore();
  const { user } = useAuthStore();
  const myStudent = students.find((s) => s.userId === user?.id);
  const myCourses = courses.filter((c) => myStudent && c.enrolledStudents.includes(myStudent.id));

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emploi du Temps</h1>
        <p className="text-gray-500 text-sm">Vue hebdomadaire de vos cours</p>
      </div>
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-gray-500 font-semibold w-20">Heure</th>
                {DAYS_OF_WEEK.map((d) => (
                  <th key={d} className="p-3 text-gray-500 font-semibold text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-t border-gray-50">
                  <td className="p-3 text-gray-400 font-medium">{time}</td>
                  {DAYS_OF_WEEK.map((day) => {
                    const course = myCourses.find((c) =>
                      c.schedule.some((s) => s.day === day && s.startTime === time)
                    );
                    const schedule = course?.schedule.find((s) => s.day === day && s.startTime === time);
                    return (
                      <td key={day} className="p-1">
                        {course && schedule ? (
                          <div className="bg-blue-100 border border-blue-200 rounded-lg p-2 text-blue-800">
                            <p className="font-semibold truncate">{course.name}</p>
                            <p className="text-blue-600 text-xs">{schedule.room}</p>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myCourses.every((c) => c.schedule.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Aucun cours planifié dans l'emploi du temps</p>
          </div>
        )}
      </Card>
    </div>
  );
};

const StudentDashboard: React.FC = () => (
  <Routes>
    <Route index element={<StudentOverview />} />
    <Route path="emploi-du-temps" element={<ScheduleView />} />
    <Route path="cours" element={<StudentOverview />} />
    <Route path="notes" element={<GradesView />} />
    <Route path="paiements" element={<PaymentsView />} />
    <Route path="*" element={<StudentOverview />} />
  </Routes>
);

export default StudentDashboard;
