'use client';

import React from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { SHOP_INFO, BRANCHES_DATA } from '@/data';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#030305] text-gray-400 border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 via-indigo-500 to-blue-400 shadow-[0_0_20px_rgba(30,94,255,0.4)] shrink-0">
                <img
                  src="/images/logo.png"
                  alt="CAHAYA BARBERSHOP Logo"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black text-white tracking-wider leading-none">
                  CAHAYA
                </span>
                <span className="text-[9px] tracking-[0.3em] text-blue-400 font-bold uppercase mt-1">
                  BARBERSHOP
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed font-light">
              Your Style. Our Craft. Layanan grooming pria presisi, pewarnaan modern, dan kenyamanan potong rambut terbaik di Kuningan dengan 3 cabang resmi.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-white">
              <a
                href="https://instagram.com/cahayabarbershop"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-blue-600 transition-colors border border-white/5 flex items-center space-x-2 text-xs font-semibold"
                aria-label="Instagram Cahaya Barbershop"
              >
                <InstagramIcon size={18} className="text-pink-400" />
                <span>@cahayabarbershop</span>
              </a>
              <a
                href={`https://wa.me/${SHOP_INFO.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-emerald-600 transition-colors border border-white/5"
                aria-label="WhatsApp"
              >
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home & Profil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Layanan & Pricelist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Paket Pilihan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('barbers')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Master Barber & Tim
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Lokasi 3 Cabang
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-blue-400 transition-colors text-blue-400 font-semibold"
                >
                  Reservasi Jadwal
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours & 3 Branches */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Lokasi 3 Cabang & Jam Buka
            </h4>
            <p className="text-xs text-blue-400 font-semibold">
              ⏰ {SHOP_INFO.hours.weekdays} (Buka Setiap Hari)
            </p>

            <ul className="space-y-2 pt-1 text-xs text-gray-300">
              {BRANCHES_DATA.map((b) => (
                <li key={b.id} className="flex items-start justify-between gap-2 border-b border-white/5 pb-1.5">
                  <div>
                    <span className="font-bold text-white block">📍 {b.name}</span>
                    <span className="text-[11px] text-gray-400 block">{b.address}</span>
                  </div>
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-white shrink-0 flex items-center space-x-1 text-[11px] font-bold bg-white/5 px-2 py-1 rounded"
                  >
                    <span>Maps</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>OPEN DAILY FOR WALK-IN & BOOKING</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 CAHAYA BARBERSHOP. All rights reserved.</p>
          <p className="text-[11px] flex items-center space-x-1">
            <span>Instagram: @cahayabarbershop</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
