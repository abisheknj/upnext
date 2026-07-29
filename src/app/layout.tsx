import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "upNext",
    template: "%s | upNext",
  },
  description: "Realtime nightlife and DJ request platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
