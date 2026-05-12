import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export const metadata: Metadata = {
  title: "Portfolio - Software Developer",
  description:
    "Professional portfolio showcasing web development projects, skills, and experience",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-oid="b1jifow">
      <body className="antialiased" data-oid="hqec2:a">
        <ThemeProvider>
          {children}
        </ThemeProvider>

        <Script
          src="https://cdn.jsdelivr.net/gh/onlook-dev/onlook@d3887f2/apps/web/client/public/onlook-preload-script.js"
          strategy="afterInteractive"
          type="module"
          id="onlook-preload-script"
          data-oid="14mm6vu"
        ></Script>
      </body>
    </html>
  );
}
