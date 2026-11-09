'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Crown, Zap } from 'lucide-react';
import { PRICING_PACKAGES } from '@/data';
import { formatRupiah } from '@/lib/format';

interface PricingSectionProps {
  onSelectPackage: (serviceId: string) => void;
}

export default function PricingSection({ onSelectPackage }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-28 bg-[#0a0a0d] border-t border-b border-white/5 relative overflow-hidden">
      {/* Radial Blue Light Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase">
            <Crown size={13} />
            <span>PAKET GROOMING FAVORIT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Paket Perawatan Populer
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Pilihan paket kombinasi terbaik di Cahaya Barbershop untuk kesegaran dan kerapian optimal.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-2xl p-8 sm:p-9 flex flex-col justify-between transition-all duration-500 ${
                pkg.highlighted
                  ? 'bg-gradient-to-b from-[#0e1d3d] via-[#091224] to-[#050a14] border-2 border-blue-500 shadow-[0_0_50px_rgba(30,94,255,0.35)] md:-translate-y-4 z-20'
                  : 'bg-[#0c0c10] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popularBadge && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-[0_0_20px_rgba(30,94,255,0.6)] flex items-center space-x-1.5">
                  <Sparkles size={12} />
                  <span>{pkg.popularBadge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-white tracking-wide">{pkg.name}</h3>
                  {pkg.highlighted && (
                    <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                      <Zap size={18} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{pkg.subtitle}</p>

                <div className="my-6 pb-6 border-b border-white/10">
                  <span className="text-3xl sm:text-4xl font-serif font-black text-white">{formatRupiah(pkg.priceIdr)}</span>
                  <span className="text-xs text-gray-400 block mt-1">/ sesi perawatan</span>
                </div>

                <ul className="space-y-3.5 my-6">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-300 leading-snug">
                      <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPackage(pkg.serviceId)}
                className={`w-full py-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all mt-6 cursor-pointer ${
                  pkg.highlighted
                    ? 'bg-gradient-to-r from-[#123C8C] via-[#1E5EFF] to-blue-600 hover:shadow-[0_0_30px_rgba(30,94,255,0.6)] text-white shadow-lg border border-blue-400/40'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                PILIH PAKET INI
              </motion.button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
