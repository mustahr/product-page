import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "AutoCharge Maroc", description: "Chargeur voiture 4-en-1 avec livraison au Maroc" };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="fr"><body>{children}</body></html>}
