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
  Clock,
  ChevronRight,
  Palette,
  Waves,
  Zap
} from 'lucide-react';
import { SERVICES_DATA } from '@/data';
import { formatServicePrice } from '@/lib/format';
import { ServiceCategory } from '@/types/barbershop';

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
  { id: 'haircut', label: 'HAIRCUT' },
  { id: 'color', label: 'HAIR COLOR' },
  { id: 'others', label: 'PERM & OTHER' },
];

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('haircut');

  const filteredServices = SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Background Lighting Accent */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-12"
        >
          <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-400 uppercase">
            PRICELIST & SERVICES
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Layanan & Daftar Harga
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-light">
            Daftar harga lengkap Cahaya Barbershop. Pilih layanan terbaik mulai dari potong rambut, pewarnaan trendi, hingga Korean Perm.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all uppercase ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(30,94,255,0.5)] border border-blue-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service, idx) => {
              const IconComp = ICON_MAP[service.iconName] || Scissors;

              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-[#0c0c10] rounded-2xl p-7 sm:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(30,94,255,0.25)] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-400 transition-all duration-300">
                        <IconComp size={22} />
                      </div>
                      {service.tag && (
                        <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-300 uppercase">
                          {service.tag}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">
                        {service.category === 'haircut' ? 'HAIRCUT' : service.category === 'color' ? 'HAIR COLOR' : 'PERM & OTHERS'}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-xs leading-relaxed font-light">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="block text-lg sm:text-xl font-serif font-black text-white tracking-wide">
                        {formatServicePrice(service)}
                      </span>
                      {service.time && (
                        <span className="text-[11px] text-gray-400 flex items-center space-x-1 mt-0.5">
                          <Clock size={12} className="text-blue-400" />
                          <span>{service.time}</span>
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectService(service.id)}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold rounded-lg border border-blue-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span>BOOK</span>
                      <ChevronRight size={14} />
                    </motion.button>
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
