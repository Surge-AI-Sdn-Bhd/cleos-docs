import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { allArticles, articleLocation, categories } from "@/lib/docs";
import { articleImages } from "@/lib/article-images";
import { articleDiagrams } from "@/lib/article-diagrams";

export function generateStaticParams() { return allArticles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = articleLocation(slug);
  return { title: item?.article.title ?? "Article", description: item?.article.summary };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = articleLocation(slug);
  if (!location) notFound();
  const { category, group, article } = location;
  const visuals = articleImages[slug] ?? [];
  const diagram = articleDiagrams[slug];
  const hasVisual = visuals.length > 0 || Boolean(diagram);
  const siblings = group.articles.filter((item) => item.slug !== slug).slice(0, 3);
  const isReference = article.format === "reference";
  const isNote = article.checkKind === "note";
  const contentId = isReference ? "overview" : "steps";
  const contentLabel = isReference ? "01 / OVERVIEW" : "01 / HOW TO";
  const contentHeading = isReference ? "Overview" : "Steps";
  const checkHeading = isNote ? "Good to know" : "Before you finish";
  return <main className="shell doc-layout">
    <aside className="docs-sidebar" aria-label="Help topics"><span className="sidebar-label">ALL TOPICS</span>{categories.map((item) => <Link key={item.slug} className={item.slug === category.slug ? "active" : ""} href={`/topics/${item.slug}`}>{item.title}<span aria-hidden="true">→</span></Link>)}</aside>
    <article className="doc-main"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Help Center</Link><span aria-hidden="true">/</span><Link href={`/topics/${category.slug}`}>{category.title}</Link><span aria-hidden="true">/</span><span>{article.title}</span></nav>
      <div className="article-heading"><span className="section-kicker">{group.title.toUpperCase()}</span><h1>{article.title}</h1><p>{article.summary}</p><div className="role-line"><span className="role-icon" aria-hidden="true">◉</span> For {article.role}</div></div>
      <div className="article-content"><section id={contentId}><div className="content-heading"><span className="content-label">{contentLabel}</span><h2>{contentHeading}</h2></div>{isReference
        ? <ul className="points">{article.steps.map((point, index) => <li key={`${index}-${point}`}><p>{point}</p></li>)}</ul>
        : <ol className="steps">{article.steps.map((step, index) => <li key={`${index}-${step}`}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>}</section>
      {hasVisual && <section className="visual-guide" id="visual-guide" aria-labelledby="visual-guide-title"><div className="content-heading"><span className="content-label">02 / SEE IT</span><h2 id="visual-guide-title">Visual guide</h2></div>
        <ScreenshotGallery images={visuals} basePath={process.env.NEXT_PUBLIC_BASE_PATH ?? ""} />
        {diagram && <figure className="diagram-figure"><ol className="diagram-steps" aria-label={`${article.title} workflow`}>{diagram.items.map((item, index) => <li key={item.title}><span className="diagram-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><span>{item.detail}</span></li>)}</ol><figcaption>{diagram.caption} <span>Workflow illustration, not a Cleos screen.</span></figcaption></figure>}
      </section>}
      <aside className={isNote ? "check-card check-card--note" : "check-card"}><span className="check-icon" aria-hidden="true">{isNote ? "✦" : "✓"}</span><div><h2>{checkHeading}</h2><p>{article.check}</p></div></aside></div>
      {siblings.length > 0 && <section className="related" id="related"><h2>Keep exploring</h2><div>{siblings.map((item) => <Link key={item.slug} href={`/articles/${item.slug}`}>{item.title}<span aria-hidden="true">↗</span></Link>)}</div></section>}
      <div className="article-bottom"><Link href={`/topics/${category.slug}`}>← All {category.title} articles</Link></div>
    </article>
    <aside className="on-this-page" aria-label="On this page"><span className="sidebar-label">ON THIS PAGE</span><a href={`#${contentId}`}>{contentHeading}</a>{hasVisual && <a href="#visual-guide">Visual guide</a>}{siblings.length > 0 && <a href="#related">Related articles</a>}</aside>
  </main>;
}
