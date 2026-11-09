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
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-lg bg-[#181b22] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-auto"
      >
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight text-[#f1f1ed]">
            Slot Kursi Anda Telah Dikunci
          </h2>
          <p className="text-xs text-[#9ca3af] max-w-sm mx-auto leading-relaxed">
            Booking tersimpan di sistem dengan status <strong className="text-amber-300">Menunggu Konfirmasi</strong>. Kirim rincian jadwal ke WhatsApp agar staf kami memverifikasi pesanan Anda.
          </p>
        </div>

        <div className="p-4 bg-[#0f1115] border border-white/10 rounded-xl mb-6 text-center space-y-2">
          <span className="text-[11px] font-medium text-[#9ca3af] uppercase tracking-wider">
            Kode Booking Resmi
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-mono font-bold tracking-widest text-[#c89b3c]">
              {booking.code}
            </span>
            <button
              type="button"
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

        <div className="bg-[#0f1115] border border-white/5 rounded-xl p-4 mb-6 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[#9ca3af] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#c89b3c]" />
              Nama Pemesan
            </span>
            <span className="font-semibold text-white">{booking.customer_name}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[#9ca3af] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#c89b3c]" />
              Cabang
            </span>
            <span className="font-semibold text-white">{branchLabel}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[#9ca3af] flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5 text-[#c89b3c]" />
              Kursi
            </span>
            <span className="font-semibold text-[#c89b3c]">
              {booking.chair_label || (booking.booking_mode === 'consultation' ? 'Konsultasi Acara' : 'Kursi')}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[#9ca3af] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c89b3c]" />
              Jadwal & Waktu
            </span>
            <span className="font-semibold text-white">
              {formatDateIndonesian(booking.booking_date, { withWeekday: true })},{' '}
              {booking.start_time.slice(0, 5)} WIB ({booking.duration_min} menit)
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[#9ca3af] flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#c89b3c]" />
              Layanan & Barber
            </span>
            <span className="font-semibold text-white text-right">
              {booking.service_name} · <span className="text-[#9ca3af]">{booking.barber_name || 'Any'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[#9ca3af]">Estimasi Biaya</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatRupiah(booking.price_idr)}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-[#c89b3c]/20 uppercase tracking-wider"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Konfirmasi ke WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-[#9ca3af] hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            Selesai & Buat Reservasi Lain
          </button>
        </div>
      </motion.div>
    </div>
  );
}
