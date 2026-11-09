'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Users, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BARBERS_DATA } from '@/data';

interface BarberCarouselProps {
  selectedBarberId: string;
  onSelect: (barberId: string) => void;
}

export default function BarberCarousel({
  selectedBarberId,
  onSelect,
}: BarberCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = 220;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d1d5db] block">
            2. Pilih Barber (7 Master Barbers)
          </label>
          <span className="text-[11px] text-[#9ca3af]">
            Pilih kapster pilihan atau bebas untuk ketersediaan tercepat
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            title="Geser ke kiri"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#d1d5db] hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            title="Geser ke kanan"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#d1d5db] hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory focus:outline-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          type="button"
          onClick={() => onSelect('any')}
          aria-pressed={selectedBarberId === 'any'}
          className={`snap-start shrink-0 w-[140px] sm:w-[150px] p-2.5 rounded-xl text-center border transition relative flex flex-col items-center justify-between cursor-pointer ${
            selectedBarberId === 'any'
              ? 'bg-[#c89b3c]/15 border-[#c89b3c]'
              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
          }`}
        >
          {selectedBarberId === 'any' && (
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#c89b3c] text-[#0f1115] flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}

          <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/80 my-1">
            <Users className="w-6 h-6 text-[#c89b3c]" />
          </div>

          <div className="mt-1">
            <h5 className="text-xs font-semibold text-white">Any Barber</h5>
            <p className="text-[10px] text-[#9ca3af] mt-0.5 line-clamp-2">
              Jadwal paling fleksibel
            </p>
          </div>
        </button>

        {BARBERS_DATA.map((barber) => {
          const isSelected = selectedBarberId === String(barber.id);

          return (
            <button
              key={barber.id}
              type="button"
              onClick={() => onSelect(String(barber.id))}
              aria-pressed={isSelected}
              className={`snap-start shrink-0 w-[140px] sm:w-[150px] p-2.5 rounded-xl text-center border transition relative flex flex-col items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#c89b3c]/15 border-[#c89b3c]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#c89b3c] text-[#0f1115] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              <div className="w-14 h-14 rounded-full overflow-hidden border border-white/15 my-1 relative shrink-0">
                <Image
                  src={barber.image}
                  alt={barber.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: barber.imagePosition || 'center top' }}
                />
              </div>

              <div className="mt-1 w-full">
                <div className="flex items-center justify-center gap-1">
                  <h5 className="text-xs font-semibold text-white truncate">
                    {barber.name}
                  </h5>
                  {barber.isFounder && (
                    <span className="text-[8px] font-bold text-[#c89b3c] uppercase">
                      ★
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#9ca3af] mt-0.5 truncate">
                  {barber.exp}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
