import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="main-content">
        <Navbar onMobileToggle={() => setMobileOpen(prev => !prev)} />
        <main style={{ flex: 1, backgroundColor: 'var(--bg-app)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
