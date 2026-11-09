import { redirect } from 'next/navigation';
import { isCurrentUserAdmin } from '@/lib/admin/auth';
import { getCurrentMonthBounds, getNowLocalParts } from '@/lib/date';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import type { AdminBooking } from '@/types/barbershop';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  const { monthISO, startISO, endISO } = getCurrentMonthBounds();
  const supabase = getSupabaseAdmin();

  // Expire stale bookings
  try {
    await supabase.rpc('expire_stale_bookings');
  } catch (err) {
    console.error('Error running expire_stale_bookings on page load:', err);
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
    console.error('Failed to load initial admin bookings:', error);
  }

  const bookings = (data || []) as AdminBooking[];
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

  return (
    <main className="min-h-screen py-6">
      <AdminDashboard
        initialBookings={bookings}
        initialMonth={monthISO}
        initialStats={stats}
      />
    </main>
  );
}
