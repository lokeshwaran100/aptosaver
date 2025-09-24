import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Banner } from "@/components/Banner";
import Navbar from "@/components/Navbar";
import { Toaster } from '@/components/ui/toaster';
import { WalletProvider } from "@/components/WalletProvider";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { Providers } from "./provider";

const dmSans = DM_Sans({ subsets: ["latin"] });

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AptoSaver",
  description: "Captilize on Aptos with AptoSaver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={cn(
              "min-h-screen bg-background text-foreground antialiased max-w-full overflow-x-hidden",
              font.className
          )}
      >  
      <Providers>
      <WalletProvider>
          {/* <Banner /> */}
          <Navbar />
          {children}
          <SpeedInsights />
          <Analytics />
          <Toaster />
        </WalletProvider>
      </Providers>
      </body>
    </html>
  );
}
