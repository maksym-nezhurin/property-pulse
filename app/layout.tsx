import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {Navbar} from "@/components/Navbar";
import "../assets/styles/globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AuthProvider>
          <html lang="en">
          <body className={inter.className}>
          <Navbar />
          <div>{children}</div>
          </body>
          </html>
      </AuthProvider>
  );
}
