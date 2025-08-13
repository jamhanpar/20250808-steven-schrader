import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import clsx from "clsx";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steven Schrader",
  description:
    "Steven Schrader is a talented writer recognized for his engaging storytelling and insightful perspectives. With a passion for crafting compelling narratives, Steven brings creativity and depth to every project. His work spans various genres, reflecting a keen understanding of language and a dedication to connecting with readers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={clsx("root-layout", "flex flex-col min-h-screen")}>
          <Nav classname="bg-accent" />
          <main
            className={clsx(
              "main-layout",
              "flex-1 flex flex-col items-center w-full"
            )}
          >
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
