import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const PublicLayout: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Outlet />
    <Footer />
  </div>
);
