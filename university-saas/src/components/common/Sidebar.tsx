import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, CreditCard,
  BarChart3, Settings, Building, FileText, Bell, Calendar,
  ClipboardList, X, UserCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  super_admin_plateforme: [
    { to: '/dashboard/super-admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Vue d\'ensemble' },
    { to: '/dashboard/super-admin/universites', icon: <Building className="w-5 h-5" />, label: 'Universités' },
    { to: '/dashboard/super-admin/abonnements', icon: <CreditCard className="w-5 h-5" />, label: 'Abonnements' },
    { to: '/dashboard/super-admin/audit', icon: <FileText className="w-5 h-5" />, label: 'Audit Logs' },
    { to: '/dashboard/super-admin/parametres', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' },
  ],
  admin_universite: [
    { to: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Vue d\'ensemble' },
    { to: '/dashboard/admin/etudiants', icon: <Users className="w-5 h-5" />, label: 'Étudiants' },
    { to: '/dashboard/admin/enseignants', icon: <UserCheck className="w-5 h-5" />, label: 'Enseignants' },
    { to: '/dashboard/admin/cours', icon: <BookOpen className="w-5 h-5" />, label: 'Cours & Programmes' },
    { to: '/dashboard/admin/paiements', icon: <CreditCard className="w-5 h-5" />, label: 'Paiements' },
    { to: '/dashboard/admin/notes', icon: <GraduationCap className="w-5 h-5" />, label: 'Notes' },
    { to: '/dashboard/admin/audit', icon: <ClipboardList className="w-5 h-5" />, label: 'Audit Logs' },
    { to: '/dashboard/admin/parametres', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' },
  ],
  teacher: [
    { to: '/dashboard/enseignant', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Vue d\'ensemble' },
    { to: '/dashboard/enseignant/cours', icon: <BookOpen className="w-5 h-5" />, label: 'Mes Cours' },
    { to: '/dashboard/enseignant/notes', icon: <GraduationCap className="w-5 h-5" />, label: 'Saisie des Notes' },
    { to: '/dashboard/enseignant/devoirs', icon: <ClipboardList className="w-5 h-5" />, label: 'Devoirs' },
    { to: '/dashboard/enseignant/ressources', icon: <FileText className="w-5 h-5" />, label: 'Ressources' },
  ],
  student: [
    { to: '/dashboard/etudiant', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Vue d\'ensemble' },
    { to: '/dashboard/etudiant/emploi-du-temps', icon: <Calendar className="w-5 h-5" />, label: 'Emploi du temps' },
    { to: '/dashboard/etudiant/cours', icon: <BookOpen className="w-5 h-5" />, label: 'Mes Cours' },
    { to: '/dashboard/etudiant/notes', icon: <GraduationCap className="w-5 h-5" />, label: 'Notes & Bulletin' },
    { to: '/dashboard/etudiant/paiements', icon: <CreditCard className="w-5 h-5" />, label: 'Paiements' },
  ],
  parent: [
    { to: '/dashboard/parent', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Vue d\'ensemble' },
    { to: '/dashboard/parent/notes', icon: <BarChart3 className="w-5 h-5" />, label: 'Notes de l\'enfant' },
    { to: '/dashboard/parent/absences', icon: <Bell className="w-5 h-5" />, label: 'Absences' },
    { to: '/dashboard/parent/paiements', icon: <CreditCard className="w-5 h-5" />, label: 'Paiements' },
  ],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const navItems = user ? NAV_ITEMS[user.role] ?? [] : [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100
          transform transition-transform duration-300 z-20
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="lg:hidden flex justify-end mb-2">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split('/').length <= 3}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">University SaaS v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};
