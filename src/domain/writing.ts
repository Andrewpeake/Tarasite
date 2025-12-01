export type WritingType = "article" | "blog" | "note";

export interface Writing {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  type: WritingType;
  url?: string;
}

