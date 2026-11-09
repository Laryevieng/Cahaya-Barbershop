import { NextResponse } from 'next/server';
import { validateBookingInput } from '@/lib/booking/validation';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const RPC_ERROR_MAP: Record<string, { status: number; message: string }> = {
  SLOT_TAKEN: {
    status: 409,
    message: 'Slot ini baru saja diambil pelanggan lain. Silakan pilih jam atau kursi lain.',
  },
  INVALID_DATE: {
    status: 400,
    message: 'Pemesanan hanya tersedia untuk tanggal di bulan berjalan ini.',
  },
  DATE_IN_PAST: {
    status: 400,
    message: 'Tanggal yang dipilih sudah lewat.',
  },
  TIME_IN_PAST: {
    status: 400,
    message: 'Jam yang dipilih sudah lewat untuk hari ini.',
  },
  OUTSIDE_HOURS: {
    status: 400,
    message: 'Jam atau durasi layanan berada di luar jam operasional (10:00 - 21:00 WIB).',
  },
  CHAIR_REQUIRED: {
    status: 400,
    message: 'Silakan pilih salah satu kursi yang tersedia.',
  },
  CHAIR_NOT_FOUND: {
    status: 400,
    message: 'Kursi yang dipilih tidak ditemukan.',
  },
  CHAIR_BRANCH_MISMATCH: {
    status: 400,
    message: 'Kursi tidak sesuai dengan cabang yang dipilih.',
  },
  BARBER_NOT_FOUND: {
    status: 400,
    message: 'Barber yang dipilih tidak ditemukan.',
  },
  SERVICE_NOT_FOUND: {
    status: 400,
    message: 'Layanan yang dipilih tidak ditemukan.',
  },
  BRANCH_NOT_FOUND: {
    status: 400,
    message: 'Cabang yang dipilih tidak ditemukan.',
  },
  PHONE_INVALID: {
    status: 400,
    message: 'Nomor WhatsApp tidak valid. Pastikan nomor aktif (contoh 081234567890).',
  },
  NAME_INVALID: {
    status: 400,
    message: 'Nama pemesan minimal 2 karakter.',
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      branchId,
      serviceId,
      barberId = 'any',
      chairId = null,
      date,
      time,
      name,
      phone,
      notes = '',
    } = body || {};

    const validation = validateBookingInput({
      branchId,
      serviceId,
      barberId,
      chairId,
      date,
      time,
      name,
      phone,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, code: validation.code },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const formattedTime = time.length === 5 ? `${time}:00` : time;
    const targetBarberId = barberId === 'any' ? null : Number(barberId);

    const { data, error } = await supabase.rpc('create_booking', {
      p_branch_id: branchId,
      p_service_id: serviceId,
      p_barber_id: targetBarberId,
      p_chair_id: chairId || null,
      p_booking_date: date,
      p_start_time: formattedTime,
      p_customer_name: name.trim(),
      p_customer_phone: phone.trim(),
      p_notes: notes?.trim() || null,
    });

    if (error) {
      const matched = RPC_ERROR_MAP[error.message];
      if (matched) {
        return NextResponse.json(
          { error: matched.message, code: error.message },
          { status: matched.status }
        );
      }

      if (error.code === 'P0001' || error.message.includes('SLOT_TAKEN')) {
        return NextResponse.json(
          {
            error: RPC_ERROR_MAP.SLOT_TAKEN.message,
            code: 'SLOT_TAKEN',
          },
          { status: 409 }
        );
      }

      console.error('Supabase create_booking error:', error);
      return NextResponse.json(
        { error: 'Terjadi kendala saat memproses booking. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ booking: data }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Permintaan booking tidak dapat diproses.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
