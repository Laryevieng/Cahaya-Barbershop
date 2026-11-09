'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { SHOP_INFO } from '@/data';

export default function FloatingWhatsApp() {
  const waUrl = `https://wa.me/${SHOP_INFO.whatsapp}?text=Halo%20CAHAYA%20BARBERSHOP,%20saya%20ingin%20tanya%20mengenai%20layanan%20barbershop.`;

  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 bg-[#181b22]/95 backdrop-blur-md border border-emerald-500/30 p-2 pr-4 rounded-full shadow-lg transition-colors group hover:border-emerald-400"
      aria-label="Hubungi kami melalui WhatsApp"
    >
      <div className="bg-emerald-600 text-white p-2 rounded-full shrink-0 shadow-sm">
        <MessageSquare size={17} />
      </div>
      <div className="hidden sm:block text-left">
        <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
          Butuh Bantuan?
        </span>
        <span className="block text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
          Chat WhatsApp
        </span>
      </div>
    </motion.a>
  );
}
