import type { Metadata } from "next";
import Link from "next/link";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "@/styles/globals.scss";

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Floxis",
  description: "A personal task management app for life, work, and learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={zenKakuGothicNew.variable}>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <Link href="/tasks" className="app-logo">
              Floxis
            </Link>
            <form>
              <button type="submit" className="app-header-button">
                Logout
              </button>
            </form>
          </header>
          <main className="app-main">
              {children}
          </main>
        </div>
      </body>
    </html>
  );
}
