'use client';

import React from 'react';
import { MessageSquare, MapPin } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { SHOP_INFO, BRANCHES_DATA } from '@/data';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0f1115] text-[#9ca3af] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-11 h-11 rounded-full p-[2px] bg-[#c89b3c]/20 border border-[#c89b3c]/40 shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Logo Cahaya Barbershop"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-[#f1f1ed] tracking-wider leading-none">
                  CAHAYA
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#c89b3c] font-bold uppercase mt-1">
                  BARBERSHOP
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#9ca3af] max-w-sm leading-relaxed font-normal">
              Layanan grooming pria dengan potongan rambut presisi, perming modern, dan kenyamanan terbaik di Kuningan dengan 3 cabang resmi.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-white">
              <a
                href="https://instagram.com/cahayabarbershop"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 flex items-center space-x-2 text-xs font-medium cursor-pointer"
                aria-label="Instagram Cahaya Barbershop"
              >
                <InstagramIcon size={16} />
                <span>@cahayabarbershop</span>
              </a>
              <a
                href={`https://wa.me/${SHOP_INFO.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-[#c89b3c] hover:text-[#0f1115] text-white transition-colors border border-white/10 cursor-pointer"
                aria-label="WhatsApp"
              >
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#f1f1ed] uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Layanan & Tarif
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Paket Pilihan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('barbers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Master Barber
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('booking')}
                  className="text-[#c89b3c] font-semibold hover:underline cursor-pointer"
                >
                  Reservasi Jadwal
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#f1f1ed] uppercase tracking-wider">
              Lokasi 3 Cabang & Jam Buka
            </h4>
            <p className="text-xs text-[#c89b3c] font-medium">
              {SHOP_INFO.hours.weekdays} (Buka Setiap Hari)
            </p>

            <ul className="space-y-2.5 pt-1 text-xs">
              {BRANCHES_DATA.map((b) => (
                <li key={b.id} className="flex items-start justify-between gap-2 border-b border-white/5 pb-2">
                  <div>
                    <span className="font-semibold text-white block">{b.name}</span>
                    <span className="text-[11px] text-[#9ca3af] block">{b.address}</span>
                  </div>
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c89b3c] hover:text-white shrink-0 flex items-center space-x-1 text-[11px] font-medium bg-white/5 px-2 py-1 rounded-md border border-white/5 cursor-pointer"
                  >
                    <MapPin size={11} />
                    <span>Peta</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9ca3af] gap-4">
          <p>© 2026 Cahaya Barbershop Kuningan. Hak cipta dilindungi.</p>
          <p className="text-[11px]">
            Manislor · Jagabaya · Jalaksana
          </p>
        </div>
      </div>
    </footer>
  );
}
