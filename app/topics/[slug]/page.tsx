import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/docs";

export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = categories.find((entry) => entry.slug === slug);
  return { title: item?.title ?? "Topic", description: item?.description };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) notFound();
  const count = category.groups.reduce((total, group) => total + group.articles.length, 0);
  return <main className="shell doc-layout">
    <aside className="docs-sidebar" aria-label="Help topics"><span className="sidebar-label">ALL TOPICS</span>{categories.map((item) => <Link key={item.slug} className={item.slug === slug ? "active" : ""} href={`/topics/${item.slug}`}>{item.title}<span aria-hidden="true">→</span></Link>)}</aside>
    <div className="doc-main"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Help Center</Link><span aria-hidden="true">/</span><span>{category.title}</span></nav>
      <div className="topic-heading"><span className="section-kicker">{count} ARTICLES</span><h1>{category.title}</h1><p>{category.description}</p></div>
      {category.groups.map((group) => <section className="article-group" key={group.title}><h2>{group.title}</h2><div className="article-list">{group.articles.map((article) => <Link key={article.slug} href={`/articles/${article.slug}`}><span><strong>{article.title}</strong><small>{article.summary}</small></span><span className="article-list-arrow" aria-hidden="true">↗</span></Link>)}</div></section>)}
    </div>
  </main>;
}
