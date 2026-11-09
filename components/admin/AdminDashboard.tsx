'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Search,
  Copy,
  Check,
  Building2,
  Armchair,
  MessageCircle,
  Filter,
} from 'lucide-react';
import type { AdminBooking, BookingStatus } from '@/types/barbershop';
import { formatRupiah } from '@/lib/format';
import { formatDateIndonesian, formatDateTimeWIB } from '@/lib/date';
import { BRANCHES_DATA } from '@/data';

interface AdminDashboardProps {
  initialBookings: AdminBooking[];
  initialMonth: string;
  initialStats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    expired: number;
    today: number;
  };
}

export default function AdminDashboard({
  initialBookings,
  initialMonth,
  initialStats,
}: AdminDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [month, setMonth] = useState(initialMonth);
  const [bookings, setBookings] = useState<AdminBooking[]>(initialBookings);
  const [stats, setStats] = useState(initialStats);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dialog state for releasing slot
  const [releaseTarget, setReleaseTarget] = useState<AdminBooking | null>(null);
  const [releaseReason, setReleaseReason] = useState('Pelanggan no-show setelah dikonfirmasi via WA');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const reloadData = async (targetMonth = month) => {
    try {
      const res = await fetch(`/api/admin/bookings?month=${targetMonth}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.replace('/admin/login');
          return;
        }
        throw new Error('Gagal memuat data');
      }
      const data = await res.json();
      setBookings(data.bookings || []);
      setStats(data.stats || initialStats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value;
    if (!newMonth) return;
    setMonth(newMonth);
    startTransition(() => {
      reloadData(newMonth);
    });
  };

  const handleAction = async (
    bookingId: string,
    action: 'confirm' | 'complete' | 'reopen',
    reason?: string
  ) => {
    setIsSubmittingAction(true);
    setActionFeedback(null);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionFeedback({
          type: 'error',
          message: data.error || 'Gagal mengeksekusi aksi.',
        });
        setIsSubmittingAction(false);
        return;
      }

      setActionFeedback({
        type: 'success',
        message:
          action === 'confirm'
            ? 'Booking berhasil dikonfirmasi.'
            : action === 'complete'
            ? 'Booking ditandai selesai.'
            : 'Booking berhasil dibuka kembali.',
      });

      await reloadData();
    } catch {
      setActionFeedback({
        type: 'error',
        message: 'Koneksi gagal. Silakan coba kembali.',
      });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleConfirmReleaseSlot = async () => {
    if (!releaseTarget) return;
    setIsSubmittingAction(true);
    setActionFeedback(null);

    try {
      const res = await fetch(`/api/admin/bookings/${releaseTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', reason: releaseReason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionFeedback({
          type: 'error',
          message: data.error || 'Gagal melepas slot.',
        });
        setIsSubmittingAction(false);
        return;
      }

      setActionFeedback({
        type: 'success',
        message: `Slot kursi ${releaseTarget.chair_label || ''} (${releaseTarget.start_time.slice(0, 5)}) berhasil dilepas. Pelanggan lain kini bisa memesannya kembali.`,
      });

      setReleaseTarget(null);
      await reloadData();
    } catch {
      setActionFeedback({
        type: 'error',
        message: 'Koneksi gagal saat melepas slot.',
      });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (branchFilter !== 'all' && b.branch_id !== branchFilter) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const codeMatch = b.code.toLowerCase().includes(q);
        const nameMatch = b.customer_name.toLowerCase().includes(q);
        const phoneMatch = b.customer_phone.includes(q);
        if (!codeMatch && !nameMatch && !phoneMatch) return false;
      }

      return true;
    });
  }, [bookings, branchFilter, statusFilter, search]);

  const statusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Menunggu
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            Terkonfirmasi
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Selesai
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300">
            <XCircle className="w-3 h-3 text-rose-400" />
            Dilepas / Batal
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/15 border border-zinc-500/30 text-zinc-400">
            <AlertTriangle className="w-3 h-3 text-zinc-400" />
            Kedaluwarsa
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Cahaya Barbershop: Admin Reservasi
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#c89b3c]/15 text-[#c89b3c] border border-[#c89b3c]/30">
              3 Cabang · 3 Kursi
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Panel operasional pengelolaan jadwal, pelepasan slot no-show, dan konfirmasi WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 bg-[#181b22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
            <Calendar className="w-3.5 h-3.5 text-[#c89b3c]" />
            <span className="text-[#9ca3af]">Bulan:</span>
            <input
              type="month"
              value={month}
              onChange={handleMonthChange}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            />
          </label>

          <button
            type="button"
            onClick={() => reloadData()}
            disabled={isPending}
            title="Muat ulang data"
            className="p-2.5 rounded-xl bg-[#181b22] border border-white/10 hover:border-white/20 text-[#9ca3af] hover:text-white transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181b22] border border-white/10 hover:border-white/20 text-xs text-[#9ca3af] hover:text-white transition"
          >
            <span>Lihat Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs text-red-400 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 border ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <span>{actionFeedback.message}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-white/40 hover:text-white text-xs underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0c0c14] border border-white/10 rounded-2xl p-4">
          <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Total Bulan Ini</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          <p className="text-[10px] text-white/40 mt-1">Semua status</p>
        </div>
        <div className="bg-[#0c0c14] border border-amber-500/20 rounded-2xl p-4">
          <p className="text-[11px] font-medium text-amber-300 uppercase tracking-wider">Menunggu</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
          <p className="text-[10px] text-white/40 mt-1">Batas 24 jam</p>
        </div>
        <div className="bg-[#0c0c14] border border-blue-500/20 rounded-2xl p-4">
          <p className="text-[11px] font-medium text-blue-300 uppercase tracking-wider">Terkonfirmasi</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{stats.confirmed}</p>
          <p className="text-[10px] text-white/40 mt-1">Jadwal aman</p>
        </div>
        <div className="bg-[#0c0c14] border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider">Selesai</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed}</p>
          <p className="text-[10px] text-white/40 mt-1">Layanan tuntas</p>
        </div>
        <div className="bg-[#0c0c14] border border-rose-500/20 rounded-2xl p-4">
          <p className="text-[11px] font-medium text-rose-300 uppercase tracking-wider">Dilepas / Batal</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{stats.cancelled}</p>
          <p className="text-[10px] text-white/40 mt-1">Slot telah dibuka</p>
        </div>
        <div className="bg-[#181b22] border border-white/10 rounded-2xl p-4">
          <p className="text-[11px] font-medium text-[#c89b3c] uppercase tracking-wider">Hari Ini</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.today}</p>
          <p className="text-[10px] text-white/40 mt-1">Jadwal aktif</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0c0c14] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode booking, nama, atau nomor WA..."
              className="w-full pl-10 pr-4 py-2 bg-[#0f1115] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c89b3c]"
            />
          </div>

          {/* Branch Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#9ca3af] mr-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Cabang:
            </span>
            <button
              type="button"
              onClick={() => setBranchFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                branchFilter === 'all'
                  ? 'bg-[#c89b3c] text-[#0f1115] font-bold'
                  : 'bg-white/5 text-[#9ca3af] hover:text-white'
              }`}
            >
              Semua
            </button>
            {BRANCHES_DATA.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBranchFilter(b.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  branchFilter === b.id
                    ? 'bg-[#c89b3c] text-[#0f1115] font-bold'
                    : 'bg-white/5 text-[#9ca3af] hover:text-white'
                }`}
              >
                {b.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-white/5">
          <span className="text-[11px] text-white/50 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Status:
          </span>
          {[
            { id: 'all', label: 'Semua', count: bookings.length },
            { id: 'pending', label: 'Menunggu', count: stats.pending },
            { id: 'confirmed', label: 'Terkonfirmasi', count: stats.confirmed },
            { id: 'completed', label: 'Selesai', count: stats.completed },
            { id: 'cancelled', label: 'Dilepas / Batal', count: stats.cancelled },
            { id: 'expired', label: 'Kedaluwarsa', count: stats.expired },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-white/80">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-[#0c0c14] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs text-white/60">
          <span>Menampilkan {filteredBookings.length} booking</span>
          <span>Bulan {month} (Asia/Jakarta)</span>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-xs">
            Tidak ada booking yang cocok dengan filter ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-white/50 uppercase tracking-wider text-[10px] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Kode & Pelanggan</th>
                  <th className="py-3 px-4">Cabang & Kursi</th>
                  <th className="py-3 px-4">Jadwal & Waktu</th>
                  <th className="py-3 px-4">Layanan & Barber</th>
                  <th className="py-3 px-4">Status & Kedaluwarsa</th>
                  <th className="py-3 px-4 text-right">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((b) => {
                  const branch = BRANCHES_DATA.find((x) => x.id === b.branch_id);
                  const waNumber = b.customer_phone.startsWith('62')
                    ? b.customer_phone
                    : `62${b.customer_phone}`;
                  const waMessage = encodeURIComponent(
                    `Halo Kak ${b.customer_name}, kami dari Cahaya Barbershop cabang ${b.branches?.short_name || branch?.shortName || b.branch_id}. Mengenai booking dengan kode *${b.code}* untuk ${formatDateIndonesian(b.booking_date, { withWeekday: true })} jam ${b.start_time.slice(0, 5)} WIB (${b.chair_label || 'Konsultasi'}), apakah sudah sesuai? Terima kasih.`
                  );
                  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-white/[0.02] transition"
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-white text-xs">
                              {b.code}
                            </span>
                            <button
                              onClick={() => handleCopy(b.code)}
                              title="Salin kode booking"
                              className="text-white/40 hover:text-white transition cursor-pointer"
                            >
                              {copiedCode === b.code ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="font-medium text-white flex items-center gap-1">
                            <User className="w-3 h-3 text-white/40" />
                            <span>{b.customer_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] inline-flex items-center gap-1 underline"
                              title="Hubungi via WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>+{b.customer_phone}</span>
                            </a>
                          </div>
                          {b.notes && (
                            <p className="text-[11px] text-white/50 italic bg-white/5 p-1.5 rounded-lg max-w-xs mt-1">
                              &ldquo;{b.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Branch & Chair */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="font-medium text-white">
                            {b.branches?.short_name || branch?.shortName || b.branch_id}
                          </div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#c89b3c]/10 text-[#c89b3c] border border-[#c89b3c]/20">
                            <Armchair className="w-3 h-3" />
                            <span>{b.chair_label || (b.booking_mode === 'consultation' ? 'Konsultasi' : 'Kursi')}</span>
                          </div>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="text-white font-medium">
                            {formatDateIndonesian(b.booking_date, { withWeekday: true })}
                          </div>
                          <div className="text-[#9ca3af] font-mono text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-white/40" />
                            <span>
                              {b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)} WIB
                            </span>
                            <span className="text-[#9ca3af]/60">({b.duration_min}m)</span>
                          </div>
                        </div>
                      </td>

                      {/* Service & Barber */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="text-white font-medium flex items-center gap-1">
                            <Scissors className="w-3 h-3 text-[#c89b3c]" />
                            <span>{b.service_name}</span>
                          </div>
                          <div className="text-white/50 text-[11px]">
                            Barber: <span className="text-white/80">{b.barber_name || 'Any'}</span>
                          </div>
                          <div className="text-white/60 font-mono text-[11px]">
                            {formatRupiah(b.price_idr)}
                          </div>
                        </div>
                      </td>

                      {/* Status & Expiry */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1.5">
                          <div>{statusBadge(b.status)}</div>
                          {b.status === 'pending' && b.expires_at && (
                            <p className="text-[10px] text-amber-300/80">
                              Batas: {formatDateTimeWIB(b.expires_at)}
                            </p>
                          )}
                          {b.status === 'cancelled' && b.cancel_reason && (
                            <p className="text-[10px] text-rose-300/80 italic max-w-xs">
                              Alasan: {b.cancel_reason}
                            </p>
                          )}
                          {b.status === 'confirmed' && b.confirmed_at && (
                            <p className="text-[10px] text-white/40">
                              Dikonfirmasi: {formatDateTimeWIB(b.confirmed_at)}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Operational Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(b.id, 'confirm')}
                                disabled={isSubmittingAction}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
                              >
                                Konfirmasi
                              </button>
                              <button
                                onClick={() => setReleaseTarget(b)}
                                disabled={isSubmittingAction}
                                className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                              >
                                Lepas Slot
                              </button>
                            </>
                          )}

                          {b.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => handleAction(b.id, 'complete')}
                                disabled={isSubmittingAction}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                              >
                                Selesai
                              </button>
                              <button
                                onClick={() => setReleaseTarget(b)}
                                disabled={isSubmittingAction}
                                className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                              >
                                Lepas Slot
                              </button>
                            </>
                          )}

                          {(b.status === 'cancelled' || b.status === 'expired') && (
                            <button
                              onClick={() => handleAction(b.id, 'reopen')}
                              disabled={isSubmittingAction}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                              title="Buka kembali jika slot masih kosong"
                            >
                              Buka Lagi
                            </button>
                          )}

                          {b.status === 'completed' && (
                            <span className="text-[11px] text-white/40 italic">
                              Arsip
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Release Slot Confirmation Dialog */}
      {releaseTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e0e18] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Lepas Slot Kursi Ini?
                </h3>
                <p className="text-xs text-white/60">
                  {releaseTarget.code} · {releaseTarget.customer_name}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1 text-xs">
              <p className="text-white/80">
                <span className="text-white/40">Cabang:</span>{' '}
                {releaseTarget.branches?.name || releaseTarget.branch_id}
              </p>
              <p className="text-white/80">
                <span className="text-white/40">Kursi & Jam:</span>{' '}
                <strong className="text-white">{releaseTarget.chair_label || 'Konsultasi'}</strong> · {formatDateIndonesian(releaseTarget.booking_date, { withWeekday: true })} jam {releaseTarget.start_time.slice(0, 5)} WIB
              </p>
              <p className="text-white/80">
                <span className="text-white/40">Layanan:</span> {releaseTarget.service_name}
              </p>
            </div>

            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-300 text-xs leading-relaxed">
              <strong>Pemberitahuan:</strong> Melepas slot ini akan mengubah status booking menjadi <code className="bg-black/30 px-1 py-0.5 rounded">cancelled</code> dan <strong>langsung membebaskan kursi</strong> tersebut di website secara otomatis, sehingga pelanggan lain bisa langsung memilih dan memesan jam ini.
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1.5 font-medium">
                Alasan Pelepasan Slot
              </label>
              <select
                value={releaseReason}
                onChange={(e) => setReleaseReason(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400 mb-2 cursor-pointer"
              >
                <option value="Pelanggan no-show setelah dikonfirmasi via WA" className="bg-[#0e0e18]">
                  Pelanggan no-show setelah dikonfirmasi via WA
                </option>
                <option value="Pelanggan membatalkan reservasi" className="bg-[#0e0e18]">
                  Pelanggan membatalkan reservasi
                </option>
                <option value="Jadwal dialihkan / ganti hari" className="bg-[#0e0e18]">
                  Jadwal dialihkan / ganti hari
                </option>
                <option value="Kendala operasional cabang" className="bg-[#0e0e18]">
                  Kendala operasional cabang
                </option>
                <option value="Lainnya" className="bg-[#0e0e18]">
                  Alasan lain
                </option>
              </select>
              {releaseReason === 'Lainnya' && (
                <input
                  type="text"
                  placeholder="Ketik alasan kustom..."
                  onChange={(e) => setReleaseReason(e.target.value)}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setReleaseTarget(null)}
                disabled={isSubmittingAction}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReleaseSlot}
                disabled={isSubmittingAction}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/20"
              >
                {isSubmittingAction ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Lepas Slot Sekarang</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
