"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "easy-peasy";
import { store } from "./store/store";
import { RouteChangeListener } from "./hooks/useRouteChangeListener";
import MyNavBar from "./components/MyNavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTransition from "./components/PageTransition";

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
        <link
          rel="icon"
          href="https://firebasestorage.googleapis.com/v0/b/mydhule-3635d.appspot.com/o/my_assets%2Ficon%2Fmy%20dhule%20appIcon.png?alt=media&token=2cac825d-2001-43e6-a8e8-9d5d0276d5a9"
          about="web app icon"
        />
      </head>
      <body className={inter.className}>
        <PageTransition>
          <StoreProvider store={store}>
            <RouteChangeListener />
            <MyNavBar />
            {children}
          </StoreProvider>
        </PageTransition>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{
            position: "fixed", // Fix the toast in the viewport
            top: "20px", // Adjust distance from top
            right: "20px", // Adjust distance from right
            zIndex: 9999, // Ensure it stays above other content
            pointerEvents: "auto", // Allow interaction with toast
          }}
        />
      </body>
    </html>
  );
}
