'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User } from 'lucide-react';
import type { BlogPost } from '@/types/barbershop';

interface BlogModalProps {
  article: BlogPost | null;
  onClose: () => void;
}

export default function BlogModal({ article, onClose }: BlogModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

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
          className="relative max-w-2xl w-full bg-[#181b22] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 my-auto"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#0f1115] rounded-full text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
            aria-label="Tutup artikel"
          >
            <X size={16} />
          </button>

          <div className="flex items-center space-x-3 text-xs text-[#c89b3c] font-semibold uppercase tracking-wider">
            <span className="px-2.5 py-0.5 rounded-md bg-[#c89b3c]/15 border border-[#c89b3c]/30">
              {article.category}
            </span>
            <span className="text-[#9ca3af] flex items-center space-x-1">
              <Calendar size={13} />
              <span>{article.date}</span>
            </span>
            {article.readTime && (
              <span className="text-[#9ca3af] flex items-center space-x-1">
                <Clock size={13} />
                <span>{article.readTime}</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f1f1ed] leading-snug">
            {article.title}
          </h2>

          <div className="rounded-xl overflow-hidden border border-white/10">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-56 sm:h-64 object-cover"
            />
          </div>

          <div className="space-y-4 text-[#d1d5db] text-sm sm:text-base leading-relaxed font-normal">
            <p className="text-white font-medium italic border-l-2 border-[#c89b3c] pl-4 py-1">
              {article.excerpt}
            </p>
            <p>{article.content}</p>
          </div>

          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 text-xs text-[#9ca3af]">
              <User size={13} className="text-[#c89b3c]" />
              <span>Tim Barbershop Kuningan</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Tutup Artikel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
