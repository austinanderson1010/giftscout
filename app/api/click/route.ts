import { NextRequest, NextResponse } from "next/server";
import { hasSupabase, supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("product");
  if (!id || !hasSupabase || !supabase) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, status, product_url, affiliate_url")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const destination = data.affiliate_url || data.product_url;
  let destinationUrl: URL;

  try {
    destinationUrl = new URL(destination);
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only redirect to secure retailer/affiliate destinations stored on an
  // active catalog record. Draft and archived records are never routable.
  if (destinationUrl.protocol !== "https:") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Click tracking is best-effort; a tracking write failure must not block
  // the customer's retailer visit.
  await supabase.from("product_clicks").insert({
    product_id: data.id,
    referrer: request.headers.get("referer") || null
  });

  return NextResponse.redirect(destinationUrl);
}
