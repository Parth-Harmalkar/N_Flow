import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "N-Flow — Strategic Resource Interface",
  description: "Modular workspace for operations, risk, and personnel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} antialiased`}>
      <body className={`${syne.variable} font-sans bg-[var(--background)] text-[var(--foreground)]`}>
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}