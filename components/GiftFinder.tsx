 "use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { FormEvent } from "react";
import type { GiftProduct } from "@/lib/types";

const occasions = ["Birthday", "Christmas", "Anniversary", "Graduation", "Thank-you", "Housewarming", "Just because"];
const budgets = [
  { label: "Under $25", max: 25 },
  { label: "$25–$50", max: 50 },
  { label: "$50–$100", max: 100 },
  { label: "$100–$250", max: 250 },
  { label: "$250+", max: 100000 }
];

function GiftRevealModal({ onViewShortlist, onClose, count }: { onViewShortlist: () => void; onClose: () => void; count: number }) {
  return (
    <div className="gift-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="gift-modal" role="dialog" aria-modal="true" aria-labelledby="gift-modal-title">
        <button className="gift-modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <div className="gift-modal-art" aria-hidden="true">
          <span className="modal-confetti confetti-a">✦</span>
          <span className="modal-confetti confetti-b">✧</span>
          <span className="modal-confetti confetti-c">✦</span>
          <span className="modal-confetti confetti-d">✧</span>
          <div className="modal-gift-box">
            <div className="modal-gift-lid"><span className="modal-gift-bow" /></div>
            <div className="modal-gift-body"><i /></div>
          </div>
        </div>
        <span className="eyebrow">YOUR GIFT SCOUT SHORTLIST IS READY</span>
        <h2 id="gift-modal-title">We've found something they'll love!</h2>
        <p>We curated {count === 1 ? "a gift idea" : `${count} gift ideas`} based on your answers. Your shortlist is ready to explore.</p>
        <button className="gift-modal-cta" type="button" onClick={onViewShortlist}>
          View my gift shortlist <span>→</span>
        </button>
        <button className="gift-modal-secondary" type="button" onClick={onClose}>Stay on this page</button>
      </section>
    </div>
  );
}

