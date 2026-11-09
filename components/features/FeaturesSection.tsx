'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, ShieldCheck, Armchair, Sparkles } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-[#0f1115] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed]">
            Standar Pelayanan di Setiap Kursi
          </h2>
          <p className="text-[#9ca3af] text-sm mt-2 leading-relaxed">
            Komitmen kami pada kebersihan alat, ketelitian teknik pangkas, dan kepastian jadwal bagi setiap pelanggan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-2xl bg-[#181b22] border border-white/10 p-7 sm:p-9 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#c89b3c]/10 text-[#c89b3c] border border-[#c89b3c]/20 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f1f1ed]">
                Pangkas Presisi & Konsultasi Proporsi Wajah
              </h3>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Sebelum gunting bekerja, barber kami berdiskusi mengenai arah tumbuh rambut, bentuk kepala, dan gaya yang Anda inginkan. Setiap transisi fade dan garis tepi dikerjakan teliti untuk hasil rapi yang tahan berminggu-minggu.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-4 text-xs text-[#d1d5db]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c89b3c]" />
                Finishing razor tajam & steril
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c89b3c]" />
                Pijatan leher & pundak rileks
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#181b22] border border-white/10 p-7 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#c89b3c]/10 text-[#c89b3c] border border-[#c89b3c]/20 flex items-center justify-center">
                <Armchair className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f1f1ed]">
                Kapasitas 3 Kursi per Cabang
              </h3>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Di Manislor, Jagabaya, dan Jalaksana, kami menyediakan tepat 3 kursi fisik dengan alokasi waktu jelas. Sistem reservasi memastikan Anda datang langsung dilayani tanpa membuang waktu dalam antrean panjang.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5 text-xs text-[#c89b3c] font-medium">
              3 Cabang Aktif di Kuningan
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#181b22] border border-white/10 p-7 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#c89b3c]/10 text-[#c89b3c] border border-[#c89b3c]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f1f1ed]">
                Korean Perm & Down Perm
              </h3>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Solusi untuk rambut samping yang jabrik dan kaku, atau menambah volume ikal natural gaya Korea. Dikerjakan dengan obat perming berkualitas yang menjaga kelembutan batang rambut.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5 text-xs text-[#9ca3af]">
              Perawatan mudah, siap tampil rapi setiap hari
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-[#181b22] border border-white/10 p-7 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#c89b3c]/10 text-[#c89b3c] border border-[#c89b3c]/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f1f1ed]">
                Kebersihan & Sanitasi Terjaga
              </h3>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                Pisau silet selalu baru untuk setiap pelanggan. Mata clipper, gunting, dan sisir disterilkan secara berkala. Handuk bersih dan cape pangkas dicuci higienis demi kenyamanan Anda selama perawatan.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5 text-xs text-[#9ca3af]">
              Higienitas alat adalah prioritas dasar di setiap sesi pangkas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
