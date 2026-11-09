import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  verifyAdminPassword,
} from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body || {};

    if (!password || !verifyAdminPassword(password)) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return NextResponse.json(
        { error: 'Password admin salah.' },
        { status: 401 }
      );
    }

    const token = createAdminToken(12);
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 3600,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal memproses autentikasi admin.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
