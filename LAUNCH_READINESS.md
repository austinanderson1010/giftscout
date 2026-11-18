# GiftScout launch readiness

This branch prepares the app for a safe production connection to Supabase.

## Current launch gates

- 250 product rows exist in Supabase. Keep them as drafts until product-level verification, approved images, and affiliate tracking are complete.
- Do not bulk-activate products.
- Configure these Cloudflare Worker production variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Use the Supabase anon/publishable key only. Never put a service-role key in a public environment variable or the browser.
- Confirm that the `products` table has a public SELECT policy limited to `status = 'active'`.
- Confirm `product_clicks` permits INSERT from visitors but does not grant public SELECT.

## Test plan

1. Deploy this branch to a Cloudflare preview.
2. Add the Supabase URL and publishable/anon key in Worker production and preview variables.
3. Confirm the public site reads active products from Supabase.
4. Confirm draft products do not appear publicly.
5. Click an active product and verify redirect + click event recording.
6. Only then selectively activate products that pass image, retailer, price, variant, and affiliate review.

## Current implementation notes

The public homepage now reads only active Supabase products and does not fall back to demo/example inventory. When Supabase is not configured or no active products exist, the finder presents a catalog-in-setup message. The outbound click route now only resolves active products and only redirects to HTTPS destinations. The admin workspace uses Supabase Auth and an `is_giftscout_admin` RPC; confirm that RPC and admin policies exist before relying on the admin page.

## Catalog status (2026-11-18)

- 250 product records present according to the user's Supabase Table Editor screenshot.
- All 250 image URLs and affiliate URLs were blank in the final QA report.
- 248 products had retailer listings checked; 2 selected REI variants were unavailable.
- All remain draft until launch gates are cleared.
