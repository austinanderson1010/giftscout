export type GiftProduct = {
  id: string;
  title: string;
  description: string | null;
  retailer_name: string;
  product_url: string;
  affiliate_url: string | null;
  image_url: string | null;
  price: number | null;
  currency: string;
  category: string | null;
  tags: string[];
  occasions: string[];
  age_min: number | null;
  age_max: number | null;
  status: "active" | "draft" | "archived";
  is_sponsored: boolean;
  sponsor_label: string | null;
};
