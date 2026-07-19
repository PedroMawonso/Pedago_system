import React from 'react';
import Header from '../componets/Header';
import Sidebar from '../componets/Sidebar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="pt-20 p-4 lg:p-8 lg:pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
