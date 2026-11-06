import type { Metadata } from "next";
import "./globals.css";
import { getDbAsync } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDbAsync();
  const settings = db.settings;

  return {
    title: {
      default: `${settings.businessName} — Jasa Instalasi Listrik, AC & Bor Sumur`,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.tagline,
    keywords: [
      "Jasa instalasi listrik Tangerang Selatan",
      "Jasa listrik panggilan Tangsel",
      "Jasa cuci AC Tangerang Selatan",
      "Jasa pasang AC Tangsel",
      "Jasa bor sumur Tangerang Selatan",
      "Teknisi AC dan listrik Tangsel",
      "Bor sumur Pamulang Ciputat BSD",
      "Teknisi listrik bergaransi Tangsel",
    ],
    authors: [{ name: settings.businessName }],
    creator: settings.businessName,
    metadataBase: new URL("https://siteknik.com"),
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://siteknik.com",
      title: `${settings.businessName} — Jasa Instalasi Listrik, AC & Bor Sumur`,
      description: settings.heroSubheadline,
      siteName: settings.businessName,
      images: [
        {
          url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: "Teknisi SiTeknik Tangerang Selatan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.businessName,
      description: settings.heroSubheadline,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const db = await getDbAsync();
  const settings = db.settings;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.businessName,
    description: settings.tagline,
    url: "https://siteknik.com",
    telephone: settings.phoneDisplay,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: "Banten",
      postalCode: "15310",
      addressCountry: "ID",
    },
    areaServed: settings.serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:30",
      closes: "20:00",
    },
    priceRange: "Rp65.000 - Rp9.500.000",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200",
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-slate-800 bg-white selection:bg-brand-accent selection:text-white">
        <AppShell settings={settings}>{children}</AppShell>
      </body>
    </html>
  );
}
