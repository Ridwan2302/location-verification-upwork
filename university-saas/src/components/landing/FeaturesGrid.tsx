import React from 'react';
import {
  BarChart3, Settings, FileText, Bell,
  ClipboardList, BookOpen, MessageSquare, Users,
  Calendar, Monitor, GraduationCap, CreditCard,
  Eye, AlertCircle, TrendingUp, Building
} from 'lucide-react';

const profiles = [
  {
    title: 'Administrateurs',
    icon: Building,
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100 text-blue-600',
    titleColor: 'text-blue-900',
    features: [
      { icon: BarChart3, text: 'Tableaux de bord analytics temps réel' },
      { icon: Settings, text: 'Gestion centralisée multi-entités' },
      { icon: FileText, text: 'Reporting avancé et exports' },
      { icon: Bell, text: 'Automatisation des processus administratifs' },
    ],
  },
  {
    title: 'Enseignants',
    icon: GraduationCap,
    color: 'green',
    bg: 'bg-green-50',
    border: 'border-green-100',
    iconBg: 'bg-green-100 text-green-600',
    titleColor: 'text-green-900',
    features: [
      { icon: ClipboardList, text: 'Saisie rapide des notes avec coefficients' },
      { icon: BookOpen, text: 'Gestion et publication des devoirs' },
      { icon: FileText, text: 'Ressources pédagogiques centralisées' },
      { icon: MessageSquare, text: 'Communication directe avec étudiants' },
    ],
  },
  {
    title: 'Étudiants',
    icon: Users,
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100 text-purple-600',
    titleColor: 'text-purple-900',
    features: [
      { icon: Calendar, text: 'Emploi du temps interactif' },
      { icon: Monitor, text: 'E-learning et ressources en ligne' },
      { icon: GraduationCap, text: 'Suivi des notes et GPA en temps réel' },
      { icon: CreditCard, text: 'Paiements de scolarité en ligne' },
    ],
  },
  {
    title: 'Parents',
    icon: Eye,
    color: 'orange',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    iconBg: 'bg-orange-100 text-orange-600',
    titleColor: 'text-orange-900',
    features: [
      { icon: TrendingUp, text: 'Transparence totale des résultats' },
      { icon: AlertCircle, text: 'Suivi des absences avec alertes' },
      { icon: Bell, text: 'Notifications de paiements' },
      { icon: MessageSquare, text: 'Communication avec l\'administration' },
    ],
  },
];

export const FeaturesGrid: React.FC = () => (
  <section id="fonctionnalites" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          Fonctionnalités
        </span>
        <h2 className="text-4xl font-bold text-gray-900">
          Une solution pour chaque acteur
        </h2>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Des tableaux de bord personnalisés pour chaque profil utilisateur, conçus pour maximiser la productivité.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {profiles.map((profile) => {
          const Icon = profile.icon;
          return (
            <div
              key={profile.title}
              className={`rounded-2xl border p-6 ${profile.bg} ${profile.border}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${profile.iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold mb-4 ${profile.titleColor}`}>
                {profile.title}
              </h3>
              <ul className="space-y-3">
                {profile.features.map(({ icon: FIcon, text }) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <FIcon className="w-4 h-4 mt-0.5 opacity-60 flex-shrink-0 text-gray-500" />
                    <span className="text-sm text-gray-600">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Additional features banner */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { value: '99.9%', label: 'Disponibilité garantie', desc: 'SLA entreprise' },
            { value: 'RGPD', label: 'Conformité totale', desc: 'Données hébergées en Europe' },
            { value: '<24h', label: 'Déploiement', desc: 'Votre campus en ligne rapidement' },
          ].map(({ value, label, desc }) => (
            <div key={label}>
              <p className="text-3xl font-black">{value}</p>
              <p className="font-semibold mt-1">{label}</p>
              <p className="text-blue-200 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
