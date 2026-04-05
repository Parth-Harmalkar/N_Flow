"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: any[];
}

export function PersonalPerformanceChart({ data }: Props) {
  return (
    <div className="h-[240px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPersonal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--foreground-subtle)', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--foreground-subtle)', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-3)', 
              borderColor: 'var(--surface-border)',
              borderRadius: '12px',
              fontSize: '11px',
              color: 'var(--foreground)' 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="hours" 
            stroke="var(--brand-primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPersonal)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
