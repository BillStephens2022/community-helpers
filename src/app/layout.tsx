import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "./_components/layout/Header";
import Footer from "./_components/layout/Footer";
import { auth } from "../../auth";
import ClientLayout from "./clientLayout";
import "./globals.css";

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
  title: "Community Helpers",
  description: "Neighbors with skills helping neighbors in need",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} root`}>
          <ClientLayout session={session}>
            <Header />
            <div className="mainContent">
            {children}
            </div>
            <Footer />
          </ClientLayout>
      </body>
    </html>
  );
}
