import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "ObserveSpace is a data-driven platform that compares satellite-derived vegetation indices such as NDVI (Normalized Difference Vegetation Index) and NDWI (Normalized Difference Water Index) to help users monitor land and water dynamics across regions.",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
