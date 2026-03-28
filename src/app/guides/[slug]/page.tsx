import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGuideBySlug, getRelatedGuides, getAllGuides } from "@/lib/guides";

const CATEGORY_MAP: Record<string, string> = {
  "error-fares": "Tarifas Error",
  "miles-points": "Millas y Puntos",
  upgrades: "Upgrades",
  "credit-cards": "Tarjetas",
  routes: "Rutas",
  beginners: "Principiantes",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Tarifas Error": "bg-red-500/20 text-red-400",
  "Millas y Puntos": "bg-blue-500/20 text-blue-400",
  "Tarjetas": "bg-purple-500/20 text-purple-400",
  Upgrades: "bg-green-500/20 text-green-400",
  Rutas: "bg-orange-500/20 text-orange-400",
  Principiantes: "bg-yellow-500/20 text-yellow-400",
};

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | GetFlatbed Guías`,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      type: "article",
      publishedTime: guide.date,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.excerpt,
    },
  };
}

// Very simple Markdown → HTML renderer (avoids heavy dependency)
function mdToHtml(md: string): string {
  return md
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // H2
    .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
    // H4
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, "<hr />")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Tables - header row
    .replace(
      /^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm,
      (_, header, body) => {
        const ths = header
          .split("|")
          .filter(Boolean)
          .map((c: string) => `<th>${c.trim()}</th>`)
          .join("");
        const rows = body
          .trim()
          .split("\n")
          .map((row: string) => {
            const tds = row
              .split("|")
              .filter(Boolean)
              .map((c: string) => `<td>${c.trim()}</td>`)
              .join("");
            return `<tr>${tds}</tr>`;
          })
          .join("");
        return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
      }
    )
    // Unordered list items
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive li in ul
    .replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, (match) => {
      if (match.startsWith("<li>")) return `<ul>${match}</ul>`;
      return match;
    })
    // Numbered list items
    .replace(/^\d+\. (.+)$/gm, "<oli>$1</oli>")
    .replace(/(<oli>[\s\S]+?<\/oli>)(?!\s*<oli>)/g, (match) => {
      const inner = match.replace(/<\/?oli>/g, (m) =>
        m === "<oli>" ? "<li>" : "</li>"
      );
      return `<ol>${inner}</ol>`;
    })
    // Paragraphs (lines not already wrapped)
    .replace(/^(?!<[a-z]).+$/gm, (line) =>
      line.trim() ? `<p>${line}</p>` : ""
    )
    // Clean up empty lines
    .replace(/\n{3,}/g, "\n\n");
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(slug, guide.category, 3);
  const categoryLabel = CATEGORY_MAP[guide.category] ?? guide.category;
  const categoryColor =
    CATEGORY_COLORS[categoryLabel] ?? "bg-gray-500/20 text-gray-400";

  const htmlContent = mdToHtml(guide.content);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link href="/guides" className="hover:text-yellow-400 transition">
                Guías
              </Link>
              <span>›</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${categoryColor}`}>
                {categoryLabel}
              </span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
                {guide.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-black text-xs font-bold">
                    G
                  </span>
                  GetFlatbed Team
                </span>
                <span>·</span>
                <span>{formatDate(guide.date)}</span>
                <span>·</span>
                <span>{guide.readTime}</span>
              </div>
            </header>

            {/* Mid-article CTA */}
            <div
              className="rounded-2xl p-6 border border-yellow-500/30 mb-8"
              style={{ background: "rgba(245,200,66,0.04)" }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">✈️</span>
                <div className="flex-1">
                  <p className="font-bold mb-1 text-sm">
                    Recibe estas ofertas en tu bandeja de entrada automáticamente
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Tarifas error y ofertas de business class desde España, entregadas
                    en el momento en que aparecen.
                  </p>
                  <Link
                    href="/register"
                    className="inline-block gradient-gold text-black font-bold py-2 px-5 rounded-xl text-sm hover:opacity-90 transition"
                  >
                    Únete gratis →
                  </Link>
                </div>
              </div>
            </div>

            {/* Article body */}
            <div
              className="prose-guide"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Subscribe CTA */}
              <div className="deal-card rounded-2xl p-6">
                <div className="text-3xl mb-3">🛋️</div>
                <h4 className="font-bold mb-2 text-sm">No te pierdas ninguna oferta</h4>
                <p className="text-xs text-gray-500 mb-4">
                  Alertas instantáneas cuando business class cae a precios increíbles
                  en tus rutas.
                </p>
                <Link
                  href="/register"
                  className="block text-center gradient-gold text-black font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition"
                >
                  Recibe alertas gratis →
                </Link>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                    Guías Relacionadas
                  </h4>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/guides/${r.slug}`}
                        className="block deal-card rounded-xl p-4 group"
                      >
                        <p className="text-sm font-semibold group-hover:text-yellow-400 transition leading-snug mb-1">
                          {r.title}
                        </p>
                        <p className="text-xs text-gray-600">{r.readTime}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