export default function GiftFinder({ products }: { products: GiftProduct[] }) {
  const [recipient, setRecipient] = useState("");
  const [age, setAge] = useState("Any age");
  const [occasion, setOccasion] = useState("Birthday");
  const [budget, setBudget] = useState("$25–$50");
  const [interests, setInterests] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [shortlistHost, setShortlistHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setShortlistHost(document.getElementById("shortlist-root"));
  }, []);

  useEffect(() => {
    if (!showGiftModal) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowGiftModal(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGiftModal]);

  const maxBudget = budgets.find((b) => b.label === budget)?.max ?? 50;

  const results = useMemo(() => {
    const terms = interests.toLowerCase().split(/[,\s]+/).filter(Boolean);
    const ageNum = age === "Any age" ? null : Number(age);

    return products
      .filter((p) => p.status === "active" && (p.price == null || p.price <= maxBudget))
      .filter((p) => ageNum == null || ((p.age_min == null || ageNum >= p.age_min) && (p.age_max == null || ageNum <= p.age_max)))
      .map((p) => {
        const searchable = [p.title, p.description ?? "", p.category ?? "", ...(p.tags ?? [])].join(" ").toLowerCase();
        const interestScore = terms.reduce((score, term) => score + (searchable.includes(term) ? 2 : 0), 0);
        const occasionScore = (p.occasions ?? []).some((item) => item.toLowerCase() === occasion.toLowerCase()) ? 2 : 0;
        return { product: p, score: interestScore + occasionScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((item) => item.product);
  }, [products, maxBudget, age, interests, occasion]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSearching) return;
    setSubmitted(false);
    setShowGiftModal(false);
    setIsSearching(true);
    window.setTimeout(() => {
      setIsSearching(false);
      setShowGiftModal(true);
    }, 1350);
  }

  function openShortlist() {
    setShowGiftModal(false);
    setSubmitted(true);
    window.setTimeout(() => {
      document.getElementById("shortlist-root")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <>
    <section className="finder-card" aria-labelledby="finder-title">
      <div className="finder-topline">
        <span className="finder-step"><span>1</span> YOUR GIFT DETAILS</span>
        <span className="time-note">ABOUT 60 SECONDS</span>
      </div>

      <div className="finder-heading">
        <h2 id="finder-title">Who are we shopping for?</h2>
        <p>A few details help us find a more personal fit.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field field-recipient">
            <span>Who is the gift for?</span>
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. my brother, best friend..." />
          </label>

          <label className="field">
            <span>Age range</span>
            <select value={age} onChange={(e) => setAge(e.target.value)}>
              <option>Any age</option>
              <option value="5">Under 13</option>
              <option value="16">13–17</option>
              <option value="25">18–34</option>
              <option value="45">35–54</option>
              <option value="65">55+</option>
            </select>
          </label>

          <label className="field">
            <span>Occasion</span>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              {occasions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <label className="field field-budget">
            <span>Budget</span>
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              {budgets.map((item) => <option key={item.label}>{item.label}</option>)}
            </select>
          </label>

          <label className="field field-interests">
            <span>What are they into? <small>OPTIONAL</small></span>
            <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Cooking, outdoors, technology, fitness..." />
          </label>
        </div>

        <button className="primary-button" type="submit" disabled={isSearching}>
          {isSearching ? (
            <><span className="button-searching"><i /> Finding thoughtful gifts...</span><span className="button-arrow">✦</span></>
          ) : (
            <>Find gift ideas <span>→</span></>
          )}
        </button>
      </form>

      <p className="privacy-note"><span>✦</span> No account needed. Just thoughtful ideas.</p>

      {isSearching && (
        <div className="searching-panel" role="status" aria-live="polite">
          <div className="searching-orbit" aria-hidden="true"><span>✦</span><i /></div>
          <div><strong>Finding thoughtful gifts...</strong><small>Putting together a shortlist they'll love.</small></div>
        </div>
      )}

      {showGiftModal && (
        <GiftRevealModal
          count={results.length}
          onViewShortlist={openShortlist}
          onClose={() => setShowGiftModal(false)}
        />
      )}


    </section>
      {submitted && shortlistHost && createPortal(
        <section className="shortlist-section" aria-labelledby="shortlist-heading">
          <div className="shortlist-inner">
            <div className="shortlist-intro">
              <span className="eyebrow">PERSONALIZED FOR YOU</span>
              <h2 id="shortlist-heading">Your gift shortlist</h2>
              <p>Thoughtful ideas, selected around the person and occasion you shared.</p>
            </div>
            <div className="results" id="results">
          <div className="results-title">
            <div>
              <span className="eyebrow">YOUR GIFT SHORTLIST</span>
              <h3>{results.length ? `Ideas for ${recipient.trim() || "your recipient"}` : products.length ? "Let's broaden the search" : "Our gift catalog is getting ready"}</h3>
            </div>
            <button className="text-button" type="button" onClick={() => setSubmitted(false)}>Edit answers</button>
          </div>

          {results.length === 0 ? (
            <p className="muted">{products.length ? "No matches in this catalog. Try a higher budget or broader interests." : "We are connecting the verified GiftScout catalog. Please check back soon."}</p>
          ) : (
            <div className="product-grid">
              {results.map((product, index) => (
                <article className="product-card" key={product.id} style={{ animationDelay: `${index * 75}ms` }}>
                  <div className="product-image">
                    {product.image_url ? <img src={product.image_url} alt={product.title} /> : <span>Gift idea</span>}
                  </div>
                  <div className="product-info">
                    {product.is_sponsored && <span className="sponsored">Sponsored</span>}
                    <h4>{product.title}</h4>
                    <p>{product.description}</p>
                    <div className="product-bottom">
                      <strong>
                        {product.price == null
                          ? "See price"
                          : new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency || "USD" }).format(product.price)}
                      </strong>
                      <a href={`/api/click?product=${encodeURIComponent(product.id)}`} target="_blank" rel="noreferrer">View gift ↗</a>
                    </div>
                    <small>{product.retailer_name}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="disclosure">GiftScout may earn a commission from qualifying purchases. Sponsored placements will be clearly labeled.</p>
            </div>
          </div>
        </section>,
        shortlistHost
      )}
    </>
  );
}
