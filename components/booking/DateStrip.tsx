'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getCurrentMonthBounds, isDateInPast } from '@/lib/date';

interface DateStripProps {
  selectedDate: string;
  today: string;
  onSelectDate: (dateISO: string) => void;
}

export default function DateStrip({
  selectedDate,
  today,
  onSelectDate,
}: DateStripProps) {
  const { year, month, monthISO, daysInMonth, monthLabel } = useMemo(
    () => getCurrentMonthBounds(),
    []
  );

  const allMonthDays = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateISO = `${monthISO}-${String(dayNum).padStart(2, '0')}`;
      const jsDate = new Date(Date.UTC(year, month - 1, dayNum, 12, 0, 0));
      const dayName = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'short',
      })
        .format(jsDate)
        .toUpperCase();

      return {
        dateISO,
        dayNum,
        dayName,
        isPast: isDateInPast(dateISO),
        isToday: dateISO === today,
      };
    });
  }, [year, month, monthISO, daysInMonth, today]);

  const [manualWindow, setManualWindow] = useState<number | null>(null);

  const windowStart = useMemo(() => {
    if (manualWindow !== null) {
      return manualWindow;
    }
    const idx = allMonthDays.findIndex((d) => d.dateISO === selectedDate);
    if (idx === -1) return 0;
    return Math.max(0, Math.min(idx, daysInMonth - 7));
  }, [manualWindow, allMonthDays, selectedDate, daysInMonth]);

  const visibleDays = allMonthDays.slice(windowStart, windowStart + 7);

  const canGoPrev = windowStart > 0;
  const canGoNext = windowStart + 7 < daysInMonth;

  const handlePrev = () => {
    setManualWindow(Math.max(0, windowStart - 7));
  };

  const handleNext = () => {
    setManualWindow(Math.min(daysInMonth - 7, windowStart + 7));
  };

  const handleSelect = (dateISO: string) => {
    onSelectDate(dateISO);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#c89b3c]" />
          <span className="text-xs font-bold text-white capitalize">
            {monthLabel}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#c89b3c]/10 text-[#c89b3c] border border-[#c89b3c]/20">
            Bulan Ini
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            title="Minggu sebelumnya"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center text-[#d1d5db] hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            title="Minggu berikutnya"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center text-[#d1d5db] hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {visibleDays.map((d) => {
          const isSelected = selectedDate === d.dateISO;

          return (
            <button
              key={d.dateISO}
              type="button"
              disabled={d.isPast}
              onClick={() => handleSelect(d.dateISO)}
              aria-pressed={isSelected}
              className={`py-2 px-1 rounded-xl text-center border transition flex flex-col items-center justify-between relative cursor-pointer ${
                isSelected
                  ? 'bg-[#c89b3c] border-[#c89b3c] text-[#0f1115] font-bold shadow-md shadow-[#c89b3c]/20'
                  : d.isPast
                  ? 'bg-white/[0.01] border-white/5 text-white/20 cursor-not-allowed opacity-30'
                  : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span
                className={`text-[9px] font-bold tracking-wider ${
                  isSelected ? 'text-[#0f1115]' : d.isPast ? 'text-white/20' : 'text-[#9ca3af]'
                }`}
              >
                {d.dayName}
              </span>

              <span
                className={`text-sm sm:text-base font-bold my-0.5 ${
                  isSelected ? 'text-[#0f1115]' : ''
                }`}
              >
                {d.dayNum}
              </span>

              {d.isToday ? (
                <span
                  className={`text-[8px] font-bold px-1 rounded ${
                    isSelected
                      ? 'bg-[#0f1115] text-[#c89b3c]'
                      : 'bg-[#c89b3c]/20 text-[#c89b3c]'
                  }`}
                >
                  Hari ini
                </span>
              ) : (
                <span className="w-1 h-1 rounded-full opacity-0">.</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
