// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";


const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AtlasGDP",
  description: "Visualizing the why in world wealth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable} atlas-body`}>
        {children}
      </body>
    </html>
  );
}
