'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import type { GalleryItem } from '@/types/barbershop';

interface GalleryModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onBookLook: (title: string) => void;
}

export default function GalleryModal({ item, onClose, onBookLook }: GalleryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative max-w-3xl w-full bg-[#181b22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 my-auto"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 p-2 bg-[#0f1115]/80 rounded-full text-white hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
            aria-label="Tutup jendela"
          >
            <X size={18} />
          </button>

          <div className="relative bg-[#0f1115] flex items-center justify-center max-h-[65vh] overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-auto max-h-[65vh] object-contain"
            />
          </div>

          <div className="p-5 sm:p-6 bg-[#181b22] border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-[#9ca3af] mt-1 max-w-md">{item.description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onBookLook(item.title)}
              className="w-full sm:w-auto px-5 py-3 bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-md shadow-[#c89b3c]/15"
            >
              <Calendar size={14} />
              <span>Pilih Gaya Ini</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
