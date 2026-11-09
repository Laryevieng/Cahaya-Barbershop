import { NextResponse } from 'next/server';
import { computeAvailability } from '@/lib/booking/availability';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const barberId = searchParams.get('barberId') || 'any';

    if (!branchId || !date || !serviceId) {
      return NextResponse.json(
        { error: 'Parameter branchId, date, dan serviceId wajib diisi.' },
        { status: 400 }
      );
    }

    const availability = await computeAvailability({
      branchId,
      date,
      serviceId,
      barberId,
    });

    return NextResponse.json(availability, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal memeriksa ketersediaan slot.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
