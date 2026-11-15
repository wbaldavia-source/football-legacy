import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "FOOTBALL LEGACY – World Career", description: "Construa sua história no futebol: jogador, treinador ou dirigente." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
