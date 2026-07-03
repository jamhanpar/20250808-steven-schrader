import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import clsx from "clsx";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import ContactModalProvider from "./components/contact-modal-provider/ContactModalProvider";
import { ModalUrlHandlerWrapper } from "./components/modal-url-handler/ModalUrlHandlerWrapper";
import { AudioPlayerProvider } from "./components/audio-player-provider/AudioPlayerProvider";
import AudioPlayer from "./components/audio-player/AudioPlayer";
import "./globals.css";
import "./app.css";

//--- Font Imports and Setup ---//
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
    "Steven Schrader was born in New York in 1935 and lives on the Upper West Side. A writer of short autobiographical stories, he was previously the director of Teachers & Writers Collaborative, an arts organization that sends writers into public schools.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts CDN to eliminate connection overhead
            when loading font files, reducing FOUT/FOIT and improving performance */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={clsx(geistSans.variable, geistMono.variable, "antialiased")}
        suppressHydrationWarning
      >
        <AudioPlayerProvider>
          <ContactModalProvider>
            <ModalUrlHandlerWrapper />
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
          </ContactModalProvider>
          <AudioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
