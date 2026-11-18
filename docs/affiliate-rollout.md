# GiftScout affiliate and product-media rollout

This plan is based on the current 250-row Supabase catalog. It does not create tracking links, claim merchant approval, or activate products.

## Current retailer concentration

| Retailer | Catalog rows | Recommended route | Status |
|---|---:|---|---|
| Target | 108 | Target Partners through Impact | Apply; approval required |
| Best Buy | 28 | Best Buy Creator/Publisher program through Impact | Apply; approval required; check current business/site eligibility |
| REI Co-op | 23 | REI Co-op affiliate program through Impact | Apply; approval required |
| Walmart | 21 | Walmart Affiliate Program through Impact | Apply; approval required |
| Nordstrom | 14 | Nordstrom Publisher program through Impact | Apply; approval required |
| Crate & Barrel | 7 | Search/apply in Impact marketplace | Confirm current campaign terms and product-feed access |
| Other retailers | 49 | Review merchant-by-merchant after core networks | Do not assume network coverage or approval |

Counts are a snapshot of the current database and may change as products are replaced.

## Recommended sequence

1. Create one publisher account with Impact and apply to Target, Walmart, Best Buy, REI, Nordstrom, and Crate & Barrel where each program is available.
2. Use the public GiftScout site URL and an accurate description of the site in every application. Do not claim traffic, audience size, approval, or sales history that GiftScout does not have.
3. After each merchant approves GiftScout, use that merchant's official link builder or approved product feed to create deep links and retrieve image assets.
4. For any merchant not available through Impact, check the merchant's own affiliate page and the publisher networks it names. Keep that retailer's products in draft until approved.
5. Import the approved affiliate URL and licensed image URL into the matching product row. Keep the ordinary product URL as a fallback/reference only.
6. Recheck price, stock, product match, image, link destination, and retailer terms before activating each product.

## Product image rules

- Prefer the approved advertiser product feed or creative library.
- Use images only when the merchant/network makes them available for publisher use, or the merchant gives explicit permission.
- Do not scrape or hotlink arbitrary product-page images as a substitute for permission. A page being publicly viewable does not grant reuse rights.
- Keep each image matched to the exact product/variant and use HTTPS.
- Record the source feed/merchant and the date checked in the import worksheet or internal QA notes.

Awin's publisher guidance says approved publisher creatives and product-feed images are the authorized materials; it recommends seeking consent for images not supplied through the platform. REI's official affiliate page describes access to a daily product feed with images and landing URLs after approval.

## Activation gate

A product must remain `draft` until all of the following are true:

- Product page still resolves to the exact item/variant.
- Current price and availability have been checked.
- Affiliate link was generated from an approved merchant relationship and redirects to the intended item.
- Image is from an approved feed/creative source or otherwise licensed.
- Product copy, category, tags, and age suitability have been reviewed.
- Required affiliate disclosure is visible on GiftScout.

Only then should an admin change `status` to `active`.

## Network application checklist

- [ ] Impact publisher account created
- [ ] GiftScout property/site added to the account
- [ ] Target program approved
- [ ] Walmart program approved
- [ ] Best Buy program approved
- [ ] REI Co-op program approved
- [ ] Nordstrom program approved
- [ ] Crate & Barrel program availability/approval confirmed
- [ ] Product-feed access enabled for approved merchants
- [ ] Approved image and link feed fields mapped to GiftScout

## Official references

- Target Partners: https://partners.target.com/
- Target Partners FAQ: https://partners.target.com/faqs
- Walmart Affiliate Program: https://affiliates.walmart.com/
- Walmart Affiliate FAQ: https://affiliates.walmart.com/faqs
- Best Buy Affiliate Program: https://www.bestbuy.com/site/misc/best-buy-affiliate-program/pcmcat198500050002.c?id=pcmcat198500050002
- REI Co-op Affiliate Program: https://www.rei.com/help/articles?a=Affiliate-Program---id--SnToxfZRRI-o6A7lkasoWA&ctgry=adventuresExperiences&hc=somethingElse
- Nordstrom Affiliate Program: https://www.nordstrom.com/browse/affiliate-program
- Awin image-use guidance: https://success.awin.com/s/article/Can-I-use-any-images-from-the-advertiser-s-website?language=en_US
- Rakuten product-link guidance: https://pubhelp.rakutenadvertising.com/hc/en-us/articles/10623933503373-Product-Links

## Important

Affiliate networks and advertisers control approval, tracking links, feed access, rates, and permitted creatives. GiftScout must not generate guessed affiliate URLs or use product images outside the rights granted by the applicable merchant/network terms.
