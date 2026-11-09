'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowRight,
} from 'lucide-react';
import { SERVICES_DATA } from '@/data';
import { formatServicePrice } from '@/lib/format';
import type { ServiceCategory } from '@/types/barbershop';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

const ICON_MAP = {
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

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'haircut', label: 'Potong Rambut' },
  { id: 'color', label: 'Pewarnaan' },
  { id: 'others', label: 'Perm & Tekstur' },
];

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('haircut');

  const filteredServices = SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 bg-[#0f1115] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3 mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed]">
            Layanan & Tarif Cukur
          </h2>
          <p className="text-[#9ca3af] text-sm leading-relaxed">
            Daftar harga transparan di seluruh cabang Cahaya Barbershop Kuningan. Mulai dari pangkas harian, perawatan relaksasi, hingga pewarnaan dan perming modern.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#c89b3c] text-[#0f1115]'
                  : 'bg-white/5 hover:bg-white/10 text-[#9ca3af] hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, idx) => {
              const IconComp = ICON_MAP[service.iconName] || Scissors;

              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-[#c89b3c]/40 transition-colors bg-[#181b22] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-white/5 text-[#c89b3c] border border-white/10">
                        <IconComp size={20} />
                      </div>
                      {service.tag && (
                        <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#c89b3c] uppercase">
                          {service.tag}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#f1f1ed]">
                        {service.name}
                      </h3>
                      <p className="text-xs text-[#9ca3af] mt-1.5 leading-relaxed font-normal">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#9ca3af] block">Tarif</span>
                      <span className="text-base font-bold font-mono text-[#f1f1ed]">
                        {formatServicePrice(service)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectService(service.id)}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-[#c89b3c] hover:text-[#0f1115] text-[#f1f1ed] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <span>Pilih</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
