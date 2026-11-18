import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GiftScout — Thoughtful gifts. Zero guesswork.",
  description: "Discover thoughtful gifts for every person, occasion, and budget."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
