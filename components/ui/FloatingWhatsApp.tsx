'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { SHOP_INFO } from '@/data';

export default function FloatingWhatsApp() {
  const waUrl = `https://wa.me/${SHOP_INFO.whatsapp}?text=Halo%20CAHAYA%20BARBERSHOP,%20saya%20ingin%20tanya%20mengenai%20layanan%20barbershop.`;

  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 bg-black/85 hover:bg-black backdrop-blur-xl border border-emerald-500/50 p-2 pr-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="bg-emerald-500 text-white p-2.5 rounded-full relative shadow-md">
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></span>
        <MessageSquare size={18} />
      </div>
      <div className="hidden sm:block text-left">
        <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
          Need Assistance?
        </span>
        <span className="block text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
          Chat WhatsApp
        </span>
      </div>
    </motion.a>
  );
}
