import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Divine Netcare Hospital | Quality Healthcare in Kumasi, Ghana",
    template: "%s | Divine Netcare Hospital",
  },
  description:
    "Divine Netcare Hospital provides premium 24/7 medical care, maternity, surgery, eye care, and laboratory diagnostics in Kronum-Abouhia, Kumasi. Your health is our divine calling.",
  keywords: [
    "Divine Netcare Hospital",
    "Hospital in Kumasi",
    "Best hospital in Ashanti Region",
    "Maternity delivery Kumasi",
    "24 hour emergency healthcare Ghana",
    "Kronum Abouhia medical center",
    "Eye clinic Kumasi",
    "Laboratory services Kumasi",
  ],
  authors: [{ name: "Divine Netcare Hospital" }],
  metadataBase: new URL("https://divinenetcarehospital.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Divine Netcare Hospital | Quality Healthcare in Kumasi",
    description:
      "Premium 24/7 emergency medical care, maternity services, eye diagnostics, and surgery located in Kronum-Abouhia, Kumasi.",
    url: "https://divinenetcarehospital.com",
    siteName: "Divine Netcare Hospital",
    locale: "en_GH",
    type: "website",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Divine Netcare Hospital Logo Identity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divine Netcare Hospital | Quality Healthcare in Kumasi",
    description:
      "Premium 24/7 healthcare services including surgery, emergency medicine, and laboratory diagnostics in Kumasi.",
    images: {
      url: "/logo.jpeg",
      alt: "Divine Netcare Hospital Logo Identity",
    },
  },
  icons: {
    icon: [
      { url: "/logo.jpeg", sizes: "32x32", type: "image/jpeg" },
      { url: "/logo.jpeg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: [{ url: "/logo.jpeg", sizes: "180x180", type: "image/jpeg" }],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
