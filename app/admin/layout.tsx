import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Cahaya Barbershop',
  description: 'Manajemen reservasi kursi dan jadwal Cahaya Barbershop Kuningan.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#1e5eff] selection:text-white">
      {children}
    </div>
  );
}
