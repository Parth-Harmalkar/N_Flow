'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

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
    <div className="flex h-screen min-h-0 overflow-hidden gap-4 bg-gradient-to-br from-[#faf8f4] via-[var(--bento-canvas)] to-[#ebe6dc] p-4 md:gap-5 md:p-5">
      <Sidebar role={user.role} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:gap-5">
        <header className="flex min-h-[4.25rem] shrink-0 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 px-7 py-3 shadow-[0_12px_40px_-18px_rgba(30,27,75,0.18),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-sm md:px-9">
          <div className="flex min-w-0 flex-col pl-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Workspace
            </span>
            <h2 className="text-lg font-black tracking-tight text-brand-primary">
              {user.role === 'admin' ? 'Admin Central' : 'Employee Portal'}
            </h2>
          </div>

          <div className="flex min-w-0 shrink-0 items-center gap-3 pr-0.5 sm:gap-4">
            <div className="min-w-0 max-w-[9rem] text-right sm:max-w-none">
              <p className="truncate text-sm font-bold leading-none text-brand-primary">{user.name}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-brand-accent">
                {user.role}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary font-black text-white shadow-md shadow-slate-900/15">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Generous inset + moderate radius: stops scroll chrome from clipping page actions */}
        <main className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl border-[6px] border-white/95 bg-[var(--bento-tray)] text-surface-foreground shadow-[0_24px_64px_-28px_rgba(30,27,75,0.22),inset_0_1px_0_rgba(255,255,255,0.55)] ring-1 ring-[var(--bento-tray-edge)] md:rounded-[1.35rem] md:border-8 md:p-8 lg:px-10 lg:py-10 [background-image:linear-gradient(180deg,rgba(255,255,255,0.42)_0%,transparent_38%),radial-gradient(rgba(30,27,75,0.04)_1px,transparent_1px)] [background-size:auto,22px_22px]">
          <div className="w-full min-w-0 max-w-[100rem] pb-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
