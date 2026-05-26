import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Expense Tracker",
  description: "Smart expense tracking with AI insights",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}
