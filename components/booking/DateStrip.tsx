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

  // Generate all days in the current month
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

  // Track user manual window navigation; if null, derive window from selectedDate
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
      {/* Month Header & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#1e5eff]" />
          <span className="text-xs font-bold text-white capitalize">
            {monthLabel}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1e5eff]/15 text-[#1e5eff] border border-[#1e5eff]/25">
            Bulan Ini Saja
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            title="Minggu sebelumnya"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            title="Minggu berikutnya"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Visible Days Strip */}
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
                  ? 'bg-[#1e5eff] border-[#1e5eff] text-white shadow-lg shadow-[#1e5eff]/30'
                  : d.isPast
                  ? 'bg-white/[0.01] border-white/5 text-white/20 cursor-not-allowed opacity-40'
                  : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/30 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span
                className={`text-[9px] font-bold tracking-wider ${
                  isSelected ? 'text-white/90' : d.isPast ? 'text-white/20' : 'text-white/50'
                }`}
              >
                {d.dayName}
              </span>

              <span
                className={`text-sm sm:text-base font-bold my-0.5 ${
                  isSelected ? 'text-white' : ''
                }`}
              >
                {d.dayNum}
              </span>

              {d.isToday ? (
                <span
                  className={`text-[8px] font-bold px-1 rounded-full ${
                    isSelected
                      ? 'bg-white text-[#1e5eff]'
                      : 'bg-[#1e5eff]/20 text-[#1e5eff]'
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
