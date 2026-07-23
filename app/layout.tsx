import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-geist",
  subsets: ["latin", "greek"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "DermaDot — Precision that looks natural." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "DermaDot — Scalp Micropigmentation",
      description: "Precision that looks natural. Confidence that feels yours.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body className={notoSans.variable}>{children}</body>
    </html>
  );
}
