export type InsightCategoryId = "all" | "hiring" | "operations" | "career" | "education";

export type InsightArticleCategory = Exclude<InsightCategoryId, "all">;

export type InsightCategory = {
  id: InsightCategoryId;
  label: string;
};

export type InsightArticle = {
  id: string;
  category: InsightArticleCategory;
  title: string;
  summary: string;
  sourceName: string;
  publishedAt: string;
  readTime: string;
  href: string;
};
