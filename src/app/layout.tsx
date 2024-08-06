"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "easy-peasy";
import { store } from "./store/store";
import Script from "next/script";
import MyNavBar from "./components/MyNavBar";
import { useStoreState } from "./hooks/hooks";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="winter">
      <head>
        <Script src="http://localhost:8097"></Script>
      </head>
      <body className={inter.className}>
        <StoreProvider store={store}>{children}</StoreProvider>
      </body>
    </html>
  );
}
