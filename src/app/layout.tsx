import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dress Code Decoder",
  description: "Plain-English guidance on what to wear for any dress code.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
