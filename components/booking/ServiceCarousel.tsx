'use client';

import React, { useRef } from 'react';
import {
  Scissors,
  Sparkles,
  Crown,
  Flame,
  ShieldCheck,
  Award,
  Palette,
  Waves,
  Zap,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  type LucideIcon,
} from 'lucide-react';
import { SERVICES_DATA } from '@/data';
import { formatServicePrice } from '@/lib/format';
import type { ServiceIconName, ServiceSelection } from '@/types/barbershop';

const SERVICE_ICONS: Record<ServiceIconName, LucideIcon> = {
  Scissors,
  Sparkles,
  Crown,
  Flame,
  ShieldCheck,
  Award,
  Palette,
  Waves,
  Zap,
};

interface ServiceCarouselProps {
  selectedService: ServiceSelection;
  onSelect: (selection: ServiceSelection) => void;
}

export default function ServiceCarousel({
  selectedService,
  onSelect,
}: ServiceCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const distance = 260;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const isCustom = selectedService.kind === 'custom';
  const selectedId = selectedService.kind === 'catalog' ? selectedService.id : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            1. Pilih Layanan (14 Pilihan)
          </label>
          <span className="text-[11px] text-white/40">
            Geser untuk melihat menu potong, warna, dan perming
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            title="Geser ke kiri"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            title="Geser ke kanan"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Special banner if custom look from gallery is selected */}
      {isCustom && (
        <div className="p-3 rounded-xl bg-[#1e5eff]/10 border border-[#1e5eff]/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1e5eff] shrink-0" />
            <div>
              <span className="text-[10px] font-semibold text-[#1e5eff] uppercase tracking-wider block">
                Look Terpilih Dari Galeri
              </span>
              <span className="text-white font-medium">{selectedService.label}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect({ kind: 'catalog', id: 'cukur-cuci-pijit' })}
            className="text-[11px] text-white/60 hover:text-white underline cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Pilih Menu Standar</span>
          </button>
        </div>
      )}

      {/* 14 Services Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory focus:outline-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SERVICES_DATA.map((service) => {
          const IconComponent = SERVICE_ICONS[service.iconName] || Scissors;
          const isSelected = !isCustom && selectedId === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect({ kind: 'catalog', id: service.id })}
              aria-pressed={isSelected}
              className={`snap-start shrink-0 w-[185px] sm:w-[195px] p-3 rounded-xl text-left border transition relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#1e5eff]/15 border-[#1e5eff] shadow-lg shadow-[#1e5eff]/15'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#1e5eff] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#1e5eff] text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  {service.tag && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                        isSelected
                          ? 'bg-[#1e5eff]/30 text-[#82aaff]'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {service.tag}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                    {service.name}
                  </h4>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {service.time || `${service.durationMinutes} menit`}
                  </p>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-white/5">
                <span className="text-xs font-mono font-bold text-white">
                  {formatServicePrice(service)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
