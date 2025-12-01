export type WritingType = "article" | "blog" | "note" | "culture";

export interface Writing {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  type: WritingType;
  url?: string;
  thumbnailUrl?: string;
  category?: string; // e.g., "CULTURE"
  readTime?: string; // e.g., "3 min read"
}

