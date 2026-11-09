'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import { GALLERY_DATA } from '@/data';
import type { GalleryItem, GalleryCategory } from '@/types/barbershop';
import GalleryModal from './GalleryModal';

interface GallerySectionProps {
  onBookLook: (lookName: string) => void;
}

const CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'Semua Foto' },
  { id: 'cuts', label: 'Potongan & Fade' },
  { id: 'beard', label: 'Kumis & Jenggot' },
  { id: 'interior', label: 'Suasana Studio' },
  { id: 'process', label: 'Perawatan & Cuci' },
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
    <section id="gallery" className="py-24 bg-[#0f1115] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed]">
              Dokumentasi Hasil Pangkas
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] mt-1.5">
              Koleksi gaya rambut nyata pelanggan dan suasana studio di tiga cabang kami.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-colors uppercase cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#c89b3c] text-[#0f1115] font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-[#9ca3af] hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-[#181b22] h-72 sm:h-80 shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5">
                  <h3 className="font-serif text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-[#c89b3c] font-medium">
                    <Eye size={13} />
                    <span>Lihat foto lebih jelas</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <GalleryModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onBookLook={handleBookFromModal}
      />
    </section>
  );
}
