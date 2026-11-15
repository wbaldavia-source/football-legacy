import "./globals.css";
import type { Metadata } from "next";
export const metadata:Metadata = {title:"FOOTBALL LEGACY – World Career",description:"Construa sua história no futebol."};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html>; }