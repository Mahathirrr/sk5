import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import { ArticleWithAuthor, CreateArticleData } from "./types";
import { slugify } from "@/lib/utils";

export async function getArticles(): Promise<ArticleWithAuthor[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      author:users (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleWithAuthor | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      author:users (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function createArticle(
  data: CreateArticleData,
): Promise<ArticleWithAuthor> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) throw new Error("User not authenticated");

  const { data: article, error } = await supabase
    .from("articles")
    .insert({
      title: data.title,
      slug: data.slug || slugify(data.title),
      excerpt: data.excerpt,
      content: data.content,
      cover_image: data.coverImage,
      published: data.published,
      tags: data.tags,
      author_id: sessionData.session.user.id,
    })
    .select(
      `
      *,
      author:users (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .single();

  if (error) throw error;
  return article;
}

export async function updateArticle(
  id: string,
  data: Partial<CreateArticleData>,
): Promise<ArticleWithAuthor> {
  const { data: article, error } = await supabase
    .from("articles")
    .update({
      title: data.title,
      slug: data.slug || (data.title ? slugify(data.title) : undefined),
      excerpt: data.excerpt,
      content: data.content,
      cover_image: data.coverImage,
      published: data.published,
      tags: data.tags,
    })
    .eq("id", id)
    .select(
      `
      *,
      author:users (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .single();

  if (error) throw error;
  return article;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}
