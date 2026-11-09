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
    <div className="min-h-screen bg-[#0f1115] text-[#f1f1ed] selection:bg-[#c89b3c] selection:text-[#0f1115]">
      {children}
    </div>
  );
}
