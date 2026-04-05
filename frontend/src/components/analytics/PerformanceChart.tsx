"use client"

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

interface Props {
  data: { name: string; hours: number }[]
}

export function PerformanceChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              borderRadius: '12px',
              color: 'var(--foreground)',
              fontSize: '12px'
            }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar 
            dataKey="hours" 
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.hours > 40 ? 'var(--brand-primary)' : 'rgba(99,102,241,0.4)'} 
                className="transition-all hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
