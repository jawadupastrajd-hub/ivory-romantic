import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Bilal Aslam & Fatima Waheed — Wedding Invitation", description: "Luxury white and gold wedding invitation of Bilal Aslam & Fatima Waheed with animated envelope, event schedule, event schedule and RSVP." };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Great+Vibes&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" /></head><body>{children}</body></html>; }
