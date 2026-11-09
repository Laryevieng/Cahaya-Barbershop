import { NextResponse } from 'next/server';
import { isCurrentUserAdmin } from '@/lib/admin/auth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Tidak memiliki izin akses.' }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'ID booking tidak valid.' }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { action, reason = '' } = body || {};

    if (!['confirm', 'complete', 'cancel', 'reopen'].includes(action)) {
      return NextResponse.json(
        { error: 'Aksi admin tidak valid (pilihan: confirm, complete, cancel, reopen).' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check existing booking
    const { data: existing, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Booking tidak ditemukan.' },
        { status: 404 }
      );
    }

    const nowISO = new Date().toISOString();
    let updates: Record<string, unknown> = {};
    let eventAction = '';
    let eventNote = '';

    if (action === 'confirm') {
      if (existing.status !== 'pending') {
        return NextResponse.json(
          { error: `Hanya booking berstatus pending yang dapat dikonfirmasi (status saat ini: ${existing.status}).` },
          { status: 400 }
        );
      }
      updates = {
        status: 'confirmed',
        confirmed_at: nowISO,
        expires_at: null,
      };
      eventAction = 'confirmed';
      eventNote = 'Dikonfirmasi oleh admin via dashboard';
    } else if (action === 'complete') {
      if (existing.status !== 'confirmed') {
        return NextResponse.json(
          { error: `Hanya booking berstatus confirmed yang dapat diselesaikan (status saat ini: ${existing.status}).` },
          { status: 400 }
        );
      }
      updates = {
        status: 'completed',
        completed_at: nowISO,
      };
      eventAction = 'completed';
      eventNote = 'Layanan selesai dikerjakan';
    } else if (action === 'cancel') {
      if (!['pending', 'confirmed'].includes(existing.status)) {
        return NextResponse.json(
          { error: `Booking berstatus ${existing.status} tidak dapat dibatalkan lagi.` },
          { status: 400 }
        );
      }
      const cancelReason = reason.trim() || 'Dilepas oleh admin (no-show / pembatalan slot)';
      updates = {
        status: 'cancelled',
        cancelled_at: nowISO,
        cancel_reason: cancelReason,
      };
      eventAction = 'cancelled';
      eventNote = cancelReason;
    } else if (action === 'reopen') {
      if (!['cancelled', 'expired'].includes(existing.status)) {
        return NextResponse.json(
          { error: `Hanya booking yang dibatalkan atau kedaluwarsa yang dapat dibuka kembali.` },
          { status: 400 }
        );
      }
      const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      updates = {
        status: 'pending',
        expires_at: expiresAt,
        cancelled_at: null,
        cancel_reason: null,
        completed_at: null,
      };
      eventAction = 'reopened';
      eventNote = 'Dibuka kembali oleh admin';
    }

    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        branches (name, short_name),
        services (name),
        barbers (name),
        chairs (label)
      `)
      .single();

    if (updateError) {
      if (
        updateError.code === '23P01' ||
        updateError.message.includes('overlapping') ||
        updateError.message.includes('exclusion')
      ) {
        return NextResponse.json(
          {
            error:
              'Tidak dapat membuka kembali: slot waktu atau kursi ini sudah terisi oleh booking aktif lainnya.',
            code: 'SLOT_TAKEN',
          },
          { status: 409 }
        );
      }

      console.error('Update booking error:', updateError);
      return NextResponse.json(
        { error: 'Gagal memperbarui status booking di database.' },
        { status: 500 }
      );
    }

    // Log to booking_events
    await supabase.from('booking_events').insert({
      booking_id: id,
      action: eventAction,
      actor: 'admin',
      note: eventNote,
    });

    return NextResponse.json({ booking: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal mengeksekusi aksi admin.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
