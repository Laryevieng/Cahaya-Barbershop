'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles, Crown, Award, ShieldCheck, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FEATURES_DATA } from '@/data';
import type { ShopFeature } from '@/types/barbershop';

const ICON_MAP: Record<ShopFeature['iconName'], LucideIcon> = {
  Scissors,
  Sparkles,
  Crown,
  Award,
  ShieldCheck,
  Clock,
};

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_DATA.map((feat, idx) => {
            const IconComp = ICON_MAP[feat.iconName] || Scissors;

            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, borderColor: 'rgba(30,94,255,0.4)' }}
                className="p-7 rounded-2xl bg-[#0a0a0e] border border-white/10 space-y-3.5 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              >
                <div className="p-3.5 w-fit rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400">
                  <IconComp size={24} />
                </div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
