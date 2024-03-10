import React from "react";
import { Inter } from "next/font/google";
import {Navbar} from "@/components/Navbar";
import { ToastContainer } from 'react-toastify';
import AuthProvider from "@/components/AuthProvider";
import {GlobalProvider} from "@/context/global";

import type { Metadata } from "next";

import 'react-toastify/dist/ReactToastify.css';
import 'photoswipe/dist/photoswipe.css'
import "../assets/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Property Pulse App",
  description: "Property Pulse App created by Maksym",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <GlobalProvider>
          <AuthProvider>
              <html lang="en">
                  <body className={inter.className}>
                      <Navbar />
                      <div>{children}</div>
                      <ToastContainer />
                  </body>
              </html>
          </AuthProvider>
      </GlobalProvider>
  );
}
