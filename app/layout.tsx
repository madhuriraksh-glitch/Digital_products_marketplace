import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Master Market",
  description:
    "Discover and shop premium digital products at Master Market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}