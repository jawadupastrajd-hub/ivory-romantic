import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Usman Tariq & Maryam Siddiqui — Wedding Invitation", description: "Royal wedding invitation of Usman Tariq & Maryam Siddiqui with animated envelope, event schedule, scratch-to-reveal date and RSVP." };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
