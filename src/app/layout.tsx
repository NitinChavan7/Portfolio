import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import { GlobalChrome } from "@/components/layout/global-chrome";
import { siteConfig } from "@/config/site";
import "locomotive-scroll/locomotive-scroll.css";
import "./reference.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-geist",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "HRMS",
    "Payroll",
    "React",
    "Node.js",
    "PostgreSQL",
  ],
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
    type: "website",
    url: "/",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.title,
      email: `mailto:${siteConfig.email}`,
      telephone: siteConfig.phone,
      sameAs: [siteConfig.linkedin, siteConfig.github, siteConfig.leetcode].filter(
        Boolean,
      ),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ];
  return (
    <html
      lang="en"
      className={`${geist.variable} ${manrope.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <GlobalChrome>{children}</GlobalChrome>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
