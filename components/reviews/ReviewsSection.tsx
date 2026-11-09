'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { REVIEWS_DATA } from '@/data';

export default function ReviewsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1));
    }, 6000);
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
    <section className="py-28 bg-[#0a0a0d] border-t border-b border-white/5 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-400 uppercase">
            CLIENT SATISFACTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#0d0d14] rounded-3xl p-8 sm:p-14 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          {/* Decorative Quote Icon */}
          <div className="absolute top-8 right-8 text-white/5 pointer-events-none">
            <Quote size={80} />
          </div>

          <div className="min-h-[220px] flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 flex flex-col items-center"
              >
                {/* 5-star rating */}
                <div className="flex space-x-1.5 text-amber-400">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg sm:text-2xl font-serif italic text-gray-200 max-w-2xl leading-relaxed">
                  &#34;{activeReview.review}&#34;
                </p>

                {/* Client Avatar & Meta */}
                <div className="flex items-center space-x-4 pt-4">
                  <img
                    src={activeReview.avatar}
                    alt={activeReview.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                  <div className="text-left">
                    <h4 className="font-bold text-white text-base font-serif">{activeReview.name}</h4>
                    <p className="text-xs text-blue-400 font-medium">{activeReview.role}</p>
                    {activeReview.service && (
                      <p className="text-[11px] text-gray-400">{activeReview.service}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors border border-white/5"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft size={20} />
            </motion.button>

            {/* Indicator Dots */}
            <div className="flex space-x-2">
              {REVIEWS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIdx === idx ? 'bg-blue-500 w-8' : 'bg-white/20 w-2.5 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors border border-white/5"
              aria-label="Next Testimonial"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
