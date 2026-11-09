'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import { GALLERY_DATA } from '@/data';
import { GalleryItem, GalleryCategory } from '@/types/barbershop';
import GalleryModal from './GalleryModal';

interface GallerySectionProps {
  onBookLook: (lookName: string) => void;
}

const CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Portfolio' },
  { id: 'cuts', label: 'Haircuts & Fades' },
  { id: 'beard', label: 'Beard Trims' },
  { id: 'interior', label: 'Studio Interior' },
  { id: 'process', label: 'Treatments' },
];

export default function GallerySection({ onBookLook }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => item.category === activeCategory);

  const handleBookFromModal = (title: string) => {
    setSelectedItem(null);
    onBookLook(title);
  };

  return (
    <section id="gallery" className="py-28 bg-[#0a0a0d] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-400 uppercase">
              PORTFOLIO & ATMOSPHERE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-1">
              Barbershop Gallery
            </h2>
          </motion.div>

          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all uppercase ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(30,94,255,0.4)] border border-blue-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Gallery Grid Container */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-black h-72 sm:h-80 shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 contrast-105"
                />

                {/* Gradient Info Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-center space-x-1.5 text-xs text-blue-300 font-medium">
                    <Eye size={14} />
                    <span>Click to expand image</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      <GalleryModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onBookLook={handleBookFromModal}
      />
    </section>
  );
}
