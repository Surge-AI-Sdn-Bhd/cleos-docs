import Link from "next/link";
import { categories, allArticles } from "@/lib/docs";
import { Search } from "@/components/search";

export default function Home() {
  return <main className="shell doc-layout index-layout">
    <aside className="docs-sidebar" aria-label="Help topics">
      <span className="sidebar-label">ALL TOPICS</span>
      {categories.map((category) => <Link key={category.slug} href={`/topics/${category.slug}`}>{category.title}<span aria-hidden="true">→</span></Link>)}
    </aside>
    <div className="doc-main">
      <div className="index-heading">
        <span className="section-kicker">CLEOS HELP CENTRE</span>
        <h1>All topics</h1>
        <p>Search for a task or browse the guides below.</p>
        <div className="index-search"><Search articles={allArticles.map(({ title, slug, summary }) => ({ title, slug, summary }))} /></div>
      </div>
      <div className="index-categories">
        {categories.map((category, index) => <section className="index-category" key={category.slug} aria-labelledby={`${category.slug}-title`}>
          <div className="index-category-heading">
            <div><span className="index-number">{String(index + 1).padStart(2, "0")}</span><h2 id={`${category.slug}-title`}><Link href={`/topics/${category.slug}`}>{category.title}</Link></h2></div>
            <Link className="index-view-topic" href={`/topics/${category.slug}`} aria-label={`View all ${category.title} articles`}>View topic <span aria-hidden="true">→</span></Link>
          </div>
          <div className="index-groups">
            {category.groups.map((group) => <div className="index-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>{group.articles.map((article) => <li key={article.slug}><Link href={`/articles/${article.slug}`}>{article.title}</Link></li>)}</ul>
            </div>)}
          </div>
        </section>)}
      </div>
    </div>
  </main>;
}
