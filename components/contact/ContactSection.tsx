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
  Building2
} from 'lucide-react';
import { BRANCHES_DATA, SHOP_INFO } from '@/data';
import { Branch } from '@/types/barbershop';

export default function ContactSection() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES_DATA[0]);

  return (
    <section id="contact" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-14"
        >
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase">
            <Building2 size={13} />
            <span>3 CABANG STRATEGIS DI KUNINGAN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Lokasi & Jam Buka Cabang
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-light">
            Cahaya Barbershop siap melayani Anda di 3 cabang resmi: <strong className="text-white">Manislor (Cabang Utama)</strong>, <strong className="text-white">Jagabaya</strong>, dan <strong className="text-white">Jalaksana</strong>.
          </p>
        </motion.div>

        {/* Branch Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {BRANCHES_DATA.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all uppercase flex items-center space-x-2 cursor-pointer ${
                selectedBranch.id === branch.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(30,94,255,0.5)] border border-blue-400/50 scale-105'
                  : 'bg-[#0c0c12] hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <MapPin size={14} className={selectedBranch.id === branch.id ? 'text-white' : 'text-blue-400'} />
              <span>{branch.name}</span>
              {branch.isMain && (
                <span className="text-[9px] bg-amber-400 text-black font-extrabold px-1.5 py-0.5 rounded-full ml-1">
                  UTAMA
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Interactive Main Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Active Branch Detail Card */}
          <motion.div
            key={selectedBranch.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 bg-[#0c0c14] rounded-3xl p-8 sm:p-10 border border-white/10 space-y-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-400 uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30">
                  {selectedBranch.tag}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>BUKA SETIAP HARI</span>
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-3">
                {selectedBranch.name}
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-300">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">Alamat Lengkap</span>
                  <span className="text-gray-300 leading-relaxed block mt-0.5">{selectedBranch.address}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">Jam Operasional</span>
                  <span className="text-gray-300 block mt-0.5">{selectedBranch.hours}</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">Walk-in & Booking via WhatsApp</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">Kontak Reservasi</span>
                  <span className="text-gray-300 block mt-0.5">{SHOP_INFO.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${SHOP_INFO.whatsapp}?text=Halo%20CAHAYA%20BARBERSHOP,%20saya%20ingin%20tanya%20jadwal%20di%20${encodeURIComponent(selectedBranch.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <MessageSquare size={16} />
                <span>CHAT WHATSAPP</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={selectedBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all border border-blue-400/40 shadow-lg"
              >
                <ExternalLink size={16} />
                <span>BUKA GOOGLE MAPS</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Interactive Map Frame */}
          <motion.div
            key={`map-${selectedBranch.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 bg-[#0c0c12] rounded-3xl overflow-hidden border border-white/10 relative flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] min-h-[380px]"
          >
            <iframe
              title={`Google Maps ${selectedBranch.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedBranch.embedQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[360px] border-0 filter grayscale invert contrast-125 opacity-75 flex-1"
              loading="lazy"
            />

            <div className="absolute bottom-5 left-5 right-5 bg-black/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs font-bold text-white uppercase">{selectedBranch.name}</p>
                  <p className="text-[10px] text-gray-400">{selectedBranch.address}</p>
                </div>
              </div>

              <a
                href={selectedBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center space-x-1"
              >
                <span>PETUNJUK ARAH</span>
                <Navigation size={12} />
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
