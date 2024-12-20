import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {FeedProvider} from "@/contex/FeedContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BookHub",
  description: "A social platform for book lovers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
    <FeedProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#051B32]`}
      >
        {children}
      </body>
      </FeedProvider>
    </html>
  );
}
