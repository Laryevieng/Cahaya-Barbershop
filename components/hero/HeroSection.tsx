'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import WebGLHeroCanvas from './WebGLHeroCanvas';
import { SHOP_INFO } from '@/data';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-[#050505]">
      {/* Procedural WebGL Background Shader */}
      <WebGLHeroCanvas />

      {/* Oversized Brand Watermark Background */}
      <div className="absolute -left-12 bottom-8 pointer-events-none opacity-[0.035] select-none hidden lg:block">
        <h1 className="font-serif text-[180px] font-black tracking-tighter leading-none text-white">
          CAHAYA
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left pt-6 lg:pt-0"
        >
          {/* Micro Pill Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(30,94,255,0.25)]"
          >
            <div className="w-5 h-5 rounded-full p-[1px] bg-gradient-to-tr from-blue-500 to-indigo-400 overflow-hidden shrink-0">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
              CAHAYA BARBERSHOP • KUNINGAN
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-serif font-black tracking-tight text-white leading-[1.1] sm:leading-[1.08] break-words"
          >
            LOOK SHARP. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 text-glow">
              FEEL CONFIDENT.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
          >
            {SHOP_INFO.description}
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(30,94,255,0.6)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#123C8C] via-[#1E5EFF] to-blue-600 text-white font-bold rounded-lg text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(30,94,255,0.4)] transition-all uppercase flex items-center justify-center space-x-2 border border-blue-400/40 group cursor-pointer"
            >
              <span>BOOK YOUR STOPOVER</span>
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto px-8 py-4 bg-black/40 text-white font-semibold rounded-lg text-xs tracking-[0.2em] border border-white/20 transition-all uppercase backdrop-blur-sm hover:border-white/40 cursor-pointer"
            >
              LIHAT DAFTAR HARGA
            </motion.button>
          </motion.div>

          {/* Trust Metric Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left"
          >
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center justify-center lg:justify-start space-x-1">
                <span>5.0</span>
                <span className="text-amber-400 text-xl">★</span>
              </p>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">Google Rating</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white">1,500+</p>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">Pelanggan Puas</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white">100%</p>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">Garansi Rapi</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Hero Visual Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className="lg:col-span-5 relative flex justify-center items-center"
        >
          {/* Radial Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/25 via-blue-900/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

          {/* Main Visual Frame */}
          <div className="relative w-full max-w-md lg:max-w-none group">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-gray-900/90 to-black p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
              
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
                alt="CAHAYA BARBERSHOP Modern Barber Chair"
                className="w-full h-[420px] sm:h-[480px] object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none rounded-xl"></div>

              {/* Interactive Center 3D Floating Badge */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('booking')}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-gradient-to-r from-[#123C8C] via-[#1E5EFF] to-[#123C8C] p-0.5 rounded-xl shadow-[0_0_40px_rgba(30,94,255,0.85)] border border-blue-400/60 transition-all duration-300 group/btn z-20 whitespace-nowrap"
              >
                <div className="bg-black/85 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-4 rounded-[10px] text-center border border-blue-500/30">
                  <span className="block text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] text-blue-300 uppercase">
                    RESERVE YOUR CHAIR
                  </span>
                  <span className="block text-base sm:text-xl font-serif font-bold text-white mt-0.5 group-hover/btn:text-blue-300 transition-colors">
                    Cahaya Barbershop
                  </span>
                </div>
              </motion.div>

              {/* Bottom Chair Badge Info */}
              <div className="absolute bottom-5 left-5 right-5 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-white/15 flex items-center justify-between z-20 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shrink-0">
                    <img
                      src="/images/logo.png"
                      alt="CAHAYA BARBERSHOP"
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">CAHAYA BARBERSHOP</p>
                    <p className="text-[10px] text-gray-400">Comfort • Precision • Style</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>OPEN NOW</span>
                </span>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
