import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { IBM_Plex_Sans_Condensed, League_Gothic } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/topbar";

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
  description: "By Kyle Nathaniel Vinuya for Old.St Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" sizes="any" />
      </head>
      <body
        className={`${leagueGothic.variable} ${ibmPlexSansCondensed.variable} antialiased`}
      >
        <TopBar />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
