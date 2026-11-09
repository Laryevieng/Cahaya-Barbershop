import type { ReviewItem } from '@/types/barbershop';

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 1,
    name: 'Andika Wijaya',
    role: 'Pelanggan Cabang Manislor',
    avatar: 'AW',
    rating: 5,
    review:
      'Pelayanannya ramah dan teliti. Potong sama Kang Yayat hasilnya rapi presisi, keramas dan pijit lehernya bikin rileks setelah kerja seharian.',
    service: 'Cukur by Yayat + Cuci + Pijit',
  },
  {
    id: 2,
    name: 'Farhan Hidayat',
    role: 'Pelanggan Cabang Jagabaya',
    avatar: 'FH',
    rating: 5,
    review:
      'Treatment Korean Perm dan Down Perm rapi. Rambut samping yang awalnya jabrik jadi nurut dan gampang ditata tiap pagi tanpa ribet.',
    service: 'Korean Perm + Down Perm',
  },
  {
    id: 3,
    name: 'Rian Pratama',
    role: 'Pelanggan Cabang Jalaksana',
    avatar: 'RP',
    rating: 5,
    review:
      'Tempatnya bersih, wangi, AC sejuk. Sistem reservasi online sangat membantu, datang langsung dapat giliran kursi tanpa perlu buang waktu antre.',
    service: 'Cukur + Cuci + Pijit',
  },
];
