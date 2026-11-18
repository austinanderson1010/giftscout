"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { GiftProduct } from "@/lib/types";

type ProductDraft = {
  title: string;
  description: string;
  retailer_name: string;
  product_url: string;
  affiliate_url: string;
  image_url: string;
  price: string;
  category: string;
  tags: string;
  occasions: string;
  age_min: string;
  age_max: string;
  status: "active" | "draft" | "archived";
  is_sponsored: boolean;
  sponsor_label: string;
};

const blankDraft: ProductDraft = {
  title: "", description: "", retailer_name: "", product_url: "",
  affiliate_url: "", image_url: "", price: "", category: "",
  tags: "", occasions: "", age_min: "", age_max: "",
  status: "draft", is_sponsored: false, sponsor_label: ""
};

function makeClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

function csv(value: string) {
  return value.split(",").map((part) => part.trim()).filter(Boolean);
}

export default function AdminPage() {
  const client = useMemo(makeClient, []);
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<GiftProduct[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [draft, setDraft] = useState<ProductDraft>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "archived">("all");

  useEffect(() => {
    if (!client) { setChecking(false); setMessage("Supabase environment variables are missing."); return; }
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void checkAdmin(data.session.user.id);
      else setChecking(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setChecking(true);
        void checkAdmin(nextSession.user.id);
      } else {
        setAuthorized(false);
        setProducts([]);
        setChecking(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [client]);

  async function checkAdmin(_userId: string) {
    if (!client) return;
    // Use the SECURITY DEFINER database function so the browser does not
    // depend on direct SELECT access to the admin_users table.
    const { data, error } = await client.rpc("is_giftscout_admin");
    if (error) {
      setAuthorized(false);
      setMessage(`Could not verify administrator access: ${error.message}`);
      setChecking(false);
      return;
    }
    if (data !== true) {
      setAuthorized(false);
      setMessage("Supabase confirmed this session, but the administrator check returned false. Verify that this signed-in user's UID is in public.admin_users.");
      setChecking(false);
      return;
    }
    setAuthorized(true);
    setMessage("");
    setChecking(false);
    await loadDashboard();
  }

  async function loadDashboard() {
    if (!client) return;
    const [{ data, error }, { count }] = await Promise.all([
      client.from("products").select("*").order("created_at", { ascending: false }).limit(500),
      client.from("product_clicks").select("*", { count: "exact", head: true })
    ]);
    if (error) setMessage(error.message);
    else setProducts((data ?? []) as GiftProduct[]);
    setClickCount(count ?? 0);
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true); setMessage("");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    setBusy(false);
  }

  async function signOut() {
    if (client) await client.auth.signOut();
  }

  function startEdit(product: GiftProduct) {
    setEditingId(product.id);
    setDraft({
      title: product.title ?? "",
      description: product.description ?? "",
      retailer_name: product.retailer_name ?? "",
      product_url: product.product_url ?? "",
      affiliate_url: product.affiliate_url ?? "",
      image_url: product.image_url ?? "",
      price: product.price == null ? "" : String(product.price),
      category: product.category ?? "",
      tags: (product.tags ?? []).join(", "),
      occasions: (product.occasions ?? []).join(", "),
      age_min: product.age_min == null ? "" : String(product.age_min),
      age_max: product.age_max == null ? "" : String(product.age_max),
      status: product.status,
      is_sponsored: product.is_sponsored,
      sponsor_label: product.sponsor_label ?? ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() { setDraft(blankDraft); setEditingId(null); }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    if (!draft.title.trim() || !draft.retailer_name.trim() || !/^https?:\/\//i.test(draft.product_url)) {
      setMessage("Enter a product title, retailer name, and a valid product URL beginning with http:// or https://.");
      return;
    }
    if (draft.affiliate_url && !/^https?:\/\//i.test(draft.affiliate_url)) {
      setMessage("Affiliate URL must begin with http:// or https://.");
      return;
    }
    setBusy(true); setMessage("");
    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      retailer_name: draft.retailer_name.trim(),
      product_url: draft.product_url.trim(),
      affiliate_url: draft.affiliate_url.trim() || null,
      image_url: draft.image_url.trim() || null,
      price: draft.price === "" ? null : Number(draft.price),
      currency: "USD",
      category: draft.category.trim() || null,
      tags: csv(draft.tags),
      occasions: csv(draft.occasions),
      age_min: draft.age_min === "" ? null : Number(draft.age_min),
      age_max: draft.age_max === "" ? null : Number(draft.age_max),
      status: draft.status,
      is_sponsored: draft.is_sponsored,
      sponsor_label: draft.is_sponsored ? (draft.sponsor_label.trim() || "Sponsored") : null,
      updated_at: new Date().toISOString()
    };
    const result = editingId
      ? await client.from("products").update(payload).eq("id", editingId)
      : await client.from("products").insert(payload);
    if (result.error) setMessage(result.error.message);
    else { setMessage(editingId ? "Product updated." : "Product added."); resetForm(); await loadDashboard(); }
    setBusy(false);
  }

  async function archiveProduct(product: GiftProduct) {
    if (!client || !window.confirm(`Archive "${product.title}"? It will no longer appear in public gift results.`)) return;
    const { error } = await client.from("products").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", product.id);
    if (error) setMessage(error.message);
    else { setMessage("Product archived."); await loadDashboard(); }
  }

  const visibleProducts = products.filter((product) => filter === "all" || product.status === filter);

  if (checking) return <main className="admin-shell"><div className="admin-panel"><p>Checking administrator access…</p></div></main>;

  if (!session) return (
    <main className="admin-shell">
      <div className="admin-panel admin-login">
        <a className="admin-brand" href="/">GiftScout</a>
        <span className="eyebrow">PRIVATE ADMIN WORKSPACE</span>
        <h1>Sign in</h1>
        <p>Use the administrator account created in your Supabase project.</p>
        {message && <p className="admin-message">{message}</p>}
        <form onSubmit={signIn} className="admin-login-form">
          <label>Email<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button className="primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <span>→</span></button>
        </form>
        <a className="back-link" href="/">← Back to GiftScout</a>
      </div>
    </main>
  );

  if (!authorized) return (
    <main className="admin-shell">
      <div className="admin-panel">
        <span className="eyebrow">ACCESS NOT GRANTED</span>
        <h1>Administrator access required</h1>
        <p>{message || "This Supabase account is not authorized to manage GiftScout."}</p>
        <button className="admin-secondary-button" onClick={signOut}>Sign out</button>
      </div>
    </main>
  );

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><a className="admin-brand" href="/">GiftScout</a><span className="admin-header-label">CONTROL ROOM</span></div>
        <div className="admin-user"><span>{session.user.email}</span><button onClick={signOut}>Sign out</button></div>
      </header>

      <section className="admin-content">
        <div className="admin-page-heading">
          <div><span className="eyebrow">GIFTSCOUT OPERATIONS</span><h1>Dashboard</h1><p>Manage the catalog and monitor product interest.</p></div>
          <button className="admin-secondary-button" onClick={() => void loadDashboard()}>Refresh data ↻</button>
        </div>

        {message && <p className="admin-message">{message}</p>}

        <div className="admin-metrics">
          <article><span>CATALOG PRODUCTS</span><strong>{products.length}</strong></article>
          <article><span>ACTIVE PRODUCTS</span><strong>{products.filter(p => p.status === "active").length}</strong></article>
          <article><span>TRACKED PRODUCT CLICKS</span><strong>{clickCount}</strong></article>
        </div>

        <section className="admin-section">
          <div className="admin-section-heading"><div><span className="eyebrow">CATALOG MANAGEMENT</span><h2>{editingId ? "Edit product" : "Add a product"}</h2></div>{editingId && <button className="text-button" type="button" onClick={resetForm}>Cancel edit</button>}</div>
          <form className="product-admin-form" onSubmit={saveProduct}>
            <label>Product name<input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} required /></label>
            <label>Retailer name<input value={draft.retailer_name} onChange={e => setDraft({ ...draft, retailer_name: e.target.value })} required /></label>
            <label className="wide">Description<textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={2} /></label>
            <label>Retailer product URL<input type="url" placeholder="https://" value={draft.product_url} onChange={e => setDraft({ ...draft, product_url: e.target.value })} required /></label>
            <label>Affiliate URL<input type="url" placeholder="https:// (leave blank until approved)" value={draft.affiliate_url} onChange={e => setDraft({ ...draft, affiliate_url: e.target.value })} /></label>
            <label className="wide">Product image URL<input type="url" placeholder="https://..." value={draft.image_url} onChange={e => setDraft({ ...draft, image_url: e.target.value })} /></label>
            <label>Price (USD)<input type="number" min="0" step="0.01" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} /></label>
            <label>Category<input value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} placeholder="Home, Tech, Beauty…" /></label>
            <label>Tags (comma separated)<input value={draft.tags} onChange={e => setDraft({ ...draft, tags: e.target.value })} /></label>
            <label>Occasions (comma separated)<input value={draft.occasions} onChange={e => setDraft({ ...draft, occasions: e.target.value })} /></label>
            <label>Minimum age<input type="number" min="0" value={draft.age_min} onChange={e => setDraft({ ...draft, age_min: e.target.value })} /></label>
            <label>Maximum age<input type="number" min="0" value={draft.age_max} onChange={e => setDraft({ ...draft, age_max: e.target.value })} /></label>
            <label>Status<select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as ProductDraft["status"] })}><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option></select></label>
            <label className="admin-check"><input type="checkbox" checked={draft.is_sponsored} onChange={e => setDraft({ ...draft, is_sponsored: e.target.checked })} /> Sponsored placement</label>
            {draft.is_sponsored && <label>Sponsor label<input value={draft.sponsor_label} onChange={e => setDraft({ ...draft, sponsor_label: e.target.value })} placeholder="Sponsored" /></label>}
            <div className="wide admin-form-actions"><button className="primary-button" disabled={busy}>{busy ? "Saving…" : editingId ? "Save changes" : "Add product"} <span>→</span></button></div>
          </form>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading"><div><span className="eyebrow">PRODUCT LIBRARY</span><h2>Products</h2></div><select className="admin-filter" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}><option value="all">All products</option><option value="active">Active</option><option value="draft">Drafts</option><option value="archived">Archived</option></select></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Retailer</th><th>Price</th><th>Status</th><th>Affiliate URL</th><th>Actions</th></tr></thead>
              <tbody>
                {visibleProducts.map(product => <tr key={product.id}>
                  <td><strong>{product.title}</strong><small>{product.category || "Uncategorized"}</small></td>
                  <td>{product.retailer_name}</td>
                  <td>{product.price == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency || "USD" }).format(product.price)}</td>
                  <td><span className={`status-pill ${product.status}`}>{product.status}</span></td>
                  <td>{product.affiliate_url ? "Added" : "Not added"}</td>
                  <td><div className="table-actions"><button onClick={() => startEdit(product)}>Edit</button>{product.status !== "archived" && <button onClick={() => void archiveProduct(product)}>Archive</button>}</div></td>
                </tr>)}
                {visibleProducts.length === 0 && <tr><td colSpan={6}>No products in this view yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <p className="admin-footnote">Click totals count tracked outbound product clicks. They are not confirmed purchases or commission revenue. Affiliate conversion imports and payout reconciliation are the next backend stage.</p>
      </section>
    </main>
  );
}
