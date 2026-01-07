import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaxCalc Nigeria - Nigeria Tax Calculator 2025",
  description: "The definitive Tax Intelligence Platform for Nigeria. Calculate PIT, CIT, CGT, VAT under the Nigeria Tax Act 2025. Compare old vs new tax laws.",
  keywords: ["Nigeria tax calculator", "PIT calculator Nigeria", "Income tax Nigeria 2025", "Tax Act 2025"],
};

import { ThemeProvider } from "@/components/theme-provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col relative overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            {/* Ambient Background Grid */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none z-[-1]" />
            <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-[-1]" />
            
            <Header />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
