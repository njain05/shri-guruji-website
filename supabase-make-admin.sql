-- Shri Guru Ji Dry Fruits — grant yourself seller access
--
-- Run this LAST, in the Supabase SQL Editor, after:
--   1. supabase-schema.sql   (creates the tables + RLS)
--   2. supabase-seed.sql     (loads the 19 products)
--   3. Authentication > Users > Add user
--      (real email, strong NEW password, tick "Auto Confirm User")
--
-- Replace the email below with the one you just created, then run.
-- Safe to re-run.

insert into public.admins (user_id, email)
select id, email
from auth.users
where email = 'you@example.com'      -- <<< CHANGE THIS
on conflict (user_id) do nothing;


-- Check it worked — this should return exactly one row, with your email:
select a.email, a.created_at
from public.admins a;


-- Also worth checking once: every table below should show rowsecurity = true.
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
