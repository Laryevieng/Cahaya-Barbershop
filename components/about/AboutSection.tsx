'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-28 bg-[#0a0a0d] relative border-t border-b border-white/5 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              <img
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800"
                alt="Cahaya Barbershop Craftsmanship"
                className="w-full h-[460px] object-cover filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

              {/* Floating Experience Counter */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute bottom-6 left-6 right-6 sm:right-auto bg-black/85 backdrop-blur-xl p-5 sm:p-6 rounded-xl border border-white/20 shadow-2xl max-w-xs"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg flex items-center justify-center shrink-0">
                    <img
                      src="/images/logo.png"
                      alt="Cahaya Barbershop Logo"
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  </div>
                  <div>
                    <p className="text-3xl font-serif font-black text-white leading-none">5+ TAHUN</p>
                    <p className="text-[11px] text-blue-400 uppercase font-bold tracking-widest mt-1">
                      KUALITAS TERBAIK DI KUNINGAN
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase">
              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span>TENTANG CAHAYA BARBERSHOP</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Lebih Dari Sekadar <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-blue-200">
                Potong Rambut.
              </span>
            </h2>

            <p className="text-gray-300 leading-relaxed font-light text-base">
              <strong className="text-white font-semibold">CAHAYA BARBERSHOP</strong> hadir untuk pria yang mengutamakan kerapian, gaya modern, dan kenyamanan maksimal. Dikelola oleh Master Barber Kang Yayat bersama tim barber berbakat.
            </p>

            <p className="text-gray-400 leading-relaxed font-light text-sm">
              Kami melayani berbagai kebutuhan grooming mulai dari potongan rambut presisi (Cukur Saja, Cukur + Cuci, Cukur + Cuci + Pijit, hingga Cukur by Yayat), perawatan modern seperti Korean Perm, Down Perm, Hairlight, Fashion Coloring, hingga layanan Cukur Panggilan ke tempat Anda dan Hairdo Wedding.
            </p>

            {/* Value Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                  <Scissors size={20} />
                </div>
                <h3 className="font-bold text-white text-sm">Master Barber Yayat</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Cukur presisi dengan sentuhan berpengalaman sesuai lekuk kepala & karakter wajah.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-bold text-white text-sm">Layanan Lengkap & Nyaman</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Hair color, korean perm, cuci + pijit rileks, hingga cukur panggilan ke lokasi Anda.
                </p>
              </motion.div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
