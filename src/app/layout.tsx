import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import { Toaster } from "sonner";

import { createPageMetadata, organizationJsonLd } from "@/lib/seo";

import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = createPageMetadata({
  title: undefined,
  description:
    "İstanbul'da konut, ticari ve yatırım projeleri ile güvenilir inşaat ve gayrimenkul çözümleri.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${headingFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={organizationJsonLd}
        />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "rounded-xl border border-border bg-card text-foreground shadow-lg",
            },
          }}
          closeButton
        />
      </body>
    </html>
  );
}
