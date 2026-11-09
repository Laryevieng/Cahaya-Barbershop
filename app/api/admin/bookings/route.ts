import { NextResponse } from 'next/server';
import { isCurrentUserAdmin } from '@/lib/admin/auth';
import { getCurrentMonthBounds, getNowLocalParts } from '@/lib/date';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Tidak memiliki izin akses.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const currentMonth = getCurrentMonthBounds().monthISO;
  const month = searchParams.get('month') || currentMonth;

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: 'Format bulan tidak valid. Gunakan format YYYY-MM.' },
      { status: 400 }
    );
  }

  const [yearStr, monthStr] = month.split('-');
  const year = Number(yearStr);
  const monthNum = Number(monthStr);
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const startISO = `${month}-01`;
  const endISO = `${month}-${String(daysInMonth).padStart(2, '0')}`;

  const supabase = getSupabaseAdmin();

  // Expire stale bookings
  try {
    await supabase.rpc('expire_stale_bookings');
  } catch (err) {
    console.error('Error expiring stale bookings in admin GET:', err);
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      branches (name, short_name),
      services (name),
      barbers (name),
      chairs (label)
    `)
    .gte('booking_date', startISO)
    .lte('booking_date', endISO)
    .order('booking_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Admin fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data booking dari database.' },
      { status: 500 }
    );
  }

  const bookings = data || [];
  const todayISO = getNowLocalParts().dateISO;

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    expired: bookings.filter((b) => b.status === 'expired').length,
    today: bookings.filter((b) => b.booking_date === todayISO).length,
  };

  return NextResponse.json({
    month,
    stats,
    bookings,
  });
}
