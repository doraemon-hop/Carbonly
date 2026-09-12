import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';
import { ToastContainer } from '../components/Toast';
import { VerificationModal } from '../components/VerificationModal';

export const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopNav onMenuClick={() => setIsMobileOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Overlays */}
      <ToastContainer />
      <VerificationModal />
    </div>
  );
};
