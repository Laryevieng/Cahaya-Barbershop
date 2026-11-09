import 'server-only';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'cahaya_admin_session';

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET belum dikonfigurasi di environment.');
  }
  return secret;
}

export function createAdminToken(expiresInHours = 12): string {
  const secret = getSessionSecret();
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const payloadStr = String(exp);
  const signature = createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');
  return `${payloadStr}.${signature}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [expStr, signature] = parts;
  const exp = Number(expStr);
  if (!exp || Number.isNaN(exp)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (exp < now) {
    return false;
  }

  try {
    const secret = getSessionSecret();
    const expectedSignature = createHmac('sha256', secret)
      .update(expStr)
      .digest('base64url');

    const sigBuf = createHash('sha256').update(signature).digest();
    const expBuf = createHash('sha256').update(expectedSignature).digest();

    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }

  const a = createHash('sha256').update(password || '').digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}
