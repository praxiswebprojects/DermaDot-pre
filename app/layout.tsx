import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL } from "./seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DermaDot — Scalp Micropigmentation Αθήνα",
    template: "%s — DermaDot",
  },
  description:
    "Κλινική μικροχρωμάτωσης τριχωτού κεφαλής στην Αθήνα. Φυσικό, εξατομικευμένο αποτέλεσμα με κλινική ακρίβεια.",
  openGraph: {
    title: "DermaDot — Scalp Micropigmentation",
    description: "Precision that looks natural. Confidence that feels yours.",
    type: "website",
    images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 800, alt: "DermaDot — Scalp Micropigmentation in Athens" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DermaDot — Scalp Micropigmentation",
    description: "Precision that looks natural. Confidence that feels yours.",
    images: [`${SITE_URL}/og.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsToken = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN?.trim();

  return (
    <html lang="el">
      <body>
        {children}
        {analyticsToken ? (
          <Script
            id="cloudflare-web-analytics"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            type="module"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
