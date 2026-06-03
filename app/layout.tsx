import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Q&A",
  description: "Ask and upvote questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-100">
        <nav className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[linear-gradient(180deg,rgba(4,8,18,0.92),rgba(4,8,18,0.75))] shadow-[0_8px_30px_rgba(8,15,28,0.45)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black tracking-[0.28em] text-cyan-100 shadow-[0_0_18px_rgba(56,189,248,0.18)]">
                Q
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/80">Cyber Hub</p>
                <p className="text-sm font-semibold text-slate-100">Live Q&amp;A</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/6 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <Link
                href="/"
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10 hover:text-cyan-50"
              >
                Q&amp;A
              </Link>
              <Link
                href="/polls"
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-violet-100 transition hover:bg-violet-400/10 hover:text-violet-50"
              >
                Polls
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}