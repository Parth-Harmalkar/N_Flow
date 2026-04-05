"use client"

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

interface Props {
  data: { name: string; value: number; color: string }[]
}

export function CompletionRadial({ data }: Props) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            animationDuration={1500}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="transition-all hover:scale-105"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              borderRadius: '12px',
              color: 'var(--foreground)',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-widest">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
