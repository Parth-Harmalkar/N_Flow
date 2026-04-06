'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface DateSelectorProps {
  dateStr: string;
}

export const DateSelector = ({ dateStr }: DateSelectorProps) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      router.push(`?date=${newDate}`);
    }
  };

  return (
    <input 
      type="date" 
      defaultValue={dateStr}
      onChange={handleChange}
      className="bg-transparent border-none text-[10px] font-bold text-[var(--foreground)] outline-none px-2 cursor-pointer"
    />
  );
};
