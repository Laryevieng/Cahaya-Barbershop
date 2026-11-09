'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRICING_PACKAGES } from '@/data';
import { formatRupiah } from '@/lib/format';

interface PricingSectionProps {
  onSelectPackage: (serviceId: string) => void;
}

export default function PricingSection({ onSelectPackage }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 bg-[#0f1115] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed]">
            Paket Perawatan Populer
          </h2>
          <p className="text-[#9ca3af] text-sm leading-relaxed">
            Pilihan paket kombinasi di Cahaya Barbershop untuk perawatan menyeluruh, bersih, dan rapi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-colors bg-[#181b22] border ${
                pkg.highlighted
                  ? 'border-[#c89b3c]/60 shadow-lg shadow-black/40'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-xl font-bold text-[#f1f1ed] tracking-wide">
                    {pkg.name}
                  </h3>
                  {pkg.popularBadge && (
                    <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#c89b3c]/15 text-[#c89b3c] border border-[#c89b3c]/30 uppercase">
                      {pkg.popularBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#9ca3af] mt-1">{pkg.subtitle}</p>

                <div className="my-5 pb-5 border-b border-white/10">
                  <span className="text-3xl font-serif font-bold text-[#f1f1ed]">
                    {formatRupiah(pkg.priceIdr)}
                  </span>
                  <span className="text-xs text-[#9ca3af] block mt-1">per sesi perawatan</span>
                </div>

                <ul className="space-y-3 my-5">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#d1d5db] leading-snug">
                      <div className="w-4 h-4 rounded-full bg-[#c89b3c]/15 text-[#c89b3c] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectPackage(pkg.serviceId)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors mt-6 cursor-pointer ${
                  pkg.highlighted
                    ? 'bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] shadow-md shadow-[#c89b3c]/10'
                    : 'bg-white/5 hover:bg-white/10 text-[#f1f1ed] border border-white/10'
                }`}
              >
                Pilih Paket Ini
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
