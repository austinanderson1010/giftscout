import type { GiftProduct } from "./types";

export const demoProducts: GiftProduct[] = [
  {
    id: "demo-1", title: "Personalized Leather Journal", description: "A thoughtful everyday journal for notes, plans, and ideas.",
    retailer_name: "Example retailer", product_url: "https://example.com", affiliate_url: null,
    image_url: null, price: 34.00, currency: "USD", category: "Personalized",
    tags: ["thoughtful", "writing", "personalized"], occasions: ["birthday", "anniversary", "christmas"],
    age_min: 18, age_max: 99, status: "active", is_sponsored: false, sponsor_label: null
  },
  {
    id: "demo-2", title: "Portable Bluetooth Speaker", description: "A compact speaker for music at home or on the go.",
    retailer_name: "Example retailer", product_url: "https://example.com", affiliate_url: null,
    image_url: null, price: 49.00, currency: "USD", category: "Tech",
    tags: ["tech", "music", "travel"], occasions: ["birthday", "graduation", "christmas"],
    age_min: 13, age_max: 99, status: "active", is_sponsored: false, sponsor_label: null
  },
  {
    id: "demo-3", title: "Premium Coffee Tasting Set", description: "A sampler set for someone who enjoys trying new coffees.",
    retailer_name: "Example retailer", product_url: "https://example.com", affiliate_url: null,
    image_url: null, price: 28.00, currency: "USD", category: "Food & Drink",
    tags: ["coffee", "food", "experience"], occasions: ["birthday", "thank-you", "housewarming"],
    age_min: 18, age_max: 99, status: "active", is_sponsored: false, sponsor_label: null
  },
  {
    id: "demo-4", title: "Cozy Weighted Throw Blanket", description: "A soft home gift for relaxing evenings.",
    retailer_name: "Example retailer", product_url: "https://example.com", affiliate_url: null,
    image_url: null, price: 59.00, currency: "USD", category: "Home",
    tags: ["home", "cozy", "relaxation"], occasions: ["birthday", "christmas", "housewarming"],
    age_min: 16, age_max: 99, status: "active", is_sponsored: false, sponsor_label: null
  },
  {
    id: "demo-5", title: "Creative Building Kit", description: "A hands-on building activity for curious makers.",
    retailer_name: "Example retailer", product_url: "https://example.com", affiliate_url: null,
    image_url: null, price: 42.00, currency: "USD", category: "Games & Hobbies",
    tags: ["creative", "building", "family"], occasions: ["birthday", "christmas"],
    age_min: 8, age_max: 16, status: "active", is_sponsored: false, sponsor_label: null
  },
  {
    id: "demo-6", title: "Everyday Carry Organizer", description: "A practical organizer for small essentials.",
    retailer_name: "Example retailer", product_url: "https://example.com", affiliate_url: null,
    image_url: null, price: 24.00, currency: "USD", category: "Accessories",
    tags: ["practical", "organization", "travel"], occasions: ["birthday", "father's day", "christmas"],
    age_min: 16, age_max: 99, status: "active", is_sponsored: false, sponsor_label: null
  }
];
