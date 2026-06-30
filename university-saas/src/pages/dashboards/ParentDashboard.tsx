import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GraduationCap, CreditCard, Bell, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { useUniversityStore } from '../../store/universityStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate, formatCurrency, computeGPA } from '../../lib/utils/helpers';
import { STATUS_COLORS } from '../../lib/utils/constants';
import type { Grade, Payment } from '../../types';

const ParentOverview: React.FC = () => {
  const { students, grades, payments, courses } = useUniversityStore();
  const { user } = useAuthStore();

  const myChild = students.find((s) => s.parentId === user?.id);
  const childGrades = myChild ? grades.filter((g) => g.studentId === myChild.id && g.status === 'published') : [];
  const childPayments = myChild ? payments.filter((p) => p.studentId === myChild.id) : [];
  const pendingPayments = childPayments.filter((p) => p.status === 'pending');
  const gpa = computeGPA(childGrades.map((g) => ({ gpaPoints: g.gpaPoints, weight: g.weight })));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Espace Parent / Tuteur</h1>
        <p className="text-gray-500 text-sm">
          {myChild ? `Suivi de : Matricule ${myChild.matricule} — ${myChild.program}` : 'Tableau de bord parental'}
        </p>
      </div>

      {pendingPayments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-800 font-medium">
            {pendingPayments.length} paiement(s) en attente —{' '}
            {formatCurrency(pendingPayments.reduce((s, p) => s + p.amount, 0))} à régler
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="GPA de l'enfant" value={gpa.toFixed(2)} icon={<GraduationCap className="w-6 h-6" />} color="purple" />
        <StatCard title="Notes reçues" value={childGrades.length} icon={<TrendingUp className="w-6 h-6" />} color="green" />
        <StatCard title="Paiements en attente" value={pendingPayments.length} icon={<CreditCard className="w-6 h-6" />} color={pendingPayments.length > 0 ? 'orange' : 'green'} />
        <StatCard title="Absences" value="0" icon={<Bell className="w-6 h-6" />} color="blue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Dernières notes</h3>
          {childGrades.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune note publiée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {childGrades.slice(0, 5).map((grade) => {
                const course = courses.find((c) => c.id === grade.courseId);
                const pct = Math.round((grade.score / grade.maxScore) * 100);
                return (
                  <div key={grade.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      grade.letterGrade.startsWith('A') ? 'bg-green-100 text-green-700' :
                      grade.letterGrade === 'F' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {grade.letterGrade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{course?.name ?? grade.courseId}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{grade.score}/{grade.maxScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Prochains paiements</h3>
          {childPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun paiement</p>
            </div>
          ) : (
            <div className="space-y-3">
              {childPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                    <p className="text-xs text-gray-500">Échéance : {formatDate(payment.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[payment.status]}`}>
                      {payment.status === 'paid' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'Échoué'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Communication */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Communication Administration</h3>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Messagerie avec l'administration</p>
          <p className="text-gray-400 text-xs mt-1 mb-4">Posez vos questions directement à l'équipe pédagogique</p>
          <Button variant="outline" icon={<MessageSquare className="w-4 h-4" />} size="sm">
            Envoyer un message
          </Button>
        </div>
      </Card>
    </div>
  );
};

const ParentGrades: React.FC = () => {
  const { grades, students, courses } = useUniversityStore();
  const { user } = useAuthStore();
  const myChild = students.find((s) => s.parentId === user?.id);
  const childGrades = myChild ? grades.filter((g) => g.studentId === myChild.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notes de mon enfant</h1>
        <p className="text-gray-500 text-sm">Suivi détaillé des évaluations</p>
      </div>
      <Card>
        <Table
          columns={[
            { key: 'courseId', header: 'Cours', render: (g: Grade) => {
              const course = courses.find((c) => c.id === g.courseId);
              return <span className="font-medium text-sm">{course?.name ?? g.courseId}</span>;
            }},
            { key: 'score', header: 'Note', render: (g: Grade) => <span className="font-bold">{g.score}/{g.maxScore}</span> },
            { key: 'letterGrade', header: 'Mention', render: (g: Grade) => (
              <span className={`font-bold ${g.letterGrade.startsWith('A') ? 'text-green-600' : g.letterGrade === 'F' ? 'text-red-600' : 'text-gray-700'}`}>
                {g.letterGrade}
              </span>
            )},
            { key: 'semester', header: 'Semestre' },
            { key: 'status', header: 'Statut', render: (g: Grade) => (
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[g.status]}`}>
                {g.status === 'published' ? 'Publié' : 'Brouillon'}
              </span>
            )},
          ]}
          data={childGrades}
          keyExtractor={(g) => g.id}
          emptyMessage="Aucune note disponible"
        />
      </Card>
    </div>
  );
};

const ParentDashboard: React.FC = () => (
  <Routes>
    <Route index element={<ParentOverview />} />
    <Route path="notes" element={<ParentGrades />} />
    <Route path="absences" element={<ParentOverview />} />
    <Route path="paiements" element={<ParentOverview />} />
    <Route path="*" element={<ParentOverview />} />
  </Routes>
);

export default ParentDashboard;
