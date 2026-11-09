import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f1115',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cahayabarbershop.com'),
  title: 'CAHAYA BARBERSHOP - Barbershop & Grooming Terbaik di Kuningan',
  description: 'Pengalaman grooming & styling pria premium di Cahaya Barbershop Kuningan. Precision haircut, hair coloring, korean perm, down perm, cukur panggilan, dan hairdo wedding.',
  keywords: ['cahaya barbershop', 'cahaya barbershop kuningan', 'barbershop kuningan', 'potong rambut kuningan', 'korean perm kuningan', 'hair color kuningan', 'yayat barber'],
  authors: [{ name: 'CAHAYA BARBERSHOP' }],
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'CAHAYA BARBERSHOP - Look Sharp. Feel Confident.',
    description: 'Pengalaman grooming & styling pria modern di Kuningan City Center.',
    type: 'website',
    locale: 'id_ID',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} dark scroll-smooth`}>
      <body className="bg-[#0f1115] text-[#f1f1ed] antialiased min-h-screen selection:bg-[#c89b3c] selection:text-[#0f1115]">
        {children}
      </body>
    </html>
  );
}
