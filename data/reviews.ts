import type { ReviewItem } from '@/types/barbershop';

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 1,
    name: 'Andika Wijaya',
    role: 'Pelanggan Setia',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    review:
      'Pelayanannya mantap banget! Potong sama Kang Yayat hasilnya rapi presisi, cuci + pijitnya bikin seger. Barbershop nomor satu di Kuningan!',
    service: 'Cukur by Yayat + Cuci + Pijit',
  },
  {
    id: 2,
    name: 'Farhan Hidayat',
    role: 'Eksekutif Muda',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    review:
      'Nyobain Korean Perm dan Down Perm di Cahaya Barbershop hasilnya di luar ekspektasi, rambut samping ga jabrik lagi dan gampang ditata.',
    service: 'Korean Perm + Down Perm',
  },
  {
    id: 3,
    name: 'Rian Putra',
    role: 'Kreator Konten',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    review:
      'Tempatnya bersih, wangi, AC dingin. Booking lewat WA gampang banget tanpa harus antre lama. Rekomendasi buat yang mau tampil ganteng maksimal.',
    service: 'Cukur + Cuci + Pijit',
  },
];
