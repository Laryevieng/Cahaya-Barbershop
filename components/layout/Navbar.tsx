'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'home', label: 'Beranda' },
  { id: 'about', label: 'Tentang' },
  { id: 'services', label: 'Layanan' },
  { id: 'pricing', label: 'Paket' },
  { id: 'barbers', label: 'Barber' },
  { id: 'gallery', label: 'Galeri' },
  { id: 'contact', label: 'Kontak' },
];

export default function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map((link) => document.getElementById(link.id));
      const scrollPos = window.scrollY + 200;

      sections.forEach((section) => {
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f1115]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
          : 'bg-gradient-to-b from-[#0f1115]/90 via-[#0f1115]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-[#9ca3af]">
          {NAV_LINKS.slice(0, 3).map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSection === link.id
                  ? 'text-[#f1f1ed] font-bold'
                  : 'hover:text-white'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c89b3c] rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="cursor-pointer text-left flex items-center space-x-3 select-none py-1 group"
          aria-label="Cahaya Barbershop Beranda"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-[2px] bg-[#c89b3c]/20 border border-[#c89b3c]/40 transition-colors shrink-0">
            <img
              src="/images/logo.png"
              alt="Cahaya Barbershop"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl tracking-wider font-bold text-[#f1f1ed] leading-none">
              CAHAYA
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#c89b3c] font-bold uppercase mt-0.5">
              BARBERSHOP
            </span>
          </div>
        </button>

        <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-[#9ca3af]">
          {NAV_LINKS.slice(3).map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSection === link.id
                  ? 'text-[#f1f1ed] font-bold'
                  : 'hover:text-white'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c89b3c] rounded-full"
                />
              )}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleNavClick('booking')}
            className="px-4 py-2 bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] rounded-xl text-xs font-bold tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-[#c89b3c]/15"
          >
            <Calendar size={13} />
            <span>Pesan Jadwal</span>
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#c89b3c] focus:outline-none transition-colors cursor-pointer"
          aria-label="Menu navigasi"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#181b22] border-b border-white/10 px-6 py-5 space-y-3.5 max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain shadow-2xl"
          >
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-full p-[1px] bg-[#c89b3c]/30 border border-[#c89b3c]/40 shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Cahaya Barbershop"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold text-white leading-tight">CAHAYA</span>
                <span className="text-[8px] tracking-[0.25em] text-[#c89b3c] font-bold uppercase">BARBERSHOP</span>
              </div>
            </div>

            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left py-2 text-sm font-semibold transition-colors cursor-pointer ${
                  activeSection === link.id ? 'text-[#c89b3c] font-bold' : 'text-[#d1d5db] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleNavClick('booking')}
              className="w-full py-3 bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] font-bold rounded-xl text-xs tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <Calendar size={15} />
              <span>Pesan Jadwal Cukur</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
