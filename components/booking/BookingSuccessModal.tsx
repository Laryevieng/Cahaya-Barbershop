'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Clock,
  Calendar,
  Building2,
  Armchair,
  Scissors,
  User,
  ArrowRight,
} from 'lucide-react';
import type { PublicBooking } from '@/types/barbershop';
import { formatDateIndonesian, formatDateTimeWIB } from '@/lib/date';
import { formatRupiah } from '@/lib/format';
import {
  buildShortWhatsAppBookingMessage,
  buildWhatsAppUrl,
  getBranchLabel,
} from '@/lib/booking';

interface BookingSuccessModalProps {
  booking: PublicBooking;
  onClose: () => void;
  onReset: () => void;
}

export default function BookingSuccessModal({
  booking,
  onClose,
  onReset,
}: BookingSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const branchLabel = getBranchLabel(booking.branch_id);
  const waMessage = buildShortWhatsAppBookingMessage(booking);
  const waUrl = buildWhatsAppUrl(waMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-xl bg-[#0c0c16] border border-[#1e5eff]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-auto"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1e5eff]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Success Icon */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Reservasi Berhasil Dicatat
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Slot Kursi Anda Telah Dikunci
          </h2>
          <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
            Booking tersimpan di sistem kami dengan status <strong className="text-amber-300">Menunggu Konfirmasi</strong>. Segera kirim kode ke WhatsApp agar staf kami mengonfirmasi jadwal Anda.
          </p>
        </div>

        {/* Booking Code Card */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6 text-center space-y-2">
          <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
            Kode Booking Resmi
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-mono font-black tracking-widest text-[#1e5eff]">
              {booking.code}
            </span>
            <button
              onClick={handleCopyCode}
              title="Salin kode booking"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[11px] text-amber-300/90 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Batas konfirmasi: <strong>{formatDateTimeWIB(booking.expires_at)}</strong> (24 Jam)
            </span>
          </p>
        </div>

        {/* Booking Details Grid */}
        <div className="bg-[#08080e] border border-white/5 rounded-2xl p-4 mb-6 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-white/50 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#1e5eff]" />
              Nama Pemesan
            </span>
            <span className="font-semibold text-white">{booking.customer_name}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-white/50 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#1e5eff]" />
              Cabang
            </span>
            <span className="font-semibold text-white">{branchLabel}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-white/50 flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5 text-[#1e5eff]" />
              Kursi
            </span>
            <span className="font-semibold text-[#1e5eff]">
              {booking.chair_label || (booking.booking_mode === 'consultation' ? 'Konsultasi Event' : 'Kursi')}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-white/50 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1e5eff]" />
              Jadwal & Waktu
            </span>
            <span className="font-semibold text-white">
              {formatDateIndonesian(booking.booking_date, { withWeekday: true })},{' '}
              {booking.start_time.slice(0, 5)} WIB ({booking.duration_min} menit)
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-white/50 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#1e5eff]" />
              Layanan & Barber
            </span>
            <span className="font-semibold text-white text-right">
              {booking.service_name} · <span className="text-white/70">{booking.barber_name || 'Any Barber'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-white/50">Estimasi Biaya</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatRupiah(booking.price_idr)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/25 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Konfirmasi ke WhatsApp Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl font-medium text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            Selesai & Buat Reservasi Lain
          </button>
        </div>
      </motion.div>
    </div>
  );
}
