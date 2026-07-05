-- Run this in Supabase SQL Editor.

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric not null,
  category text not null,
  weight text,
  image text,
  description text,
  nutrition jsonb,
  "inStock" boolean default true,
  featured boolean default false
);

create table if not exists public.orders (
  id text primary key,
  customer jsonb,
  items jsonb,
  subtotal numeric,
  "deliveryCharge" numeric,
  total numeric,
  "paymentMethod" text,
  status text,
  "createdAt" timestamptz default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Public access policies for this frontend-only app.
-- Replace with authenticated policies before production hardening.
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
for select using (true);

drop policy if exists "products public write" on public.products;
create policy "products public write" on public.products
for all using (true) with check (true);

drop policy if exists "orders public access" on public.orders;
create policy "orders public access" on public.orders
for all using (true) with check (true);
