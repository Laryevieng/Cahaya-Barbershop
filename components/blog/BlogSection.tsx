'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, BookOpen } from 'lucide-react';
import { BLOG_DATA } from '@/data';
import { BlogPost } from '@/types/barbershop';
import BlogModal from './BlogModal';

export default function BlogSection() {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  return (
    <section className="py-28 bg-[#0a0a0d] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-4 mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.3em] text-blue-400 uppercase">
            JOURNAL & GROOMING TIPS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Grooming Articles
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Tips perawatan rambut, styling pomade, dan panduan memilih potongan terbaik dari master barber.
          </p>
        </motion.div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_DATA.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedBlog(article)}
              className="group bg-[#0c0c12] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:shadow-[0_10px_35px_rgba(30,94,255,0.2)] flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-gray-900">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-transparent"></div>
                  
                  <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                    <Calendar size={13} className="text-blue-400" />
                    <span>{article.date}</span>
                    {article.readTime && <span>• {article.readTime}</span>}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-gray-400 text-xs font-light leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center space-x-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                <BookOpen size={14} />
                <span>BACA SELENGKAPNYA</span>
                <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Blog Article Full Modal */}
      <BlogModal post={selectedBlog} onClose={() => setSelectedBlog(null)} />
    </section>
  );
}
