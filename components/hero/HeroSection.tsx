'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import WebGLHeroCanvas from './WebGLHeroCanvas';
import { SHOP_INFO } from '@/data';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[92svh] flex items-center pt-28 pb-16 lg:py-24 overflow-hidden bg-[#0f1115]"
    >
      <WebGLHeroCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#f1f1ed] leading-[1.15]">
            Potongan Rapi Presisi.{' '}
            <span className="text-[#c89b3c] block sm:inline">
              Karakter Wajah Tepat.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#9ca3af] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Layanan potong rambut dan perawatan pria di Kuningan dengan 3 cabang strategis (Manislor, Jagabaya, Jalaksana). Menghadirkan teknik pangkas presisi, konsultasi bentuk wajah, cuci rambut segar, hingga Korean Perm.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] font-bold rounded-xl text-xs tracking-wider transition-colors uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#c89b3c]/15"
            >
              <span>Pesan Jadwal Cukur</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#181b22] hover:bg-[#1f232c] text-[#f1f1ed] font-medium rounded-xl text-xs tracking-wider border border-white/10 hover:border-white/20 transition-colors uppercase cursor-pointer"
            >
              Lihat Layanan & Harga
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <div>
              <p className="font-serif text-2xl font-bold text-[#f1f1ed] flex items-center justify-center lg:justify-start gap-1">
                <span>5.0</span>
                <Star className="w-4 h-4 fill-[#c89b3c] text-[#c89b3c]" />
              </p>
              <p className="text-[11px] text-[#9ca3af] tracking-wider uppercase mt-0.5">
                Google Rating
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-[#f1f1ed]">3 Cabang</p>
              <p className="text-[11px] text-[#9ca3af] tracking-wider uppercase mt-0.5">
                Kuningan
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-[#f1f1ed]">100%</p>
              <p className="text-[11px] text-[#9ca3af] tracking-wider uppercase mt-0.5">
                Garansi Rapi
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="lg:col-span-5 relative flex justify-center items-center"
        >
          <div className="relative w-full max-w-md lg:max-w-none">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#181b22] p-2.5 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
                alt="Suasana Kursi Cahaya Barbershop"
                className="w-full h-[380px] sm:h-[440px] object-cover rounded-xl"
              />

              <div className="absolute bottom-5 left-5 right-5 bg-[#0f1115]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full p-[2px] bg-[#c89b3c]/20 border border-[#c89b3c]/40 shrink-0 flex items-center justify-center">
                    <img
                      src="/images/logo.png"
                      alt={SHOP_INFO.name}
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white tracking-wider">
                      Cahaya Barbershop
                    </p>
                    <p className="text-[10px] text-[#9ca3af]">
                      Manislor · Jagabaya · Jalaksana
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Buka Setiap Hari
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
