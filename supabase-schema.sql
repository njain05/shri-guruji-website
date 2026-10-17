-- Shri Guru Ji Dry Fruits — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
--
-- Security model:
--   products : anyone may READ (the storefront needs it); only admins may write.
--   orders   : anyone may PLACE one; only admins may read, update or delete them.
--              Orders contain customer names, phone numbers and addresses, so
--              public read access would expose personal data to anyone holding
--              the anon key — and the anon key ships inside the public JS bundle.

-- ---------------------------------------------------------------------------
-- 1. Tables  (column names match the JS objects exactly, hence the quoting)
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id          text primary key,
  name        text not null,
  category    text not null,
  description text,
  nutrition   jsonb,
  images      jsonb  not null default '[]'::jsonb,  -- array of image paths
  weights     jsonb  not null default '[]'::jsonb,  -- [{ size, price }, ...]
  "inStock"   boolean not null default true,
  featured    boolean not null default false
);

create table if not exists public.orders (
  id               text primary key,
  customer         jsonb   not null,   -- { name, phone, email, address, city, state, pincode }
  items            jsonb   not null,   -- [{ id, name, price, quantity, weight }, ...]
  subtotal         numeric not null default 0,
  "deliveryCharge" numeric not null default 0,
  "giftCharge"     numeric not null default 0,
  "giftPackaging"  boolean not null default false,
  total            numeric not null default 0,
  "paymentMethod"  text,
  status           text    not null default 'Pending',
  "createdAt"      timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders ("createdAt" desc);

-- ---------------------------------------------------------------------------
-- 2. Who counts as an admin
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so the policies below can consult this table without
-- re-triggering RLS on it (which would recurse).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.products enable row level security;
alter table public.orders   enable row level security;
alter table public.admins   enable row level security;

-- products: world-readable, admin-writable
drop policy if exists "products public read"  on public.products;
create policy "products public read"
  on public.products for select
  using (true);

drop policy if exists "products admin write" on public.products;
create policy "products admin write"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- orders: anyone may place one, only admins may see them
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert"
  on public.orders for insert
  with check (true);

drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete"
  on public.orders for delete
  using (public.is_admin());

-- admins: a signed-in user may check their own row; nobody may self-promote.
drop policy if exists "admins read own" on public.admins;
create policy "admins read own"
  on public.admins for select
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. Make yourself an admin
-- ---------------------------------------------------------------------------
-- Create the user first: Dashboard > Authentication > Users > Add user
-- (use a real email + a strong password, and tick "Auto Confirm User").
-- Then run this, with your email:
--
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'you@example.com'
--   on conflict (user_id) do nothing;
