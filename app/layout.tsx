import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Informasi Desa Digital",
  description: "Website Sistem Informasi Desa Digital terintegrasi dan informatif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <head>
        <title>Sistem Informasi Desa Digital</title>
        <meta name="description" content="Website Sistem Informasi Desa Digital terintegrasi dan informatif." />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md bg-background text-on-surface flex flex-col min-h-screen">
        <Header />
        <main className="w-full pt-16 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
