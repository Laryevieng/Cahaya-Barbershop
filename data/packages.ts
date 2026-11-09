import type { PricingPackage } from '@/types/barbershop';

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'cukur-basic',
    serviceId: 'cukur-cuci',
    name: 'CUKUR + CUCI',
    subtitle: 'Daily Fresh & Clean Grooming',
    priceIdr: 35000,
    highlighted: false,
    features: [
      'Konsultasi Bentuk Wajah & Gaya',
      'Cukur Presisi Haircut',
      'Keramas Cuci Rambut Bersih',
      'Blow Dry & Styling Pomade',
    ],
  },
  {
    id: 'cukur-signature-pijit',
    serviceId: 'cukur-cuci-pijit',
    name: 'CUKUR + CUCI + PIJIT',
    subtitle: 'Pilihan Terfavorit Pelanggan',
    priceIdr: 45000,
    highlighted: true,
    popularBadge: 'PALING LARIS',
    features: [
      'Konsultasi Gaya Menyeluruh',
      'Precision Haircut Custom',
      'Cuci Rambut + Scalp Massage',
      'Pijat Leher & Pundak Rileks',
      'Handuk Hangat & Styling Premium',
    ],
  },
  {
    id: 'cukur-by-yayat-pack',
    serviceId: 'cukur-by-yayat',
    name: 'CUKUR BY YAYAT',
    subtitle: 'Master Barber Experience',
    priceIdr: 50000,
    highlighted: false,
    popularBadge: 'FOUNDER CHOICE',
    features: [
      'Ditangani Langsung oleh Yayat',
      'Detail Razor Fade & Geometry Khusus',
      'Finishing Cuci & Scalp Refresh',
      'Saran Perawatan Rambut Personal',
      'Signature Styling Pomade',
    ],
  },
];
