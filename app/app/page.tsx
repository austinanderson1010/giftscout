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
    <main>
      <nav className="nav"><a className="brand-logo-link" href="/" aria-label="GiftScout home"><img className="brand-logo" src="/giftscout-logo.png" alt="GiftScout — Zero Guesswork" /></a><div className="nav-links"><a href="#how-it-works">How it works</a><a href="/admin">For the team</a></div></nav>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A BETTER WAY TO FIND THE RIGHT GIFT</span>
          <h1>Thoughtful gifts.<br/><em>Zero guesswork.</em></h1>
          <p>Discover gifts that feel personal, fit your budget, and make the people you care about feel seen.</p>
          <a className="hero-link" href="#finder">Find their gift <span>↓</span></a>
        </div>
        <div className="hero-art" aria-label="Gift illustration"><div className="sun"></div><div className="gift-box"><div className="ribbon-v"></div><div className="ribbon-h"></div><div className="bow">⌁</div></div><div className="spark s1">✳</div><div className="spark s2">✦</div><div className="art-note">A little more<br/>thought goes<br/>a long way.</div></div>
      </section>
      <div className="trust-strip"><span>FOR EVERY PERSON</span><b>·</b><span>FOR EVERY OCCASION</span><b>·</b><span>FOR EVERY BUDGET</span></div>
      <div id="finder"><GiftFinder products={products} /></div>
      <section className="how" id="how-it-works"><span className="eyebrow">SIMPLE BY DESIGN</span><h2>Great gifts start<br/>with knowing them.</h2><div className="steps">
        <div><span>01</span><h3>Tell us about them</h3><p>Share the occasion, budget, age, and a few interests.</p></div>
        <div><span>02</span><h3>Explore thoughtful ideas</h3><p>Get a curated shortlist built around what makes them them.</p></div>
        <div><span>03</span><h3>Make it memorable</h3><p>Choose a gift and complete your purchase with a retailer.</p></div>
      </div></section>
      <footer><a className="brand-logo-link" href="/" aria-label="GiftScout home"><img className="brand-logo" src="/giftscout-logo.png" alt="GiftScout — Zero Guesswork" /></a><p>Find something they’ll love.</p><small>GiftScout may earn commissions from qualifying purchases. Product prices and availability are determined by retailers.</small></footer>
    </main>
  );
}
