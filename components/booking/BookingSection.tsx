'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  MessageSquare,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { SERVICES_DATA, BARBERS_DATA, BRANCHES_DATA, SHOP_INFO, TIME_SLOTS } from '@/data';
import { buildBookingMessage, buildWhatsAppUrl } from '@/lib/booking';
import { formatServicePrice } from '@/lib/format';
import type { BookingDraft } from '@/types/barbershop';

const CUSTOM_SERVICE_VALUE = '__custom_look__';

interface BookingSectionProps {
  draft: BookingDraft;
  today: string;
  setField: <K extends keyof BookingDraft>(field: K, value: BookingDraft[K]) => void;
}

export default function BookingSection({ draft, today, setField }: BookingSectionProps) {
  const [notice, setNotice] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimer.current !== null) {
        clearTimeout(noticeTimer.current);
      }
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.phone.trim()) return;

    const waUrl = buildWhatsAppUrl(buildBookingMessage(draft));
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setNotice(true);
    if (noticeTimer.current !== null) {
      clearTimeout(noticeTimer.current);
    }
    noticeTimer.current = setTimeout(() => setNotice(false), 1400);
  };

  const haircuts = SERVICES_DATA.filter((service) => service.category === 'haircut');
  const colors = SERVICES_DATA.filter((service) => service.category === 'color');
  const others = SERVICES_DATA.filter((service) => service.category === 'others');
  const serviceValue =
    draft.service.kind === 'catalog' ? draft.service.id : CUSTOM_SERVICE_VALUE;

  return (
    <section id="booking" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-blue-400/40 shrink-0">
                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span>RESERVASI ONLINE 3 CABANG</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Siap Tampil <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
                Lebih Percaya Diri?
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
              Reservasi kursi Anda di cabang terdekat secara instan dalam 60 detik. Detail jadwal Anda akan langsung terhubung ke WhatsApp resmi Cahaya Barbershop untuk konfirmasi cepat tanpa perlu antre lama.
            </p>

            {/* Quick Info Badges */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-[#0c0c10] border border-white/5">
                <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">3 Cabang Aktif</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Manislor (Utama) • Jagabaya • Jalaksana</p>
                  <span className="inline-block text-[10px] text-emerald-400 font-bold mt-1">● Semua Cabang Buka Setiap Hari</span>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-[#0c0c10] border border-white/5">
                <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Jam Operasional</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{SHOP_INFO.hours.weekdays}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-[#0c0c12] rounded-3xl p-5 sm:p-8 lg:p-10 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative"
          >
            {/* Success Alert Banner */}
            <AnimatePresence>
              {notice && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center space-x-3 shadow-lg"
                >
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  <span>Membuka WhatsApp Cahaya Barbershop untuk konfirmasi reservasi Anda...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="booking-name"
                    className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Nama Lengkap</span>
                    <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      id="booking-name"
                      type="text"
                      required
                      placeholder="e.g. Budi Santoso"
                      value={draft.name}
                      onChange={(e) => setField('name', e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="booking-phone"
                    className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Nomor WhatsApp</span>
                    <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      placeholder="e.g. 085221239852"
                      value={draft.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Branch & Service Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">

                {/* Branch Selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-branch"
                    className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>Pilih Cabang</span>
                    <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <select
                      id="booking-branch"
                      value={draft.branchId}
                      onChange={(e) => setField('branchId', e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      {BRANCHES_DATA.map((branch) => (
                        <option key={branch.id} value={branch.id} className="bg-[#0e0e14]">
                          {branch.name} {branch.isMain ? '(Pusat)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-service"
                    className="text-xs font-bold text-gray-300 uppercase tracking-wider"
                  >
                    Pilihan Layanan
                  </label>
                  <select
                    id="booking-service"
                    value={serviceValue}
                    onChange={(e) => {
                      if (e.target.value === CUSTOM_SERVICE_VALUE) return;
                      setField('service', { kind: 'catalog', id: e.target.value });
                    }}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {draft.service.kind === 'custom' && (
                      <option value={CUSTOM_SERVICE_VALUE} className="bg-[#0e0e14] text-white">
                        {draft.service.label}
                      </option>
                    )}

                    <optgroup label="✂️ HAIRCUT SERVICES" className="bg-[#0e0e14] font-bold text-blue-400">
                      {haircuts.map((service) => (
                        <option key={service.id} value={service.id} className="text-white">
                          {service.name} ({formatServicePrice(service)})
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🎨 HAIR COLOR" className="bg-[#0e0e14] font-bold text-blue-400">
                      {colors.map((service) => (
                        <option key={service.id} value={service.id} className="text-white">
                          {service.name} ({formatServicePrice(service)})
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🌊 PERM & OTHERS" className="bg-[#0e0e14] font-bold text-blue-400">
                      {others.map((service) => (
                        <option key={service.id} value={service.id} className="text-white">
                          {service.name} ({formatServicePrice(service)})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Row 3: Barber & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="booking-barber"
                    className="text-xs font-bold text-gray-300 uppercase tracking-wider"
                  >
                    Pilihan Barber
                  </label>
                  <select
                    id="booking-barber"
                    value={draft.barberId}
                    onChange={(e) => setField('barberId', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="any" className="bg-[#0e0e14]">
                      Any Master Barber (Siapa saja yang siap)
                    </option>
                    {BARBERS_DATA.map((barber) => (
                      <option key={barber.id} value={String(barber.id)} className="bg-[#0e0e14]">
                        {barber.name} ({barber.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="booking-date"
                    className="text-xs font-bold text-gray-300 uppercase tracking-wider"
                  >
                    Pilih Tanggal
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      id="booking-date"
                      type="date"
                      required
                      min={today}
                      value={draft.date}
                      onChange={(e) => setField('date', e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Time Slot */}
              <div className="space-y-2">
                <label
                  htmlFor="booking-time"
                  className="text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  Pilih Jam Kedatangan
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                  <select
                    id="booking-time"
                    value={draft.time}
                    onChange={(e) => setField('time', e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time} className="bg-[#0e0e14]">
                        {time} WIB
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Notes */}
              <div className="space-y-2">
                <label
                  htmlFor="booking-notes"
                  className="text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  Catatan / Permintaan Khusus (Opsional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  placeholder="Contoh: Ingin potong fade oleh Kang Yayat di cabang Manislor, konsultasi Korean perm, dll..."
                  value={draft.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-base sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(30,94,255,0.6)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#123C8C] via-[#1E5EFF] to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl text-xs tracking-[0.2em] shadow-[0_0_25px_rgba(30,94,255,0.4)] transition-all uppercase flex items-center justify-center space-x-2.5 border border-blue-400/40 cursor-pointer"
              >
                <MessageSquare size={18} />
                <span>KIRIM RESERVASI VIA WHATSAPP</span>
              </motion.button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
