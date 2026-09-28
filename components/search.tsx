"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchItem = { title: string; slug: string; summary: string };

export function Search({ articles }: { articles: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const normalized = query.trim().toLowerCase();
  const matches = useMemo(() => normalized ? articles.filter((article) => `${article.title} ${article.summary}`.toLowerCase().includes(normalized)).slice(0, 7) : [], [articles, normalized]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); input.current?.focus(); }
      if (event.key === "Escape" && document.activeElement === input.current) { setQuery(""); input.current?.blur(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <div className="search-wrap" role="search">
    <label htmlFor="docs-search" className="sr-only">Search Cleos Help Centre articles</label>
    <div className="search-box"><span aria-hidden="true" className="search-icon">⌕</span><input ref={input} id="docs-search" type="search" autoComplete="off" placeholder="Search articles, tasks, and features..." value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) router.push(`/articles/${matches[0].slug}`); }} /><kbd>Ctrl K</kbd></div>
    {normalized && <div className="search-results" aria-live="polite">{matches.length ? matches.map((item) => <Link key={item.slug} href={`/articles/${item.slug}`}><strong>{item.title}</strong><span>{item.summary}</span></Link>) : <p>No results for “{query}”. Try another word or browse the topics below.</p>}</div>}
  </div>;
}
