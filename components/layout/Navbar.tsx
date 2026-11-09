'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'services', label: 'SERVICES' },
  { id: 'pricing', label: 'PACKAGES' },
  { id: 'barbers', label: 'BARBERS' },
  { id: 'gallery', label: 'GALLERY' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map(link => document.getElementById(link.id));
      const scrollPos = window.scrollY + 200;

      sections.forEach(section => {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Desktop Left Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-semibold text-gray-300">
          {NAV_LINKS.slice(0, 3).map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`relative py-1 transition-colors uppercase ${
                activeSection === link.id ? 'text-blue-400 font-bold' : 'hover:text-blue-300'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Brand Center Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavClick('home')}
          className="cursor-pointer text-left group flex items-center space-x-3 select-none py-1"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 via-indigo-500 to-blue-400 shadow-[0_0_15px_rgba(30,94,255,0.4)] group-hover:shadow-[0_0_25px_rgba(30,94,255,0.7)] transition-all">
            <img
              src="/images/logo.png"
              alt="CAHAYA BARBERSHOP"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl tracking-wider font-black text-white group-hover:text-blue-400 transition-colors leading-none">
              CAHAYA
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-blue-400 font-bold uppercase mt-1">
              BARBERSHOP
            </span>
          </div>
        </motion.div>

        {/* Desktop Right Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-semibold text-gray-300">
          {NAV_LINKS.slice(3).map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`relative py-1 transition-colors uppercase ${
                activeSection === link.id ? 'text-blue-400 font-bold' : 'hover:text-blue-300'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                />
              )}
            </button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(30,94,255,0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavClick('booking')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#123C8C] via-[#1E5EFF] to-blue-600 text-white rounded-lg text-[11px] font-bold tracking-wider transition-all flex items-center space-x-1.5 shadow-lg border border-blue-400/30 cursor-pointer"
          >
            <Calendar size={13} />
            <span>BOOK NOW</span>
          </motion.button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-blue-400 focus:outline-none transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-[#070709]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"
          >
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shrink-0">
                <img
                  src="/images/logo.png"
                  alt="CAHAYA BARBERSHOP"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-black text-white leading-tight">CAHAYA</span>
                <span className="text-[8px] tracking-[0.25em] text-blue-400 font-bold uppercase">BARBERSHOP</span>
              </div>
            </div>

            {NAV_LINKS.map((link, idx) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left py-2 text-sm font-bold tracking-widest uppercase transition-colors ${
                  activeSection === link.id ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </motion.button>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              onClick={() => handleNavClick('booking')}
              className="w-full py-3.5 bg-gradient-to-r from-[#123C8C] via-[#1E5EFF] to-blue-600 text-white font-bold rounded-lg tracking-wider shadow-lg text-center uppercase text-sm flex items-center justify-center space-x-2"
            >
              <Calendar size={16} />
              <span>BOOK YOUR STOPOVER</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
