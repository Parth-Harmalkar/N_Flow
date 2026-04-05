'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
  Clock,
  Calendar,
  History,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  role: 'admin' | 'employee';
}

const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Strategic Briefings', href: '/admin/meetings', icon: Video },
  { name: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
  { name: 'Personnel', href: '/admin/users', icon: Users },
  { name: 'Logs', href: '/admin/logs', icon: ClipboardList },
  { name: 'Attendance', href: '/admin/attendance', icon: Calendar },
  { name: 'Leaves', href: '/admin/leaves', icon: ClipboardList },
];

const employeeLinks = [
  { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', href: '/employee/tasks', icon: Clock },
  { name: 'Submit Log', href: '/employee/logs', icon: History },
  { name: 'Attendance', href: '/employee/attendance', icon: Calendar },
  { name: 'Request Leave', href: '/employee/leaves', icon: ClipboardList },
];

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : employeeLinks;

  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="relative flex w-[60px] shrink-0 flex-col items-center border-r border-[var(--surface-border)] bg-[var(--surface-1)] py-5">
      {/* Logo */}
      <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(99,102,241,0.3)] bg-[var(--brand-primary-dim)]" style={{ boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
        <span className="text-base font-black italic text-[var(--brand-accent)]">N</span>
      </div>

      {/* Divider */}
      <div className="mb-4 w-8 border-t border-[var(--surface-border)]" />

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-[var(--brand-primary-dim)] text-[var(--brand-primary)]'
                  : 'text-[var(--foreground-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground-muted)]'
              )}
              style={isActive ? { boxShadow: '0 0 12px rgba(99,102,241,0.2)' } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg border border-[rgba(99,102,241,0.25)] bg-[var(--brand-primary-dim)]"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />

              {/* Tooltip */}
              <div className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-[var(--surface-border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--foreground)] opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
                {link.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-2 w-8 border-t border-[var(--surface-border)] mb-2" />
      <button onClick={handleLogout} className="group relative flex h-10 w-10 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-all hover:bg-[rgba(239,68,68,0.08)] hover:text-[var(--status-danger)]">
        <LogOut className="h-4 w-4" />
        <div className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--status-danger)] opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
          Logout
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;