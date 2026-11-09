-- Seed data for Cahaya Barbershop.
-- IDs, names, prices, and durations mirror the frontend data files.

insert into public.branches
  (id, name, short_name, address, timezone, open_time, close_time, is_main, active, sort_order)
values
  ('manislor', 'Cabang Utama Manislor', 'Manislor (Utama)',
   'Manislor, Kec. Jalaksana, Kabupaten Kuningan, Jawa Barat',
   'Asia/Jakarta', '10:00', '21:00', true, true, 1),
  ('jagabaya', 'Cabang Jagabaya', 'Jagabaya',
   'Jagabaya, Kabupaten Kuningan, Jawa Barat',
   'Asia/Jakarta', '10:00', '21:00', false, true, 2),
  ('jalaksana', 'Cabang Jalaksana', 'Jalaksana',
   'Jalaksana, Kabupaten Kuningan, Jawa Barat',
   'Asia/Jakarta', '10:00', '21:00', false, true, 3)
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  address = excluded.address,
  timezone = excluded.timezone,
  open_time = excluded.open_time,
  close_time = excluded.close_time,
  is_main = excluded.is_main,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.barbers
  (id, name, role, experience, image, is_founder, active, sort_order)
values
  (1, 'Yayat', 'Lead Master Barber & Founder', '10+ Tahun Pengalaman',
   '/images/barbers/yayat.jpeg', true, true, 1),
  (2, 'Eryanto', 'Senior Master Barber', '7+ Tahun Pengalaman',
   '/images/barbers/eryanto.jpeg', false, true, 2),
  (3, 'Maman', 'Master Barber & Stylist', '6+ Tahun Pengalaman',
   '/images/barbers/maman.jpeg', false, true, 3),
  (4, 'Asep', 'Fade & Beard Specialist', '5+ Tahun Pengalaman',
   '/images/barbers/asep.jpeg', false, true, 4),
  (5, 'Ilham', 'Color & Texture Specialist', '4+ Tahun Pengalaman',
   '/images/barbers/ilham.jpeg', false, true, 5),
  (6, 'Aditia', 'Modern Style Consultant', '4+ Tahun Pengalaman',
   '/images/barbers/aditia.jpeg', false, true, 6),
  (7, 'Hera', 'Creative Barber & Groomer', '3+ Tahun Pengalaman',
   '/images/barbers/hera.jpeg', false, true, 7)
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  experience = excluded.experience,
  image = excluded.image,
  is_founder = excluded.is_founder,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.services
  (id, name, category, price_idr, price_max_idr, duration_min, booking_mode, active, sort_order)
values
  ('cukur-saja', 'Cukur Saja', 'haircut', 30000, null, 25, 'chair', true, 1),
  ('cukur-cuci', 'Cukur + Cuci', 'haircut', 35000, null, 30, 'chair', true, 2),
  ('cukur-cuci-pijit', 'Cukur + Cuci + Pijit', 'haircut', 45000, null, 45, 'chair', true, 3),
  ('cukur-by-yayat', 'Cukur by Yayat', 'haircut', 50000, null, 45, 'chair', true, 4),
  ('cukur-panggilan', 'Cukur Panggilan (Home Service)', 'haircut', 150000, null, 60, 'consultation', true, 5),
  ('hairdo-wedding', 'Hairdo Wedding dll', 'haircut', 400000, null, 120, 'consultation', true, 6),
  ('hair-color-fashion', 'Fashion Color', 'color', 200000, 350000, 105, 'chair', true, 7),
  ('hairlight', 'Hairlight / Highlight', 'color', 200000, 300000, 75, 'chair', true, 8),
  ('bleach', 'Bleaching Rambut', 'color', 150000, null, 45, 'chair', true, 9),
  ('hair-color-bassic', 'Basic Color (Hitam, Coklat dll)', 'color', 40000, null, 25, 'chair', true, 10),
  ('korean-perm', 'Korean Perm', 'others', 200000, null, 105, 'chair', true, 11),
  ('down-perm', 'Down Perm', 'others', 100000, null, 45, 'chair', true, 12),
  ('perming', 'Perming Texture', 'others', 200000, 300000, 105, 'chair', true, 13),
  ('root-lift', 'Root Lift', 'others', 100000, null, 45, 'chair', true, 14),
  ('custom-look', 'Konsultasi Look', 'others', 0, null, 60, 'consultation', true, 99)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price_idr = excluded.price_idr,
  price_max_idr = excluded.price_max_idr,
  duration_min = excluded.duration_min,
  booking_mode = excluded.booking_mode,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.chairs (id, branch_id, label, sort_order, active)
select
  b.id || '-chair-' || gs.n,
  b.id,
  'Kursi ' || gs.n,
  gs.n,
  true
from public.branches b
cross join generate_series(1, 3) as gs(n)
on conflict (id) do update set
  branch_id = excluded.branch_id,
  label = excluded.label,
  sort_order = excluded.sort_order,
  active = excluded.active;
