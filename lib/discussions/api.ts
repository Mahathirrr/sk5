import { supabase } from "@/lib/supabase/client";
import { Discussion, Comment } from "./types";

export async function createDiscussion(data: {
  courseId: string;
  userId: string;
  title: string;
  content: string;
}): Promise<Discussion> {
  const { data: discussion, error } = await supabase
    .from("discussions")
    .insert({
      course_id: data.courseId,
      user_id: data.userId,
      title: data.title,
      content: data.content,
    })
    .select(
      `
      *,
      user:users (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .single();

  if (error) throw error;
  return discussion;
}

export async function getDiscussions(courseId: string): Promise<Discussion[]> {
  const { data, error } = await supabase
    .from("discussions")
    .select(
      `
      *,
      user:users (
        id,
        full_name,
        avatar_url
      ),
      comments:comments (count)
    `,
    )
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createComment(data: {
  discussionId: string;
  userId: string;
  content: string;
  parentId?: string;
}): Promise<Comment> {
  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      discussion_id: data.discussionId,
      user_id: data.userId,
      content: data.content,
      parent_id: data.parentId,
    })
    .select(
      `
      *,
      user:users (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .single();

  if (error) throw error;
  return comment;
}

