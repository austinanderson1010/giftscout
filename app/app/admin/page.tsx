import { hasSupabase } from "@/lib/supabase";

export default function AdminPage() {
  return <main className="admin-shell">
    <a className="brand-logo-link admin-logo" href="/" aria-label="GiftScout home"><img className="brand-logo" src="/giftscout-logo.png" alt="GiftScout — Zero Guesswork" /></a>
    <div className="admin-panel">
      <span className="eyebrow">GIFTSCOUT CONTROL ROOM</span>
      <h1>Catalog &amp; partnerships</h1>
      <p>This is the starting point for your private admin workspace. The live version will require an authenticated administrator account before any product or campaign data can be changed.</p>
      <div className="admin-status"><span className={hasSupabase ? "status-dot live" : "status-dot"}></span>{hasSupabase ? "Supabase environment configured" : "Database not connected yet"}</div>
      <h2>What the admin workspace will manage</h2>
      <div className="admin-features">
        <div><b>Product catalog</b><span>Add, edit, archive products, images, categories, age ranges, prices, and retailer links.</span></div>
        <div><b>Affiliate performance</b><span>Track product clicks and connect purchase reporting as affiliate networks become available.</span></div>
        <div><b>Brand partnerships</b><span>Manage sponsor profiles, campaign dates, placements, and disclosure labels.</span></div>
      </div>
      <p className="notice">Security note: this starter intentionally does not expose product-editing controls until Supabase authentication and row-level security are configured.</p>
      <a className="back-link" href="/">← Back to GiftScout</a>
    </div>
  </main>;
}
