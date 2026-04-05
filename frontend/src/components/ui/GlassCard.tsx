'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: React.ReactNode;
  /** Grid/layout placement classes — applied to outer wrapper */
  gridClassName?: string;
  className?: string;
  variant?: 'default' | 'brand' | 'danger' | 'success';
  noPadding?: boolean;
  animate?: boolean;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[var(--surface-1)] border-[var(--surface-border)]',
  brand: 'border-[rgba(99,102,241,0.25)]',
  danger: 'bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.15)]',
  success: 'bg-[rgba(16,185,129,0.06)] border-[rgba(16,185,129,0.15)]',
};

const variantGlow: Record<string, string> = {
  default: '',
  brand: '0 0 40px rgba(99,102,241,0.12)',
  danger: '0 0 30px rgba(239,68,68,0.08)',
  success: '0 0 30px rgba(16,185,129,0.08)',
};

export const Panel = ({
  children,
  className = '',
  gridClassName,
  variant = 'default',
  noPadding = false,
  animate = true,
}: PanelProps) => {
  const isBrand = variant === 'brand';

  const inner = (
    <div
      className={cn(
        'relative flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border',
        variantStyles[variant],
        isBrand && 'bg-gradient-to-br from-[rgba(99,102,241,0.15)] via-[rgba(99,102,241,0.07)] to-transparent',
        !noPadding && 'p-5 md:p-6',
        className
      )}
      style={{
        boxShadow: variantGlow[variant]
          ? `0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset, ${variantGlow[variant]}`
          : '0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset',
      }}
    >
      {children}
    </div>
  );

  const wrapClass = cn('relative min-h-0 min-w-0 w-full', gridClassName);

  if (!animate) return <div className={wrapClass}>{inner}</div>;

  return (
    <motion.div
      className={wrapClass}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {inner}
    </motion.div>
  );
};