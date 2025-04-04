import type { Metadata } from "next";
import { IBM_Plex_Sans_Condensed, League_Gothic } from "next/font/google";
import "./globals.css";

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-condensed",
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-league-gothic",
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "By Kyle Nathaniel Vinuya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <div className="w-screen h-16 bg-white">
        <div className="flex items-center justify-start h-full pl-12">
          <h1 className="text-3xl font-bold font-mono text-gray-800">
            Pokédex
          </h1>
        </div>
      </div>
      <body
        className={`${leagueGothic.variable} ${ibmPlexSansCondensed.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
