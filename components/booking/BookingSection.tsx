'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Building2,
  Phone,
  User,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Armchair,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { SERVICES_DATA, BRANCHES_DATA } from '@/data';
import { formatServicePrice } from '@/lib/format';
import type {
  BookingDraft,
  BookingMode,
  PublicBooking,
  AvailabilityResponse,
} from '@/types/barbershop';

import ServiceCarousel from './ServiceCarousel';
import BarberCarousel from './BarberCarousel';
import DateStrip from './DateStrip';
import TimeGrid from './TimeGrid';
import ChairSelector from './ChairSelector';
import BookingSuccessModal from './BookingSuccessModal';

interface BookingSectionProps {
  draft: BookingDraft;
  today: string;
  setField: <K extends keyof BookingDraft>(field: K, value: BookingDraft[K]) => void;
  onReset?: () => void;
}

export default function BookingSection({
  draft,
  today,
  setField,
  onReset,
}: BookingSectionProps) {
  // Availability state
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<PublicBooking | null>(null);

  const selectedServiceId =
    draft.service.kind === 'catalog' ? draft.service.id : 'custom-look';

  const currentServiceItem = useMemo(() => {
    if (draft.service.kind === 'catalog') {
      const catalogId = draft.service.id;
      return SERVICES_DATA.find((s) => s.id === catalogId);
    }
    return null;
  }, [draft.service]);

  const mode: BookingMode = useMemo(() => {
    if (draft.service.kind === 'custom') return 'consultation';
    return currentServiceItem?.bookingMode ?? 'chair';
  }, [draft.service, currentServiceItem]);

  // Keep stable refs for slot auto-adjustment without triggering re-fetch
  const currentSlotSelectionRef = useRef({ time: draft.time, chairId: draft.chairId });
  useEffect(() => {
    currentSlotSelectionRef.current = { time: draft.time, chairId: draft.chairId };
  }, [draft.time, draft.chairId]);

  const setFieldRef = useRef(setField);
  useEffect(() => {
    setFieldRef.current = setField;
  }, [setField]);

  // Fetch live availability whenever branch, date, service, or barber changes
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function fetchAvailability() {
      setLoadingAvailability(true);
      setAvailabilityError(null);

      try {
        const query = new URLSearchParams({
          branchId: draft.branchId,
          date: draft.date,
          serviceId: selectedServiceId,
          barberId: draft.barberId,
        });

        const res = await fetch(`/api/availability?${query.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Gagal memuat ketersediaan');
        }

        const data: AvailabilityResponse = await res.json();
        if (!ignore) {
          setAvailability(data);

          const { time, chairId } = currentSlotSelectionRef.current;

          // Check if currently selected time is valid
          const currentSlot = data.slots.find((s) => s.time === time);
          if (!currentSlot?.available) {
            const firstAvailable = data.slots.find((s) => s.available);
            if (firstAvailable) {
              setFieldRef.current('time', firstAvailable.time);
            }
          }

          // If current chair is occupied at this time, reset chair selection
          if (chairId && currentSlot) {
            const chairStatus = currentSlot.chairs.find((c) => c.id === chairId);
            if (!chairStatus?.available) {
              setFieldRef.current('chairId', null);
            }
          }
        }
      } catch (err: unknown) {
        if (!ignore && (err as Error).name !== 'AbortError') {
          setAvailabilityError((err as Error).message || 'Gagal mengecek jadwal');
        }
      } finally {
        if (!ignore) {
          setLoadingAvailability(false);
        }
      }
    }

    fetchAvailability();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [draft.branchId, draft.date, selectedServiceId, draft.barberId]);

  // Handle branch change: clear chair
  const handleBranchSelect = (branchId: string) => {
    setField('branchId', branchId);
    setField('chairId', null);
  };

  // Handle service change: clear chair
  const handleServiceSelect = (selection: BookingDraft['service']) => {
    setField('service', selection);
    setField('chairId', null);
  };

  // Handle barber change: clear chair
  const handleBarberSelect = (barberId: string) => {
    setField('barberId', barberId);
    setField('chairId', null);
  };

  // Handle time change: clear chair
  const handleTimeSelect = (time: string) => {
    setField('time', time);
    setField('chairId', null);
  };

  // Handle form submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Basic frontend checks
    if (!draft.name.trim()) {
      setSubmitError('Nama pemesan harus diisi.');
      return;
    }
    if (!draft.phone.trim()) {
      setSubmitError('Nomor WhatsApp harus diisi.');
      return;
    }
    if (mode === 'chair' && !draft.chairId) {
      setSubmitError('Silakan pilih salah satu kursi yang tersedia di kolom jadwal.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        branchId: draft.branchId,
        serviceId: selectedServiceId,
        barberId: draft.barberId,
        chairId: mode === 'chair' ? draft.chairId : null,
        date: draft.date,
        time: draft.time,
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        notes: draft.notes.trim() || undefined,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || data.code === 'SLOT_TAKEN') {
          setSubmitError(
            'Slot kursi pada jam ini baru saja diambil pelanggan lain. Silakan pilih kursi atau jam lainnya.'
          );
          setField('chairId', null);
        } else {
          setSubmitError(data.error || 'Gagal memproses booking. Silakan coba lagi.');
        }
        setSubmitting(false);
        return;
      }

      setCreatedBooking(data.booking);
    } catch {
      setSubmitError('Terjadi kendala koneksi ke server. Silakan coba beberapa saat lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBranch =
    BRANCHES_DATA.find((b) => b.id === draft.branchId) || BRANCHES_DATA[0];

  const priceFormatted = currentServiceItem
    ? formatServicePrice(currentServiceItem)
    : draft.service.kind === 'custom'
    ? 'Konsultasi (Mulai Rp 0)'
    : 'Rp 45.000';

  return (
    <section
      id="booking"
      className="py-20 sm:py-24 bg-[#050505] text-[#ededed] relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1e5eff]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#1e5eff]/10 border border-[#1e5eff]/30 text-[#1e5eff]">
            <Armchair className="w-3.5 h-3.5" />
            <span>Booking Online · 3 Cabang · 3 Kursi Per Cabang</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-serif">
            Pilih Kursi,{' '}
            <span className="text-[#1e5eff] italic">Amankan Jadwal.</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Sistem reservasi real-time Cahaya Barbershop. Setiap cabang memiliki 3 kursi khusus. Pilih cabang, layanan, dan barber pilihan Anda, lalu kunci kursi dan jam kunjungan. Slot otomatis kedaluwarsa setelah 24 jam bila belum dikonfirmasi.
          </p>
        </div>

        {/* 3-Column Layout Grid */}
        <form
          onSubmit={handleSubmitBooking}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >
          {/* ============================================================== */}
          {/* KOLOM 1: INFO, PILIH CABANG & LANGKAH OPERASIONAL (lg:col-span-4) */}
          {/* ============================================================== */}
          <div className="lg:col-span-4 space-y-5">
            {/* Cabang Selector Card */}
            <div className="bg-[#0c0c14] border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#1e5eff]" />
                  <span>Pilih Cabang Barbershop</span>
                </label>
                <span className="text-[11px] text-white/40">
                  3 lokasi strategis di Kabupaten Kuningan
                </span>
              </div>

              <div className="space-y-2">
                {BRANCHES_DATA.map((branch) => {
                  const isSelected = draft.branchId === branch.id;

                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => handleBranchSelect(branch.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition relative cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e5eff]/15 border-[#1e5eff] shadow-lg shadow-[#1e5eff]/15'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {branch.name}
                            </span>
                            {branch.isMain && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#1e5eff]/20 text-[#82aaff] border border-[#1e5eff]/30">
                                UTAMA
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/50 mt-1 line-clamp-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0 text-[#1e5eff]" />
                            <span>{branch.address}</span>
                          </p>
                          <p className="text-[10px] text-white/40 mt-1">
                            {branch.hours} · 3 Kursi
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#1e5eff] text-white flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prosedur & Aturan Reservasi */}
            <div className="bg-[#0c0c14] border border-white/10 rounded-2xl p-5 space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1e5eff]" />
                <span>Aturan Reservasi Online</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1e5eff]/15 text-[#1e5eff] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    <strong className="text-white">Pilih Kursi Fisik:</strong> Tiap cabang memiliki tepat 3 kursi yang dapat dipilih secara manual sesuai jadwal.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1e5eff]/15 text-[#1e5eff] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    <strong className="text-white">Batas Waktu 24 Jam:</strong> Booking yang berstatus pending akan otomatis kedaluwarsa setelah 24 jam bila belum dikonfirmasi via WhatsApp.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1e5eff]/15 text-[#1e5eff] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    <strong className="text-white">Bulan Berjalan:</strong> Reservasi dibuka khusus untuk tanggal-tanggal di bulan berjalan ini agar akurasi rotasi kapster terjaga.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* KOLOM 2: PILIHAN LAYANAN, BARBER & IDENTITAS (lg:col-span-5)  */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 bg-[#0c0c14] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
            {/* Service Carousel */}
            <ServiceCarousel
              selectedService={draft.service}
              onSelect={handleServiceSelect}
            />

            {/* Barber Carousel */}
            <BarberCarousel
              selectedBarberId={draft.barberId}
              onSelect={handleBarberSelect}
            />

            {/* Customer Contact Form */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1e5eff]" />
                <span>3. Data Pemesan</span>
              </label>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="block text-[11px] text-white/60 mb-1"
                  >
                    Nama Lengkap <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-name"
                      type="text"
                      value={draft.name}
                      onChange={(e) => setField('name', e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#1e5eff]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="block text-[11px] text-white/60 mb-1"
                  >
                    Nomor WhatsApp <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-phone"
                      type="tel"
                      value={draft.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      placeholder="Contoh: 081234567890"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#1e5eff]"
                    />
                  </div>
                  <span className="text-[10px] text-white/40 block mt-1">
                    Digunakan untuk pengiriman konfirmasi dan notifikasi jadwal.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="customer-notes"
                    className="block text-[11px] text-white/60 mb-1"
                  >
                    Catatan Khusus (Opsional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                    <textarea
                      id="customer-notes"
                      rows={2}
                      value={draft.notes}
                      onChange={(e) => setField('notes', e.target.value)}
                      placeholder="Contoh: Ingin fade tipis samping, bawa anak kecil, dsb."
                      className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#1e5eff]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* KOLOM 3: JADWAL, KURSI & TIKET SUBMIT (lg:col-span-3)          */}
          {/* ============================================================== */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-[#0c0c14] border border-white/10 rounded-2xl p-5 space-y-5">
              {/* Date Strip */}
              <DateStrip
                selectedDate={draft.date}
                today={today}
                onSelectDate={(newDate) => {
                  setField('date', newDate);
                  setField('chairId', null);
                }}
              />

              {/* Time Slots Grid */}
              <TimeGrid
                selectedTime={draft.time}
                availability={availability}
                loading={loadingAvailability}
                onSelectTime={handleTimeSelect}
              />

              {/* Chair Selector */}
              <ChairSelector
                branchId={draft.branchId}
                selectedChairId={draft.chairId}
                selectedTime={draft.time}
                mode={mode}
                availability={availability}
                onSelectChair={(chairId) => setField('chairId', chairId)}
              />

              {/* Availability Error Notice */}
              {availabilityError && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{availabilityError}</span>
                </div>
              )}

              {/* Error Feedback */}
              {submitError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Booking Summary Box */}
              <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-white/60">
                  <span>Cabang:</span>
                  <span className="font-semibold text-white">{selectedBranch.shortName}</span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span>Waktu:</span>
                  <span className="font-semibold text-white">
                    {draft.time} WIB ({currentServiceItem?.durationMinutes ?? 45}m)
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span>Kursi:</span>
                  <span className="font-semibold text-[#1e5eff]">
                    {draft.chairId
                      ? draft.chairId.replace(`${draft.branchId}-chair-`, 'Kursi ')
                      : mode === 'consultation'
                      ? 'Konsultasi'
                      : 'Belum Dipilih'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-sm font-bold text-white">
                  <span>Estimasi:</span>
                  <span className="font-mono text-[#1e5eff]">{priceFormatted}</span>
                </div>
              </div>

              {/* CTA Submit Button */}
              <button
                type="submit"
                disabled={submitting || (mode === 'chair' && !draft.chairId)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#1e5eff] hover:bg-[#1a4ecc] text-white flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#1e5eff]/25 cursor-pointer"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'consultation'
                        ? 'Kirim Permintaan Konsultasi'
                        : 'Kunci Kursi & Buat Booking'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-white/40 text-center leading-relaxed">
                Slot kursi Anda akan diamankan di database selama 24 jam. Staf kami akan mengirim konfirmasi melalui WhatsApp.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {createdBooking && (
          <BookingSuccessModal
            booking={createdBooking}
            onClose={() => setCreatedBooking(null)}
            onReset={() => {
              if (onReset) onReset();
              setField('chairId', null);
              setCreatedBooking(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
