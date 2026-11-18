import { NextRequest, NextResponse } from "next/server";
import { demoProducts } from "@/lib/demo-products";
import { hasSupabase, supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("product");
  if (!id) return NextResponse.redirect(new URL("/", request.url));
  let destination: string | null = null;
  if (hasSupabase && supabase) {
    const { data } = await supabase.from("products").select("id, product_url, affiliate_url").eq("id", id).maybeSingle();
    if (data) {
      destination = data.affiliate_url || data.product_url;
      await supabase.from("product_clicks").insert({ product_id: data.id, referrer: request.headers.get("referer") || null });
    }
  }
  if (!destination) {
    const demo = demoProducts.find(p => p.id === id);
    destination = demo?.affiliate_url || demo?.product_url || null;
  }
  if (!destination || !/^https?:\/\//i.test(destination)) return NextResponse.redirect(new URL("/", request.url));
  return NextResponse.redirect(destination);
}
