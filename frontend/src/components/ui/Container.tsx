"use client";

import React from "react";
import { motion } from "framer-motion";

interface ContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const maxWeights = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({ 
  children, 
  title, 
  subtitle, 
  actions, 
  maxWidth = "full",
  className = "" 
}: ContainerProps) {
  const widthCls = maxWeights[maxWidth];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full min-w-0 max-w-full py-0 ${widthCls} ${className} min-h-full`}
    >
      {(title || actions) && (
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-200/90 pb-8 md:mb-10 md:flex-row md:items-start md:justify-between md:gap-8 md:pb-10">
          <div className="min-w-0 max-w-2xl shrink">
            {title && (
              <h1 className="mb-2 text-3xl font-black leading-tight tracking-tight text-brand-primary sm:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center justify-start gap-3 md:justify-end lg:max-w-[min(100%,28rem)]">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="space-y-4 md:space-y-5">
        {children}
      </div>
    </motion.div>
  );
}
