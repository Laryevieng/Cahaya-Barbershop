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
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

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

  const currentSlotSelectionRef = useRef({ time: draft.time, chairId: draft.chairId });
  useEffect(() => {
    currentSlotSelectionRef.current = { time: draft.time, chairId: draft.chairId };
  }, [draft.time, draft.chairId]);

  const setFieldRef = useRef(setField);
  useEffect(() => {
    setFieldRef.current = setField;
  }, [setField]);

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
          throw new Error(errData.error || 'Gagal memuat ketersediaan jadwal');
        }

        const data: AvailabilityResponse = await res.json();
        if (!ignore) {
          setAvailability(data);

          const { time, chairId } = currentSlotSelectionRef.current;

          const currentSlot = data.slots.find((s) => s.time === time);
          if (!currentSlot?.available) {
            const firstAvailable = data.slots.find((s) => s.available);
            if (firstAvailable) {
              setFieldRef.current('time', firstAvailable.time);
            }
          }

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

  const handleBranchSelect = (branchId: string) => {
    setField('branchId', branchId);
    setField('chairId', null);
  };

  const handleServiceSelect = (selection: BookingDraft['service']) => {
    setField('service', selection);
    setField('chairId', null);
  };

  const handleBarberSelect = (barberId: string) => {
    setField('barberId', barberId);
    setField('chairId', null);
  };

  const handleTimeSelect = (time: string) => {
    setField('time', time);
    setField('chairId', null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

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
      className="py-24 bg-[#0f1115] text-[#f1f1ed] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#f1f1ed] font-serif">
            Reservasi Kursi & Jadwal Cukur
          </h2>

          <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
            Sistem ketersediaan real-time untuk 3 cabang di Kuningan. Pilih cabang, layanan, kapster, dan kursi yang Anda kehendaki. Kursi yang dipilih akan diamankan langsung di sistem selama 24 jam.
          </p>
        </div>

        <form
          onSubmit={handleSubmitBooking}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Kolom 1: Pilih Cabang & Ketentuan */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[#181b22] border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d1d5db] block flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>Pilih Cabang Barbershop</span>
                </label>
                <span className="text-[11px] text-[#9ca3af]">
                  3 lokasi strategis di Kabupaten Kuningan
                </span>
              </div>

              <div className="space-y-2.5">
                {BRANCHES_DATA.map((branch) => {
                  const isSelected = draft.branchId === branch.id;

                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => handleBranchSelect(branch.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition relative cursor-pointer ${
                        isSelected
                          ? 'bg-[#c89b3c]/15 border-[#c89b3c]'
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
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#c89b3c]/20 text-[#c89b3c] border border-[#c89b3c]/30">
                                UTAMA
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#9ca3af] mt-1 line-clamp-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0 text-[#c89b3c]" />
                            <span>{branch.address}</span>
                          </p>
                          <p className="text-[10px] text-[#9ca3af]/80 mt-1">
                            {branch.hours} · 3 Kursi
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#c89b3c] text-[#0f1115] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#181b22] border border-white/10 rounded-2xl p-5 space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d1d5db] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Aturan Reservasi Online</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#c89b3c]/15 text-[#c89b3c] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-[#9ca3af] leading-relaxed">
                    <strong className="text-white">Pilih Kursi Fisik:</strong> Tiap cabang memiliki tepat 3 kursi yang dapat dipilih secara manual sesuai jadwal.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#c89b3c]/15 text-[#c89b3c] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-[#9ca3af] leading-relaxed">
                    <strong className="text-white">Batas Waktu 24 Jam:</strong> Booking yang berstatus pending akan otomatis kedaluwarsa setelah 24 jam bila belum dikonfirmasi via WhatsApp.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#c89b3c]/15 text-[#c89b3c] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-[#9ca3af] leading-relaxed">
                    <strong className="text-white">Bulan Berjalan:</strong> Reservasi dibuka khusus untuk tanggal-tanggal di bulan berjalan ini agar akurasi jadwal kapster terjaga.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 2: Layanan, Barber & Data Pemesan */}
          <div className="lg:col-span-5 bg-[#181b22] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6">
            <ServiceCarousel
              selectedService={draft.service}
              onSelect={handleServiceSelect}
            />

            <BarberCarousel
              selectedBarberId={draft.barberId}
              onSelect={handleBarberSelect}
            />

            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#d1d5db] block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>3. Data Pemesan</span>
              </label>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="block text-[11px] text-[#9ca3af] mb-1"
                  >
                    Nama Lengkap <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9ca3af]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-name"
                      type="text"
                      value={draft.name}
                      onChange={(e) => setField('name', e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0f1115] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c89b3c]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="block text-[11px] text-[#9ca3af] mb-1"
                  >
                    Nomor WhatsApp <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#9ca3af]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-phone"
                      type="tel"
                      value={draft.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      placeholder="Contoh: 081234567890"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0f1115] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c89b3c]"
                    />
                  </div>
                  <span className="text-[10px] text-[#9ca3af] block mt-1">
                    Digunakan untuk pengiriman konfirmasi dan notifikasi jadwal.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="customer-notes"
                    className="block text-[11px] text-[#9ca3af] mb-1"
                  >
                    Catatan Khusus (Opsional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-[#9ca3af]/40 absolute left-3 top-3" />
                    <textarea
                      id="customer-notes"
                      rows={2}
                      value={draft.notes}
                      onChange={(e) => setField('notes', e.target.value)}
                      placeholder="Contoh: Fade tipis samping, bawa anak kecil, dsb."
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0f1115] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c89b3c]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 3: Jadwal, Kursi & Tiket */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-[#181b22] border border-white/10 rounded-2xl p-5 space-y-5">
              <DateStrip
                selectedDate={draft.date}
                today={today}
                onSelectDate={(newDate) => {
                  setField('date', newDate);
                  setField('chairId', null);
                }}
              />

              <TimeGrid
                selectedTime={draft.time}
                availability={availability}
                loading={loadingAvailability}
                onSelectTime={handleTimeSelect}
              />

              <ChairSelector
                branchId={draft.branchId}
                selectedChairId={draft.chairId}
                selectedTime={draft.time}
                mode={mode}
                availability={availability}
                onSelectChair={(chairId) => setField('chairId', chairId)}
              />

              {availabilityError && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{availabilityError}</span>
                </div>
              )}

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="p-3.5 bg-[#0f1115] border border-white/10 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#9ca3af]">
                  <span>Cabang:</span>
                  <span className="font-semibold text-white">{selectedBranch.shortName}</span>
                </div>
                <div className="flex items-center justify-between text-[#9ca3af]">
                  <span>Waktu:</span>
                  <span className="font-semibold text-white">
                    {draft.time} WIB ({currentServiceItem?.durationMinutes ?? 45}m)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#9ca3af]">
                  <span>Kursi:</span>
                  <span className="font-semibold text-[#c89b3c]">
                    {draft.chairId
                      ? draft.chairId.replace(`${draft.branchId}-chair-`, 'Kursi ')
                      : mode === 'consultation'
                      ? 'Konsultasi'
                      : 'Belum Dipilih'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-sm font-bold text-white">
                  <span>Estimasi:</span>
                  <span className="font-mono text-[#c89b3c]">{priceFormatted}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || (mode === 'chair' && !draft.chairId)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#c89b3c] hover:bg-[#b5892f] text-[#0f1115] flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#c89b3c]/15 cursor-pointer"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#0f1115]/30 border-t-[#0f1115] rounded-full animate-spin" />
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

              <p className="text-[10px] text-[#9ca3af] text-center leading-relaxed">
                Slot kursi Anda akan diamankan di sistem selama 24 jam. Staf kami akan mengirim konfirmasi melalui WhatsApp.
              </p>
            </div>
          </div>
        </form>
      </div>

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
