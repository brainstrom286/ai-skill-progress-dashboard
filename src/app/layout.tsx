import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Skill Progress Dashboard",
    description: "Track progress and get AI study plans",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
        <body suppressHydrationWarning className="bg-gray-950 text-gray-100">{children}</body>
        </html>
    );
}
