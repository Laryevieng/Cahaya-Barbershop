'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#0f1115] relative border-t border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group bg-[#181b22]">
              <img
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800"
                alt="Pangkas Rambut Teliti di Cahaya Barbershop"
                className="w-full h-[420px] object-cover filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-[#181b22]/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/10 shadow-xl max-w-xs">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-full p-[2px] bg-[#c89b3c]/20 border border-[#c89b3c]/40 flex items-center justify-center shrink-0">
                    <img
                      src="/images/logo.png"
                      alt="Logo Cahaya Barbershop"
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-serif font-black text-[#f1f1ed] leading-none">
                      10+ TAHUN
                    </p>
                    <p className="text-[10px] text-[#c89b3c] uppercase font-bold tracking-wider mt-1">
                      Jam Terbang Pangkas Rambut
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed] leading-tight">
              Dedikasi Kerapian & Kenyamanan Pria di Kuningan
            </h2>

            <p className="text-[#d1d5db] leading-relaxed text-sm sm:text-base font-normal">
              <strong className="text-white font-semibold">Cahaya Barbershop</strong> beroperasi untuk melayani pria yang menghargai ketelitian pangkas, komunikasi gaya yang jelas, dan tempat yang bersih. Dipimpin langsung oleh Master Barber Kang Yayat bersama tim kapster berpengalaman.
            </p>

            <p className="text-[#9ca3af] leading-relaxed text-sm">
              Kami melayani pangkas harian, cuci rambut dengan pijat leher segar, perapian jenggot dengan razor steril, hingga layanan modern seperti Korean Perm, Down Perm, dan Fashion Color di 3 cabang aktif: Manislor, Jagabaya, dan Jalaksana.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-[#181b22] border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c89b3c] mb-2.5">
                  <Scissors size={18} />
                </div>
                <h3 className="font-bold text-white text-sm">Ketelitian Bentuk Kepala</h3>
                <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                  Garis tepi dan lekuk fade disesuaikan dengan proporsi wajah agar potongan tetap rapi saat rambut bertumbuh.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#181b22] border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c89b3c] mb-2.5">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-bold text-white text-sm">Kenyamanan Perawatan</h3>
                <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">
                  Ruang ber-AC sejuk, kursi empuk ergonomis, dan air bersih untuk keramas santai setelah pangkas.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
