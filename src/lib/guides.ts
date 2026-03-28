import fs from "fs";
import path from "path";
import matter from "gray-matter";

const GUIDES_DIR = path.join(process.cwd(), "content/guides");

export interface GuideFrontmatter {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  isPremium: boolean;
}

export interface Guide extends GuideFrontmatter {
  content: string;
}

export function getAllGuides(): GuideFrontmatter[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".mdx"));

  const guides = files.map((filename) => {
    const filePath = path.join(GUIDES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return data as GuideFrontmatter;
  });

  return guides.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getGuideBySlug(slug: string): Guide | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...(data as GuideFrontmatter),
    content,
  };
}

export function getRelatedGuides(
  currentSlug: string,
  category: string,
  limit = 3
): GuideFrontmatter[] {
  return getAllGuides()
    .filter((g) => g.slug !== currentSlug && g.category === category)
    .slice(0, limit);
}
