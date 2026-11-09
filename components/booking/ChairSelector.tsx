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
      <div className="p-3.5 rounded-2xl bg-[#c89b3c]/10 border border-[#c89b3c]/20 text-xs space-y-1">
        <div className="flex items-center gap-2 text-[#c89b3c] font-semibold">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Layanan Fleksibel / Konsultasi Acara</span>
        </div>
        <p className="text-[#9ca3af] text-[11px] leading-relaxed">
          Layanan ini tidak memerlukan reservasi kursi fisik di cabang. Jadwal dan lokasi akan dikoordinasikan langsung melalui WhatsApp.
        </p>
      </div>
    );
  }

  const branchChairs = [
    { id: `${branchId}-chair-1`, label: 'Kursi 1' },
    { id: `${branchId}-chair-2`, label: 'Kursi 2' },
    { id: `${branchId}-chair-3`, label: 'Kursi 3' },
  ];

  const currentSlot = availability?.slots?.find((s) => s.time === selectedTime);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#d1d5db] flex items-center gap-1.5">
          <Armchair className="w-3.5 h-3.5 text-[#c89b3c]" />
          <span>Pilih Kursi (3 Kursi)</span>
        </label>
        <span className="text-[10px] text-[#9ca3af]">
          Pilih salah satu kursi
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
                  ? 'bg-[#c89b3c]/15 border-[#c89b3c] shadow-md shadow-black/30'
                  : !isAvailable
                  ? 'bg-white/[0.01] border-white/5 opacity-35 cursor-not-allowed'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#c89b3c] text-[#0f1115] flex items-center justify-center font-bold">
                  <Check className="w-2 h-2 stroke-[3]" />
                </div>
              )}

              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center my-1 transition ${
                  isSelected
                    ? 'bg-[#c89b3c] text-[#0f1115]'
                    : isAvailable
                    ? 'bg-white/10 text-white/80'
                    : 'bg-white/5 text-white/20'
                }`}
              >
                <Armchair className="w-4 h-4" />
              </div>

              <div>
                <span className="text-xs font-bold text-white block">
                  {chair.label}
                </span>
                <span
                  className={`text-[9px] font-medium block mt-0.5 ${
                    isSelected
                      ? 'text-[#c89b3c]'
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
