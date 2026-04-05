'use client';

import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: 'admin' | 'employee';
    email: string;
  };
}

const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar role={user.role} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-1)] px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-subtle)]">
              Workspace
            </p>
            <h2 className="text-sm font-bold text-[var(--foreground)]">
              {user.role === 'admin' ? 'Admin Central' : 'Employee Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
                {user.role}
              </p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(99,102,241,0.25)] bg-[var(--brand-primary-dim)] text-sm font-bold text-[var(--brand-accent)]"
              style={{ boxShadow: '0 0 16px rgba(99,102,241,0.15)' }}
            >
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[100rem]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;