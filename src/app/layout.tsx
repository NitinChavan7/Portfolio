import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import { GlobalChrome } from "@/components/layout/global-chrome";
import { siteConfig } from "@/config/site";
import "locomotive-scroll/locomotive-scroll.css";
import "./reference.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-geist",
});

const sora = Sora({
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
  applicationName: `${siteConfig.name} Portfolio`,
  title: {
    default: siteConfig.shareTitle,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.shareDescription,
  keywords: [
    "Nitin Chavan",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Redux",
    "Express.js",
    "HRMS",
    "Payroll",
    "Hyderabad Developer",
    "React",
    "Node.js",
    "PostgreSQL",
    "REST APIs",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.shareTitle,
    description: siteConfig.shareDescription,
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Full Stack Developer portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.shareTitle,
    description: siteConfig.shareDescription,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071016",
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
      className={`${inter.variable} ${sora.variable} ${jetBrainsMono.variable}`}
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
