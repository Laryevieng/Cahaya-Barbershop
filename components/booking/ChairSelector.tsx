'use client';

import React from 'react';
import { Armchair, Check, AlertCircle, Sparkles } from 'lucide-react';
import type { AvailabilityResponse, BookingMode } from '@/types/barbershop';

interface ChairSelectorProps {
  branchId: string;
  selectedChairId: string | null;
  selectedTime: string;
  mode: BookingMode;
  availability: AvailabilityResponse | null;
  onSelectChair: (chairId: string) => void;
}

export default function ChairSelector({
  branchId,
  selectedChairId,
  selectedTime,
  mode,
  availability,
  onSelectChair,
}: ChairSelectorProps) {
  if (mode === 'consultation') {
    return (
      <div className="p-3.5 rounded-2xl bg-[#1e5eff]/10 border border-[#1e5eff]/20 text-xs space-y-1">
        <div className="flex items-center gap-2 text-[#1e5eff] font-semibold">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Layanan Fleksibel / Konsultasi Event</span>
        </div>
        <p className="text-white/60 text-[11px] leading-relaxed">
          Layanan ini tidak memerlukan reservasi kursi fisik di cabang. Jadwal dan lokasi akan dikoordinasikan langsung melalui WhatsApp.
        </p>
      </div>
    );
  }

  // Get chairs for current branch
  const branchChairs = [
    { id: `${branchId}-chair-1`, label: 'Kursi 1' },
    { id: `${branchId}-chair-2`, label: 'Kursi 2' },
    { id: `${branchId}-chair-3`, label: 'Kursi 3' },
  ];

  const currentSlot = availability?.slots?.find((s) => s.time === selectedTime);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block flex items-center gap-1.5">
          <Armchair className="w-3.5 h-3.5 text-[#1e5eff]" />
          <span>Pilih Kursi (3 Kursi Tersedia)</span>
        </label>
        <span className="text-[10px] text-white/40">
          Pilih manual salah satu kursi
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {branchChairs.map((chair) => {
          const chairStatus = currentSlot?.chairs?.find((c) => c.id === chair.id);
          const isAvailable = currentSlot ? chairStatus?.available ?? true : true;
          const isSelected = selectedChairId === chair.id;

          return (
            <button
              key={chair.id}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectChair(chair.id)}
              aria-pressed={isSelected}
              className={`p-3 rounded-xl border text-center transition relative flex flex-col items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#1e5eff]/15 border-[#1e5eff] shadow-lg shadow-[#1e5eff]/20'
                  : !isAvailable
                  ? 'bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#1e5eff] text-white flex items-center justify-center">
                  <Check className="w-2 h-2 stroke-[3]" />
                </div>
              )}

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center my-1 transition ${
                  isSelected
                    ? 'bg-[#1e5eff] text-white'
                    : isAvailable
                    ? 'bg-white/10 text-white/80'
                    : 'bg-white/5 text-white/20'
                }`}
              >
                <Armchair className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-bold text-white block">
                  {chair.label}
                </span>
                <span
                  className={`text-[9px] font-medium block mt-0.5 ${
                    isSelected
                      ? 'text-[#82aaff]'
                      : isAvailable
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {isSelected ? 'Terpilih' : isAvailable ? 'Tersedia' : 'Terisi'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {!selectedChairId && (
        <p className="text-[11px] text-amber-300/80 flex items-center gap-1.5 pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Silakan klik salah satu kursi di atas untuk melanjutkan pemesanan.</span>
        </p>
      )}
    </div>
  );
}
