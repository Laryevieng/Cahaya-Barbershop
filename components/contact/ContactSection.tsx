'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { BRANCHES_DATA, SHOP_INFO } from '@/data';
import type { Branch } from '@/types/barbershop';

export default function ContactSection() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES_DATA[0]);

  return (
    <section id="contact" className="py-24 bg-[#0f1115] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed]">
            Lokasi 3 Cabang di Kuningan
          </h2>
          <p className="text-[#9ca3af] text-sm leading-relaxed">
            Kunjungi cabang terdekat Anda di Manislor (Cabang Utama), Jagabaya, atau Jalaksana. Buka setiap hari dengan alokasi 3 kursi per cabang.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {BRANCHES_DATA.map((branch) => {
            const isSelected = selectedBranch.id === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranch(branch)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-colors uppercase flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#c89b3c] text-[#0f1115] font-bold shadow-md shadow-[#c89b3c]/15'
                    : 'bg-[#181b22] text-[#9ca3af] hover:text-white border border-white/10'
                }`}
              >
                <MapPin size={14} className={isSelected ? 'text-[#0f1115]' : 'text-[#c89b3c]'} />
                <span>{branch.name}</span>
                {branch.isMain && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-[#0f1115] text-[#c89b3c]' : 'bg-[#c89b3c]/20 text-[#c89b3c]'
                  }`}>
                    UTAMA
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div
            key={selectedBranch.id}
            className="lg:col-span-5 bg-[#181b22] rounded-2xl p-7 sm:p-8 border border-white/10 space-y-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#c89b3c] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#c89b3c]/10 border border-[#c89b3c]/20">
                  {selectedBranch.tag}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Buka Setiap Hari
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#f1f1ed] mt-3">
                {selectedBranch.name}
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#d1d5db]">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#c89b3c] shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="font-semibold text-white block">Alamat Lengkap</span>
                  <span className="text-[#9ca3af] leading-relaxed block mt-0.5">{selectedBranch.address}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#c89b3c] shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-semibold text-white block">Jam Operasional</span>
                  <span className="text-[#9ca3af] block mt-0.5">{selectedBranch.hours}</span>
                  <span className="text-[11px] text-[#9ca3af]/70 block mt-0.5">Walk-in & Reservasi Online</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#c89b3c] shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="font-semibold text-white block">Kontak Cabang</span>
                  <span className="text-[#9ca3af] block mt-0.5">{SHOP_INFO.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
              <a
                href={`https://wa.me/${SHOP_INFO.whatsapp}?text=Halo%20CAHAYA%20BARBERSHOP,%20saya%20ingin%20tanya%20jadwal%20di%20${encodeURIComponent(selectedBranch.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>Chat WhatsApp</span>
              </a>

              <a
                href={selectedBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-[#f1f1ed] rounded-xl text-center text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors border border-white/10 cursor-pointer"
              >
                <ExternalLink size={15} />
                <span>Buka Google Maps</span>
              </a>
            </div>
          </div>

          <div
            key={`map-${selectedBranch.id}`}
            className="lg:col-span-7 bg-[#181b22] rounded-2xl overflow-hidden border border-white/10 relative flex flex-col min-h-[360px]"
          >
            <iframe
              title={`Peta Lokasi ${selectedBranch.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedBranch.embedQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[340px] border-0 filter grayscale invert contrast-125 opacity-70 flex-1"
              loading="lazy"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-[#0f1115]/95 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white uppercase">{selectedBranch.name}</p>
                <p className="text-[10px] text-[#9ca3af]">{selectedBranch.address}</p>
              </div>

              <a
                href={selectedBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center space-x-1 cursor-pointer"
              >
                <span>Petunjuk Arah</span>
                <Navigation size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
