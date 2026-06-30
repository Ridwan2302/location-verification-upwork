import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Building, Users, DollarSign, TrendingUp, CheckCircle,
  XCircle, Clock, Eye, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { getAllUniversities, updateUniversity, getAuditLogs } from '../../lib/firebase/database';
import { formatDate, formatCurrency } from '../../lib/utils/helpers';
import { STATUS_COLORS } from '../../lib/utils/constants';
import type { University, AuditLog } from '../../types';

const revenueData = [
  { month: 'Jan', revenu: 12500, universites: 25 },
  { month: 'Fév', revenu: 15200, universites: 28 },
  { month: 'Mar', revenu: 18900, universites: 32 },
  { month: 'Avr', revenu: 22400, universites: 38 },
  { month: 'Mai', revenu: 26800, universites: 44 },
  { month: 'Jun', revenu: 31500, universites: 51 },
];

const SuperAdminOverview: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  useEffect(() => {
    getAllUniversities().then((unis) => {
      setUniversities(unis);
      setLoading(false);
    });
  }, []);

  const handleToggleStatus = async (uni: University) => {
    const newStatus = uni.status === 'active' ? 'suspended' : 'active';
    await updateUniversity(uni.id, { status: newStatus });
    setUniversities((prev) =>
      prev.map((u) => (u.id === uni.id ? { ...u, status: newStatus } : u))
    );
  };

  const totalRevenu = universities.length * 250; // Simulation
  const activeCount = universities.filter((u) => u.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Plateforme</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de toutes les universités clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Universités actives"
          value={activeCount}
          icon={<Building className="w-6 h-6" />}
          color="blue"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Revenu mensuel"
          value={formatCurrency(totalRevenu)}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          trend={{ value: 18, positive: true }}
        />
        <StatCard
          title="Utilisateurs totaux"
          value={(universities.length * 320).toLocaleString('fr-FR')}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Taux de conversion"
          value="68%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
          trend={{ value: 5, positive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Évolution du revenu</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Revenu']} />
              <Area type="monotone" dataKey="revenu" stroke="#3b82f6" fill="url(#colorRevenu)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Croissance des universités</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="universites" fill="#6366f1" radius={[4, 4, 0, 0]} name="Universités" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Universities table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Universités clientes</h3>
          <Link to="/onboarding">
            <Button size="sm" icon={<Building className="w-4 h-4" />}>
              Nouvelle université
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Chargement...</div>
        ) : universities.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune université enregistrée</p>
            <p className="text-gray-400 text-sm">Les universités créées via l'onboarding apparaîtront ici</p>
          </div>
        ) : (
          <Table
            columns={[
              { key: 'name', header: 'Université', render: (u: University) => (
                <span className="font-medium text-gray-900">{u.name}</span>
              )},
              { key: 'subscriptionPlan', header: 'Plan', render: (u: University) => (
                <span className="capitalize bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  {u.subscriptionPlan}
                </span>
              )},
              { key: 'status', header: 'Statut', render: (u: University) => (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[u.status]}`}>
                  {u.status === 'active' ? 'Actif' : u.status === 'suspended' ? 'Suspendu' : 'Essai'}
                </span>
              )},
              { key: 'createdAt', header: 'Inscrit le', render: (u: University) => formatDate(u.createdAt) },
              { key: 'actions', header: 'Actions', render: (u: University) => (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" icon={<Eye className="w-4 h-4" />} onClick={() => setSelectedUni(u)} />
                  <Button
                    size="sm"
                    variant={u.status === 'active' ? 'danger' : 'secondary'}
                    onClick={() => handleToggleStatus(u)}
                  >
                    {u.status === 'active' ? 'Suspendre' : 'Activer'}
                  </Button>
                </div>
              )},
            ]}
            data={universities}
            keyExtractor={(u) => u.id}
          />
        )}
      </Card>

      <Modal
        isOpen={!!selectedUni}
        onClose={() => setSelectedUni(null)}
        title={`Détails — ${selectedUni?.name}`}
        size="lg"
      >
        {selectedUni && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Identifiant', selectedUni.slug],
                ['Plan', selectedUni.subscriptionPlan],
                ['Statut', selectedUni.status],
                ['Max étudiants', selectedUni.maxStudents.toLocaleString('fr-FR')],
                ['Email admin', selectedUni.adminEmail],
                ['Créé le', formatDate(selectedUni.createdAt)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-gray-500">{k}</p>
                  <p className="font-medium text-gray-900">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const SuperAdminDashboard: React.FC = () => (
  <Routes>
    <Route index element={<SuperAdminOverview />} />
    <Route path="universites" element={<SuperAdminOverview />} />
    <Route path="*" element={<SuperAdminOverview />} />
  </Routes>
);

export default SuperAdminDashboard;
