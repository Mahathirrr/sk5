"use client";

import { supabase } from "@/lib/supabase/client";
import { CourseWithInstructor, CreateCourseData } from "./types";

export async function createCourse(
  data: CreateCourseData,
): Promise<CourseWithInstructor> {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data: course, error } = await supabase
    .from("courses")
    .insert({
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      price: data.price,
      thumbnail_url: data.thumbnailUrl,
      instructor_id: user.user.id,
    })
    .select(
      `
      *,
      instructor:users!courses_instructor_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .single();

  if (error) throw error;
  return course;
}

export async function updateCourse(
  id: string,
  data: Partial<CreateCourseData>,
): Promise<CourseWithInstructor> {
  const { data: course, error } = await supabase
    .from("courses")
    .update(data)
    .eq("id", id)
    .select(
      `
      *,
      instructor:users!courses_instructor_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .single();

  if (error) throw error;
  return course;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}
