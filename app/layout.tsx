import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/docs";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeToggle } from "@/components/theme-toggle";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Cleos Help Centre", template: "%s | Cleos Help Centre" },
  description: "Clear, practical guidance for everyday clinic work in Cleos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("cleos-docs-theme");document.documentElement.dataset.theme=t==="light"||t==="dark"?t:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){document.documentElement.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}` }} /></head>
      <body>
        <ScrollToTop />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/" aria-label="Cleos Help Centre home"><Image className="brand-logo" src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/cleos-logo.png`} alt="" width={167} height={57} priority /><span className="brand-label">Help Centre</span></Link>
            <div className="header-actions"><nav className="header-nav" aria-label="Primary navigation"><Link href="/">All topics</Link><Link href="/topics/start-here">Start here</Link></nav><ThemeToggle /><details className="mobile-menu"><summary aria-label="Open navigation">Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation"><Link href="/">All topics</Link>{categories.map((item) => <Link key={item.slug} href={`/topics/${item.slug}`}>{item.title}</Link>)}</nav></details></div>
          </div>
        </header>
        <div id="main-content">{children}</div>
        <footer className="site-footer"><div className="shell footer-inner"><Link className="footer-brand" href="/" aria-label="Cleos Help Centre home"><Image className="footer-logo" src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/cleos-logo.png`} alt="" width={167} height={57} unoptimized /></Link><span>Guidance for a smoother clinic day.</span><span>Help Centre</span></div></footer>
      </body>
    </html>
  );
}
