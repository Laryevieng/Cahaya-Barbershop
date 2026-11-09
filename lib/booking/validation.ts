import { BRANCHES_DATA, SERVICES_DATA, BARBERS_DATA, TIME_SLOTS } from '@/data';
import {
  isDateInCurrentMonth,
  isDateInPast,
  isTimeInPastToday,
  timeToMinutes,
} from '@/lib/date';
import type { BookingMode } from '@/types/barbershop';

export function normalizePhone(raw: string): string {
  let cleaned = (raw || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function isValidPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  return normalized.length >= 10 && normalized.length <= 15;
}

export function isValidCustomerName(name: string): boolean {
  const trimmed = (name || '').trim();
  return trimmed.length >= 2 && trimmed.length <= 80;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export function validateBookingInput(params: {
  branchId: string;
  serviceId: string;
  barberId: string;
  chairId: string | null;
  date: string;
  time: string;
  name: string;
  phone: string;
  mode?: BookingMode;
}): ValidationResult {
  const { branchId, serviceId, barberId, chairId, date, time, name, phone } = params;

  if (!isValidCustomerName(name)) {
    return {
      valid: false,
      code: 'NAME_INVALID',
      error: 'Nama pemesan minimal 2 karakter dan maksimal 80 karakter.',
    };
  }

  if (!isValidPhone(phone)) {
    return {
      valid: false,
      code: 'PHONE_INVALID',
      error: 'Nomor WhatsApp tidak valid. Gunakan format contoh 081234567890.',
    };
  }

  const branch = BRANCHES_DATA.find((b) => b.id === branchId);
  if (!branch) {
    return {
      valid: false,
      code: 'BRANCH_NOT_FOUND',
      error: 'Cabang yang dipilih tidak terdaftar.',
    };
  }

  const isCustomLook = serviceId === 'custom-look';
  const service = isCustomLook
    ? null
    : SERVICES_DATA.find((s) => s.id === serviceId);

  if (!isCustomLook && !service) {
    return {
      valid: false,
      code: 'SERVICE_NOT_FOUND',
      error: 'Layanan yang dipilih tidak ditemukan.',
    };
  }

  const mode: BookingMode = isCustomLook
    ? 'consultation'
    : service?.bookingMode ?? 'chair';

  if (barberId !== 'any') {
    const barber = BARBERS_DATA.find((b) => String(b.id) === barberId);
    if (!barber) {
      return {
        valid: false,
        code: 'BARBER_NOT_FOUND',
        error: 'Barber yang dipilih tidak ditemukan.',
      };
    }
  }

  if (!date || !isDateInCurrentMonth(date)) {
    return {
      valid: false,
      code: 'INVALID_DATE',
      error: 'Pemesanan hanya tersedia untuk tanggal di bulan berjalan ini.',
    };
  }

  if (isDateInPast(date)) {
    return {
      valid: false,
      code: 'DATE_IN_PAST',
      error: 'Tanggal yang dipilih sudah lewat.',
    };
  }

  if (!time || !TIME_SLOTS.includes(time)) {
    return {
      valid: false,
      code: 'OUTSIDE_HOURS',
      error: 'Jam pemesanan tidak valid.',
    };
  }

  if (isTimeInPastToday(date, time)) {
    return {
      valid: false,
      code: 'TIME_IN_PAST',
      error: 'Jam yang dipilih sudah lewat untuk hari ini.',
    };
  }

  const durationMin = isCustomLook ? 60 : service?.durationMinutes ?? 30;
  const startMinutes = timeToMinutes(time);
  const endMinutes = startMinutes + durationMin;
  const closeMinutes = timeToMinutes('21:00');

  if (endMinutes > closeMinutes) {
    return {
      valid: false,
      code: 'OUTSIDE_HOURS',
      error: 'Durasi layanan melebihi jam operasional tutup (21:00 WIB).',
    };
  }

  if (mode === 'chair') {
    if (!chairId || !chairId.trim()) {
      return {
        valid: false,
        code: 'CHAIR_REQUIRED',
        error: 'Silakan pilih salah satu kursi yang tersedia.',
      };
    }

    if (!chairId.startsWith(`${branchId}-chair-`)) {
      return {
        valid: false,
        code: 'CHAIR_BRANCH_MISMATCH',
        error: 'Kursi yang dipilih tidak sesuai dengan cabang ini.',
      };
    }
  }

  return { valid: true };
}
