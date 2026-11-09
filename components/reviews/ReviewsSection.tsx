'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { REVIEWS_DATA } from '@/data';

export default function ReviewsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? REVIEWS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1));
  };

  const activeReview = REVIEWS_DATA[activeIdx];

  return (
    <section className="py-24 bg-[#0f1115] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed]">
            Pengalaman Pelanggan
          </h2>
          <p className="text-[#9ca3af] text-sm">
            Pendapat jujur para pelanggan setia di tiga cabang Cahaya Barbershop Kuningan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-[#181b22] rounded-2xl p-7 sm:p-12 border border-white/10 shadow-xl"
        >
          <div className="absolute top-6 right-6 text-white/5 pointer-events-none">
            <Quote size={64} />
          </div>

          <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 flex flex-col items-center"
              >
                <div className="flex space-x-1 text-[#c89b3c]">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                <p className="text-base sm:text-xl font-serif text-[#f1f1ed] max-w-2xl leading-relaxed">
                  &ldquo;{activeReview.review}&rdquo;
                </p>

                <div className="flex items-center space-x-3.5 pt-2">
                  <div className="w-12 h-12 rounded-full bg-[#1f232c] border border-white/10 flex items-center justify-center text-sm font-bold text-[#c89b3c] shrink-0">
                    {activeReview.avatar}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-[#f1f1ed] text-sm">
                      {activeReview.name}
                    </h4>
                    <p className="text-xs text-[#9ca3af]">{activeReview.role}</p>
                    {activeReview.service && (
                      <p className="text-[11px] text-[#c89b3c]">{activeReview.service}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center mt-8 pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5 cursor-pointer"
              aria-label="Ulasan sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex space-x-2">
              {REVIEWS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeIdx === idx
                      ? 'w-6 bg-[#c89b3c]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Lihat ulasan ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5 cursor-pointer"
              aria-label="Ulasan selanjutnya"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
