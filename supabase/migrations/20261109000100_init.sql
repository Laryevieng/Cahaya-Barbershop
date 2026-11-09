-- Cahaya Barbershop booking schema
-- Booking window: current month only (Asia/Jakarta), 24-hour pending expiry.
-- Chairs are a physical resource per branch: exactly 3 active chairs per branch.

create extension if not exists btree_gist;

create table if not exists public.branches (
  id text primary key,
  name text not null,
  short_name text not null,
  address text,
  timezone text not null default 'Asia/Jakarta',
  open_time time not null default '10:00',
  close_time time not null default '21:00',
  is_main boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.barbers (
  id integer primary key,
  name text not null,
  role text,
  experience text,
  image text,
  is_founder boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  name text not null,
  category text not null default 'haircut'
    check (category in ('haircut', 'color', 'others')),
  description text,
  price_idr integer not null check (price_idr >= 0),
  price_max_idr integer check (price_max_idr is null or price_max_idr >= price_idr),
  duration_min integer not null check (duration_min > 0),
  booking_mode text not null default 'chair'
    check (booking_mode in ('chair', 'consultation')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.chairs (
  id text primary key,
  branch_id text not null references public.branches(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (branch_id, label)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  branch_id text not null references public.branches(id),
  service_id text references public.services(id),
  barber_id integer references public.barbers(id),
  chair_id text references public.chairs(id),
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  customer_name text not null,
  customer_phone text not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'expired')),
  booking_mode text not null default 'chair'
    check (booking_mode in ('chair', 'consultation')),
  expires_at timestamptz,
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  service_name text not null,
  price_idr integer not null check (price_idr >= 0),
  duration_min integer not null check (duration_min > 0),
  barber_name text,
  chair_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_time_order check (end_time > start_time),
  constraint bookings_chair_required check (
    booking_mode = 'consultation' or chair_id is not null
  )
);

create index if not exists bookings_date_idx
  on public.bookings (booking_date, start_time);

create index if not exists bookings_branch_date_idx
  on public.bookings (branch_id, booking_date);

create index if not exists bookings_status_idx
  on public.bookings (status);

create index if not exists bookings_code_idx
  on public.bookings (code);

-- A chair cannot host two active bookings that overlap.
alter table public.bookings
  drop constraint if exists bookings_chair_no_overlap;
alter table public.bookings
  add constraint bookings_chair_no_overlap
  exclude using gist (
    chair_id with =,
    tsrange(booking_date + start_time, booking_date + end_time) with &&
  )
  where (status in ('pending', 'confirmed') and chair_id is not null);

-- A selected barber cannot serve two active bookings that overlap.
alter table public.bookings
  drop constraint if exists bookings_barber_no_overlap;
alter table public.bookings
  add constraint bookings_barber_no_overlap
  exclude using gist (
    barber_id with =,
    tsrange(booking_date + start_time, booking_date + end_time) with &&
  )
  where (status in ('pending', 'confirmed') and barber_id is not null);

-- The same phone number cannot hold two overlapping active bookings.
alter table public.bookings
  drop constraint if exists bookings_phone_no_overlap;
alter table public.bookings
  add constraint bookings_phone_no_overlap
  exclude using gist (
    customer_phone with =,
    tsrange(booking_date + start_time, booking_date + end_time) with &&
  )
  where (status in ('pending', 'confirmed'));

create table if not exists public.booking_events (
  id bigint generated always as identity primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  action text not null
    check (action in ('created', 'confirmed', 'completed', 'cancelled', 'expired', 'reopened')),
  actor text not null default 'system'
    check (actor in ('customer', 'admin', 'system')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists booking_events_booking_idx
  on public.booking_events (booking_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

-- Moves pending bookings past their 24-hour window to expired.
-- Called by the API before availability checks and by pg_cron every 10 minutes.
create or replace function public.expire_stale_bookings()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count integer;
begin
  with expired as (
    update public.bookings
    set status = 'expired', updated_at = now()
    where status = 'pending' and expires_at is not null and expires_at < now()
    returning id
  )
  insert into public.booking_events (booking_id, action, actor, note)
  select id, 'expired', 'system', 'Otomatis kedaluwarsa setelah 24 jam'
  from expired;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- The single write path for customer bookings.
-- The exclusion constraints above are the final arbiter under concurrent requests.
create or replace function public.create_booking(
  p_branch_id text,
  p_service_id text,
  p_barber_id integer,
  p_chair_id text,
  p_booking_date date,
  p_start_time time,
  p_customer_name text,
  p_customer_phone text,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_branch public.branches%rowtype;
  v_service public.services%rowtype;
  v_barber public.barbers%rowtype;
  v_chair public.chairs%rowtype;
  v_booking public.bookings%rowtype;
  v_now timestamp := now() at time zone 'Asia/Jakarta';
  v_today date := v_now::date;
  v_month_start date := date_trunc('month', v_now)::date;
  v_month_end date := (date_trunc('month', v_now) + interval '1 month')::date;
  v_end_time time;
  v_phone text;
  v_code text;
  v_barber_name text := 'Any';
  v_chair_label text;
begin
  perform public.expire_stale_bookings();

  select * into v_branch
  from public.branches
  where id = p_branch_id and active = true;

  if not found then
    raise exception 'BRANCH_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_service
  from public.services
  where id = p_service_id and active = true;

  if not found then
    raise exception 'SERVICE_NOT_FOUND' using errcode = 'P0001';
  end if;

  if p_booking_date is null
    or p_booking_date < v_month_start
    or p_booking_date >= v_month_end then
    raise exception 'INVALID_DATE' using errcode = 'P0001';
  end if;

  if p_booking_date < v_today then
    raise exception 'DATE_IN_PAST' using errcode = 'P0001';
  end if;

  if p_booking_date = v_today and p_start_time <= v_now::time then
    raise exception 'TIME_IN_PAST' using errcode = 'P0001';
  end if;

  if p_start_time is null or p_start_time < v_branch.open_time then
    raise exception 'OUTSIDE_HOURS' using errcode = 'P0001';
  end if;

  v_end_time := p_start_time + make_interval(mins => v_service.duration_min);

  if v_end_time <= p_start_time or v_end_time > v_branch.close_time then
    raise exception 'OUTSIDE_HOURS' using errcode = 'P0001';
  end if;

  if v_service.booking_mode = 'chair' then
    if p_chair_id is null or length(trim(p_chair_id)) = 0 then
      raise exception 'CHAIR_REQUIRED' using errcode = 'P0001';
    end if;

    select * into v_chair
    from public.chairs
    where id = p_chair_id and active = true;

    if not found then
      raise exception 'CHAIR_NOT_FOUND' using errcode = 'P0001';
    end if;

    if v_chair.branch_id <> p_branch_id then
      raise exception 'CHAIR_BRANCH_MISMATCH' using errcode = 'P0001';
    end if;

    v_chair_label := v_chair.label;
  else
    v_chair := null;
    v_chair_label := null;
  end if;

  if p_barber_id is not null then
    select * into v_barber
    from public.barbers
    where id = p_barber_id and active = true;

    if not found then
      raise exception 'BARBER_NOT_FOUND' using errcode = 'P0001';
    end if;

    v_barber_name := v_barber.name;
  end if;

  if p_customer_name is null or length(trim(p_customer_name)) < 2 then
    raise exception 'NAME_INVALID' using errcode = 'P0001';
  end if;

  v_phone := regexp_replace(coalesce(p_customer_phone, ''), '[^0-9]', '', 'g');

  if left(v_phone, 1) = '0' then
    v_phone := '62' || substr(v_phone, 2);
  elsif left(v_phone, 2) <> '62' then
    v_phone := '62' || v_phone;
  end if;

  if length(v_phone) < 10 or length(v_phone) > 15 then
    raise exception 'PHONE_INVALID' using errcode = 'P0001';
  end if;

  v_code := 'CB-' || to_char(v_now, 'YYMMDD') || '-' ||
    upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  insert into public.bookings (
    code,
    branch_id,
    service_id,
    barber_id,
    chair_id,
    booking_date,
    start_time,
    end_time,
    customer_name,
    customer_phone,
    notes,
    status,
    booking_mode,
    expires_at,
    service_name,
    price_idr,
    duration_min,
    barber_name,
    chair_label
  )
  values (
    v_code,
    v_branch.id,
    v_service.id,
    p_barber_id,
    v_chair.id,
    p_booking_date,
    p_start_time,
    v_end_time,
    trim(p_customer_name),
    v_phone,
    nullif(trim(coalesce(p_notes, '')), ''),
    'pending',
    v_service.booking_mode,
    now() + interval '24 hours',
    v_service.name,
    v_service.price_idr,
    v_service.duration_min,
    v_barber_name,
    v_chair_label
  )
  returning * into v_booking;

  insert into public.booking_events (booking_id, action, actor, note)
  values (v_booking.id, 'created', 'customer', 'Booking dibuat dari website');

  return to_jsonb(v_booking);

exception
  when exclusion_violation then
    raise exception 'SLOT_TAKEN' using errcode = 'P0001';
  when unique_violation then
    raise exception 'SLOT_TAKEN' using errcode = 'P0001';
end;
$$;

alter table public.branches enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.chairs enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_events enable row level security;

revoke all on table public.branches from anon, authenticated;
revoke all on table public.barbers from anon, authenticated;
revoke all on table public.services from anon, authenticated;
revoke all on table public.chairs from anon, authenticated;
revoke all on table public.bookings from anon, authenticated;
revoke all on table public.booking_events from anon, authenticated;

grant all on table public.branches to service_role;
grant all on table public.barbers to service_role;
grant all on table public.services to service_role;
grant all on table public.chairs to service_role;
grant all on table public.bookings to service_role;
grant all on table public.booking_events to service_role;
grant usage, select on all sequences in schema public to service_role;

revoke all on function public.expire_stale_bookings() from public, anon, authenticated;
grant execute on function public.expire_stale_bookings() to service_role;

revoke all on function public.create_booking(text, text, integer, text, date, time, text, text, text)
  from public, anon, authenticated;
grant execute on function public.create_booking(text, text, integer, text, date, time, text, text, text)
  to service_role;
