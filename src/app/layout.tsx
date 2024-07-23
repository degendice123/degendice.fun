import type { Metadata } from "next";
import { Montserrat as FontSans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'

import { ThemeProvider } from "@/provider/theme";

import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://degen-dice.vercel.app/"),
  title: "Degen Dice",
  description: "Welcome to a game of Big & Small Dice",
  openGraph: {
    title: "Degen Dice",
    description: "Welcome to a game of Big & Small Dice",
    images: [
      {
        url: "/opengraph-image.png",
        width: 200,
        height: 200,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center justify-between p-4 min-w-[330px]">
            {children}
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-WZPSDX3ELV" />
      <GoogleTagManager gtmId="G-WZPSDX3ELV" />
    </html>
  );
}
