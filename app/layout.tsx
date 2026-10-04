import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Mustahr Store", icons: { icon: "/favicon.svg" }, description: "Chargeur voiture au Maroc et قطاعة خضروات en Libye" };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="fr"><body>{children}</body></html>}
