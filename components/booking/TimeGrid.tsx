'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { TIME_SLOTS } from '@/data';
import type { AvailabilityResponse } from '@/types/barbershop';

interface TimeGridProps {
  selectedTime: string;
  availability: AvailabilityResponse | null;
  loading: boolean;
  onSelectTime: (time: string) => void;
}

export default function TimeGrid({
  selectedTime,
  availability,
  loading,
  onSelectTime,
}: TimeGridProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#1e5eff]" />
          <span>Pilih Jam Kunjungan</span>
        </label>
        {loading && (
          <span className="text-[10px] text-white/40 flex items-center gap-1">
            <span className="w-2.5 h-2.5 border border-white/40 border-t-transparent rounded-full animate-spin" />
            Mengecek ketersediaan...
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
        {TIME_SLOTS.map((time) => {
          const slot = availability?.slots?.find((s) => s.time === time);
          const isSelected = selectedTime === time;

          // When loading without previous data, allow neutral click or disable?
          // If availability data is loaded, respect slot.available
          const isAvailable = availability ? slot?.available ?? true : true;
          const reason = slot?.reason;

          let reasonBadge = '';
          if (!isAvailable) {
            if (reason === 'past') reasonBadge = 'Lewat';
            else if (reason === 'outside_hours') reasonBadge = 'Tutup';
            else if (reason === 'barber_busy') reasonBadge = 'Sibuk';
            else if (reason === 'full') reasonBadge = 'Penuh';
            else reasonBadge = 'Penuh';
          }

          return (
            <button
              key={time}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectTime(time)}
              aria-pressed={isSelected}
              className={`py-2 px-1 rounded-xl text-center border font-mono transition relative cursor-pointer ${
                isSelected
                  ? 'bg-[#1e5eff] border-[#1e5eff] text-white font-bold shadow-md shadow-[#1e5eff]/30'
                  : !isAvailable
                  ? 'bg-white/[0.01] border-white/5 text-white/20 cursor-not-allowed opacity-40'
                  : 'bg-white/[0.03] border-white/10 text-white/80 hover:border-white/30 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <div className="text-xs font-semibold">{time}</div>
              {reasonBadge ? (
                <div className="text-[8px] font-sans text-white/30 leading-none mt-0.5">
                  {reasonBadge}
                </div>
              ) : (
                <div className="text-[8px] font-sans opacity-0 leading-none mt-0.5">
                  .
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
