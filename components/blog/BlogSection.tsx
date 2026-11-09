'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { BLOG_DATA } from '@/data';
import type { BlogPost } from '@/types/barbershop';
import BlogModal from './BlogModal';

export default function BlogSection() {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  return (
    <section className="py-24 bg-[#0f1115] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f1f1ed]">
            Panduan & Tips Perawatan
          </h2>
          <p className="text-[#9ca3af] text-sm leading-relaxed">
            Artikel praktis seputar perawatan rambut pria, cara menata pomade, dan panduan memilih model rambut dari tim barber kami.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_DATA.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setSelectedBlog(article)}
              className="group bg-[#181b22] rounded-2xl overflow-hidden border border-white/10 hover:border-[#c89b3c]/40 cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181b22] via-transparent to-transparent" />

                  <span className="absolute top-3.5 left-3.5 bg-[#c89b3c] text-[#0f1115] text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-2.5">
                  <div className="flex items-center space-x-2 text-[11px] text-[#9ca3af]">
                    <Calendar size={13} className="text-[#c89b3c]" />
                    <span>{article.date}</span>
                    {article.readTime && <span>• {article.readTime}</span>}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#f1f1ed] group-hover:text-[#c89b3c] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#9ca3af] line-clamp-3 leading-relaxed font-normal">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <span className="text-xs font-semibold text-[#c89b3c] flex items-center space-x-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BlogModal
        article={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />
    </section>
  );
}
