-- GiftScout launch audit — READ ONLY
-- Run in Supabase SQL Editor. These queries do not modify product or policy data.

-- 1) Confirm total products and publishing status.
select status, count(*) as product_count
from public.products
group by status
order by status;

-- 2) Confirm launch blockers for images and affiliate URLs.
select
  count(*) as total_products,
  count(*) filter (where image_url is null or btrim(image_url) = '') as missing_images,
  count(*) filter (where affiliate_url is null or btrim(affiliate_url) = '') as missing_affiliate_urls,
  count(*) filter (where product_url is null or btrim(product_url) = '') as missing_product_urls,
  count(*) filter (where price is null) as missing_prices
from public.products;

-- 3) Category mix and active/draft split.
select
  coalesce(category, '(uncategorized)') as category,
  status,
  count(*) as product_count
from public.products
group by category, status
order by category, status;

-- 4) Review the current row-level security policies.
select
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('products', 'product_clicks', 'admin_users', 'brands', 'sponsor_campaigns')
order by tablename, policyname;

-- 5) Check whether the admin verification RPC exists and is SECURITY DEFINER.
select
  p.proname as function_name,
  pg_get_function_result(p.oid) as return_type,
  p.prosecdef as is_security_definer
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'is_giftscout_admin';
