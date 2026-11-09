'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/types/barbershop';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export default function BlogModal({ post, onClose }: BlogModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!post) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative max-w-2xl w-full bg-[#0d0d14] border border-white/15 rounded-3xl overflow-hidden p-6 sm:p-9 space-y-6 max-h-[85vh] overflow-y-auto shadow-[0_25px_70px_rgba(0,0,0,0.9)] z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2.5 bg-black/70 rounded-full text-white hover:bg-white/20 transition-colors border border-white/10"
            aria-label="Close Article"
          >
            <X size={18} />
          </button>

          {/* Category & Date */}
          <div className="flex items-center space-x-3 text-xs text-blue-400 font-bold uppercase tracking-wider">
            <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30">
              {post.category}
            </span>
            <span className="text-gray-400 flex items-center space-x-1">
              <Calendar size={13} />
              <span>{post.date}</span>
            </span>
            {post.readTime && (
              <span className="text-gray-400 flex items-center space-x-1">
                <Clock size={13} />
                <span>{post.readTime}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
            {post.title}
          </h2>

          {/* Banner Image */}
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 sm:h-72 object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed font-light">
            <p className="text-white font-medium text-base sm:text-lg italic border-l-2 border-blue-500 pl-4 py-1">
              {post.excerpt}
            </p>
            <p>{post.content}</p>
          </div>

          {/* Footer Metadata */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <User size={14} className="text-blue-400" />
              <span>By CAHAYA BARBERSHOP Editorial & Master Craftsmen</span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            >
              CLOSE ARTICLE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
