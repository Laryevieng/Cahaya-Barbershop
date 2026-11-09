import type { Branch } from '@/types/barbershop';

export const BRANCHES_DATA: Branch[] = [
  {
    id: 'manislor',
    name: 'Cabang Utama Manislor',
    shortName: 'Manislor (Utama)',
    isMain: true,
    tag: 'CABANG UTAMA',
    address: 'Manislor, Kec. Jalaksana, Kabupaten Kuningan, Jawa Barat',
    mapUrl: 'https://maps.app.goo.gl/wBWvPyZ5u44wH1mn8?g_st=iw',
    embedQuery: 'Manislor, Jalaksana, Kuningan, Jawa Barat',
    hours: 'Senin - Minggu: 10:00 - 21:00 WIB',
  },
  {
    id: 'jagabaya',
    name: 'Cabang Jagabaya',
    shortName: 'Jagabaya',
    isMain: false,
    tag: 'CABANG 2',
    address: 'Jagabaya, Kabupaten Kuningan, Jawa Barat',
    mapUrl: 'https://maps.app.goo.gl/29U9Rf6YVygTJ5x16?g_st=iw',
    embedQuery: 'Jagabaya, Kuningan, Jawa Barat',
    hours: 'Senin - Minggu: 10:00 - 21:00 WIB',
  },
  {
    id: 'jalaksana',
    name: 'Cabang Jalaksana',
    shortName: 'Jalaksana',
    isMain: false,
    tag: 'CABANG 3',
    address: 'Jalaksana, Kabupaten Kuningan, Jawa Barat',
    mapUrl: 'https://maps.app.goo.gl/8pAb44x7tCxYz9G57?g_st=iw',
    embedQuery: 'Jalaksana, Kuningan, Jawa Barat',
    hours: 'Senin - Minggu: 10:00 - 21:00 WIB',
  },
];
