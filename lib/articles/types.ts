import { Database } from "@/lib/supabase/types";

export type Article = Database["public"]["Tables"]["articles"]["Row"];

export type ArticleWithAuthor = Article & {
  author: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
};

export interface CreateArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  tags: string[];
}
