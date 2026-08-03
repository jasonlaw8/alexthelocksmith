import type { Metadata } from "next";
import Script from "next/script";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { PostHogAnalytics } from "@/components/posthog-analytics";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://alexthelocksmith.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Alex the Locksmith – Bay Area Locksmith Services",
  description:
    "Alex the Locksmith provides fast, reliable 24/7 locksmith services in San Mateo, Belmont, San Carlos, Redwood City, Palo Alto & the SF Bay Area—emergency lockouts, rekeying, and digital lock installs. Call (650) 444-1034 today!",
  alternates: {
    canonical: "https://alexthelocksmith.net/",
  },
  openGraph: {
    title: "Alex the Locksmith – Bay Area Locksmith Services",
    description:
      "Fast, reliable 24/7 locksmith services in San Mateo, Belmont, San Carlos, Redwood City, Palo Alto & the SF Bay Area. Call (650) 444-1034 for immediate help.",
    url: "https://alexthelocksmith.net/",
    type: "website",
    images: ["/images/favicon-96x96.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex the Locksmith – Bay Area Locksmith Services",
    description:
      "Serving San Mateo, Palo Alto & beyond. 24/7 emergency lockouts, rekeying & smart lock installs.",
    images: ["/images/favicon-96x96.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/images/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts (Inter) — kept on the same CDN as the original site. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M2SJQ4VP');`}</Script>

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S8EVGNLBNK"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-S8EVGNLBNK');`}</Script>

        <LocalBusinessSchema />
      </head>
      <body className="text-gray-900">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M2SJQ4VP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <PostHogAnalytics />
        {children}
      </body>
    </html>
  );
}
