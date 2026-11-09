import { redirect } from 'next/navigation';
import { isCurrentUserAdmin } from '@/lib/admin/auth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (isAdmin) {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#050505] via-[#0a0a10] to-[#050505]">
      <AdminLoginForm />
    </main>
  );
}
