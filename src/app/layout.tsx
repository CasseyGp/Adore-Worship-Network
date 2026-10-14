import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { event, site } from "@/content/site";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const title = `${event.name} — ${site.name}`;
const description = `An intimate evening of deep music, worship, reflection, and professional therapeutic support, in collaboration with ${event.partner}. ${event.dateLabel}, ${event.timeLabel}.`;

export const metadata: Metadata = {
  title: { default: title, template: `%s — ${site.name}` },
  description,
  applicationName: site.name,
  openGraph: { title, description, type: "website", siteName: site.name, locale: "en_NG" },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#070e24",
  colorScheme: "dark",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${instrumentSerif.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
