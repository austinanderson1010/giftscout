-- GiftScout v2.0 database schema
-- Run this in Supabase SQL Editor after creating your project.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  retailer_name text not null,
  product_url text not null,
  affiliate_url text,
  image_url text,
  price numeric(10,2),
  currency text not null default 'USD',
  category text,
  tags text[] not null default '{}',
  occasions text[] not null default '{}',
  age_min integer,
  age_max integer,
  status text not null default 'draft' check (status in ('active','draft','archived')),
  is_sponsored boolean not null default false,
  sponsor_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_age_range check (age_min is null or age_max is null or age_min <= age_max)
);

create table if not exists public.product_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  clicked_at timestamptz not null default now(),
  referrer text,
  campaign_id uuid
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  contact_email text,
  status text not null default 'prospect' check (status in ('prospect','active','paused')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.sponsor_campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  placement text not null default 'gift_finder',
  disclosure_label text not null default 'Sponsored',
  status text not null default 'draft' check (status in ('draft','scheduled','active','completed')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.product_clicks enable row level security;
alter table public.brands enable row level security;
alter table public.sponsor_campaigns enable row level security;

-- Public visitors can read active products only.
create policy "Public can read active products"
on public.products for select
using (status = 'active');

-- Click events can be inserted by visitors; no public read access.
create policy "Visitors can record product clicks"
on public.product_clicks for insert
with check (true);

-- Brand and campaign records are private by default.
-- Add admin-only policies after configuring Supabase Auth and an admin role.
-- Do not add a public write policy for products, brands, or campaigns.

create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_tags_idx on public.products using gin(tags);
create index if not exists products_occasions_idx on public.products using gin(occasions);
create index if not exists product_clicks_product_id_idx on public.product_clicks(product_id);
create index if not exists product_clicks_clicked_at_idx on public.product_clicks(clicked_at);
