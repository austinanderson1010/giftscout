# GiftScout 2.0 — application foundation

GiftScout is being built as a full gift-discovery platform with affiliate revenue and a future path to brand partnerships.

## Included in this starter

- Next.js App Router application and responsive GiftScout landing page.
- 60-second gift finder with recipient, age, occasion, budget, and interest inputs.
- Recommendation filtering and ranking against a product catalog.
- Supabase integration for active product reads.
- Demo catalog fallback so the experience can be previewed before a database is connected.
- Product click redirect endpoint with click-event recording when Supabase is connected.
- Initial database schema for products, click events, brands, and sponsor campaigns.
- Admin workspace placeholder, intentionally not writable until authentication and admin-only policies are configured.
- Affiliate disclosure language and sponsored placement labels.

## Important current limitations

This is an application starter, not a publicly deployed production service. It does not yet contain a finished admin login, product CRUD interface, image uploader, retailer feed sync, affiliate network integrations, conversion attribution, or paid campaign billing. The demo products use example retailer links and are not purchasable listings. Do not publish the demo catalog as live inventory.

The click endpoint records product click events when configured. It cannot know whether a customer completed a purchase unless the relevant affiliate network provides conversion reporting or postbacks and those are integrated.

## Run locally

1. Install Node.js 20 or newer.
2. Unzip the project.
3. In the project folder run:

   ```bash
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. Open http://localhost:3000.

The app will run with demo products before Supabase is configured.

## Connect Supabase

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and anon/public key into `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

5. Restart the Next.js development server.

The public application reads active products. The schema intentionally does not grant public product writes. Admin authentication and restrictive admin policies must be implemented before enabling catalog editing.

## Recommended build sequence

1. Configure Supabase and seed a small, verified catalog.
2. Implement Supabase Auth and an allow-listed admin role.
3. Add secure product CRUD and image uploads.
4. Add affiliate network tracking and conversion reporting where supported.
5. Build sponsor campaign management and clearly labeled paid placements.
6. Add SEO gift-guide pages, analytics, privacy/terms, and production monitoring.
7. Deploy to Vercel and connect the GiftScout domain.

## Security

- Never put a Supabase service-role key in a `NEXT_PUBLIC_` variable or browser code.
- Keep admin writes server-side and enforce authorization in the database with RLS.
- Validate retailer destinations and only use affiliate links issued by approved programs.
- Clearly disclose affiliate relationships and label paid placements.
- Follow each affiliate network's rules for product images, price display, refresh frequency, and link formatting.
