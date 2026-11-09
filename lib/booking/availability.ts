import 'server-only';
import { BRANCHES_DATA, SERVICES_DATA, TIME_SLOTS } from '@/data';
import {
  isDateInCurrentMonth,
  isDateInPast,
  isTimeInPastToday,
  timeToMinutes,
} from '@/lib/date';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type {
  AvailabilityResponse,
  AvailabilitySlot,
  BookingMode,
  Chair,
  SlotUnavailableReason,
} from '@/types/barbershop';

interface ComputeAvailabilityParams {
  branchId: string;
  date: string;
  serviceId: string;
  barberId: string;
}

export async function computeAvailability(
  params: ComputeAvailabilityParams
): Promise<AvailabilityResponse> {
  const { branchId, date, serviceId, barberId } = params;

  const branch = BRANCHES_DATA.find((b) => b.id === branchId);
  if (!branch) {
    throw new Error('Cabang tidak ditemukan');
  }

  const isCustomLook = serviceId === 'custom-look';
  const service = isCustomLook
    ? null
    : SERVICES_DATA.find((s) => s.id === serviceId);

  if (!isCustomLook && !service) {
    throw new Error('Layanan tidak ditemukan');
  }

  const mode: BookingMode = isCustomLook
    ? 'consultation'
    : service?.bookingMode ?? 'chair';

  const durationMin = isCustomLook ? 60 : service?.durationMinutes ?? 30;

  if (!date || !isDateInCurrentMonth(date)) {
    throw new Error('Tanggal harus berada dalam bulan berjalan');
  }

  if (isDateInPast(date)) {
    throw new Error('Tanggal yang dipilih sudah lewat');
  }

  const supabase = getSupabaseAdmin();

  // Expire overdue bookings before calculating available slots
  try {
    await supabase.rpc('expire_stale_bookings');
  } catch (err) {
    console.error('Failed to run expire_stale_bookings during availability check:', err);
  }

  // Fetch exactly the chairs of this branch
  const { data: chairsData, error: chairsError } = await supabase
    .from('chairs')
    .select('id, label, sort_order')
    .eq('branch_id', branchId)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (chairsError || !chairsData) {
    throw new Error('Gagal memuat data kursi cabang');
  }

  const chairs: Chair[] = chairsData.map((c) => ({
    id: c.id,
    label: c.label,
  }));

  // Fetch active bookings for this branch and date
  const { data: bookingsData, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, chair_id, barber_id, start_time, end_time, status')
    .eq('branch_id', branchId)
    .eq('booking_date', date)
    .in('status', ['pending', 'confirmed']);

  if (bookingsError) {
    throw new Error('Gagal memuat jadwal booking aktif');
  }

  const activeBookings = (bookingsData || []).map((b) => ({
    chairId: b.chair_id as string | null,
    barberId: b.barber_id as number | null,
    startMinutes: timeToMinutes(b.start_time),
    endMinutes: timeToMinutes(b.end_time),
  }));

  const closeMinutes = timeToMinutes('21:00');
  const targetBarberId = barberId !== 'any' ? Number(barberId) : null;

  const slots: AvailabilitySlot[] = TIME_SLOTS.map((time) => {
    const startMinutes = timeToMinutes(time);
    const endMinutes = startMinutes + durationMin;

    if (endMinutes > closeMinutes) {
      return {
        time,
        available: false,
        reason: 'outside_hours',
        chairs: chairs.map((c) => ({ ...c, available: false })),
      };
    }

    if (isTimeInPastToday(date, time)) {
      return {
        time,
        available: false,
        reason: 'past',
        chairs: chairs.map((c) => ({ ...c, available: false })),
      };
    }

    // Check if the selected barber is already committed during this range
    const barberBusy =
      targetBarberId !== null &&
      activeBookings.some(
        (b) =>
          b.barberId === targetBarberId &&
          Math.max(startMinutes, b.startMinutes) < Math.min(endMinutes, b.endMinutes)
      );

    // Compute availability for each chair
    const chairStatuses = chairs.map((chair) => {
      const isOccupied = activeBookings.some(
        (b) =>
          b.chairId === chair.id &&
          Math.max(startMinutes, b.startMinutes) < Math.min(endMinutes, b.endMinutes)
      );
      const isAvailable = !isOccupied && !barberBusy;
      return {
        ...chair,
        available: isAvailable,
      };
    });

    if (mode === 'consultation') {
      const isAvailable = !barberBusy;
      let reason: SlotUnavailableReason | undefined = undefined;
      if (!isAvailable) {
        reason = 'barber_busy';
      }
      return {
        time,
        available: isAvailable,
        reason,
        chairs: [],
      };
    }

    const anyChairAvailable = chairStatuses.some((c) => c.available);
    let reason: SlotUnavailableReason | undefined = undefined;

    if (!anyChairAvailable) {
      if (barberBusy) {
        reason = 'barber_busy';
      } else {
        reason = 'full';
      }
    }

    return {
      time,
      available: anyChairAvailable,
      reason,
      chairs: chairStatuses,
    };
  });

  return {
    branchId,
    date,
    serviceId,
    mode,
    chairs: mode === 'consultation' ? [] : chairs,
    slots,
  };
}
