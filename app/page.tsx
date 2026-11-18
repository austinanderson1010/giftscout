import GiftFinder from "@/components/GiftFinder";
import { hasSupabase, supabase } from "@/lib/supabase";
import type { GiftProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<GiftProduct[]> {
  if (!hasSupabase || !supabase) {
    console.warn("GiftScout catalog is not connected to Supabase yet.");
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Unable to load the GiftScout catalog:", error.message);
    return [];
  }

  return (data ?? []) as GiftProduct[];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="site-shell">
      <header className="site-header">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand-logo-link" href="/" aria-label="GiftScout home">
            <img className="brand-logo" src="/giftscout-logo.png" alt="GiftScout — Smarter gifting, made simple" />
          </a>
          <div className="nav-links">
            <a href="#how-it-works">How it works</a>
            <a className="nav-cta" href="#finder">Find a gift <span>→</span></a>
          </div>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> THE 60-SECOND GIFT FINDER</span>
            <h1 id="hero-title">Find a gift<br /><em>they’ll love.</em></h1>
            <p className="hero-description">
              Thoughtful gift ideas, without the endless searching. Tell us a little about them
              and we’ll help you find something that feels just right.
            </p>
            <div className="hero-benefits">
              <span><i>✓</i> Made for real people</span>
              <span><i>✓</i> Every occasion</span>
              <span><i>✓</i> Your budget</span>
            </div>
            <a className="hero-text-link" href="#how-it-works">See how GiftScout works <span>↓</span></a>
          </div>

          <div className="finder-wrap" id="finder">
            <GiftFinder products={products} />
          </div>
        </div>
        <div className="hero-footerline">
          <span>LESS SEARCHING. MORE MEANING.</span>
          <span className="footerline-rule" />
          <span>SMARTER GIFTING, MADE SIMPLE</span>
        </div>
      </section>

      <div id="shortlist-root" />

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">THOUGHTFUL GIFTING, SIMPLIFIED</span>
          <h2>Less guesswork.<br /><em>More meaning.</em></h2>
          <p>Three simple steps take you from “I have no idea” to a shortlist worth exploring.</p>
        </div>
        <div className="steps">
          <article className="step-card">
            <span className="step-number">01</span>
            <div className="step-icon">♡</div>
            <h3>Tell us about them</h3>
            <p>Share who you’re shopping for, the occasion, their interests, and your budget.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <div className="step-icon">✳</div>
            <h3>Explore good ideas</h3>
            <p>Get a focused shortlist based on the details you share.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <div className="step-icon">↗</div>
            <h3>Make their day</h3>
            <p>Compare gift ideas and continue to the retailer when you’re ready.</p>
          </article>
        </div>
      </section>

      <section className="closing-cta">
        <div>
          <span className="eyebrow">YOUR NEXT GREAT GIFT STARTS HERE</span>
          <h2>Make it personal.<br /><em>Keep it simple.</em></h2>
        </div>
        <a href="#finder" className="closing-button">Find their gift <span>→</span></a>
      </section>

      <footer className="site-footer">
        <a className="brand-logo-link footer-logo-link" href="/" aria-label="GiftScout home">
          <img className="brand-logo" src="/giftscout-logo.png" alt="GiftScout" />
        </a>
        <p>Find something they’ll love.</p>
        <small>
          GiftScout may earn commissions from qualifying purchases. Product prices and availability
          are determined by retailers.
        </small>
      </footer>
    </main>
  );
}
