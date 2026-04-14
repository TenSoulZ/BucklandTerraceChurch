import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "@/styles/bootstrap-custom.scss";
import "./globals.css";
import Providers from "./providers";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap', adjustFontFallback: false });
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: 'swap',
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: "Buckland Terrace Community Church",
  description: "Welcome to Buckland Terrace Community Church - Join Us & Watch Sermons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lato.variable}`}>
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
