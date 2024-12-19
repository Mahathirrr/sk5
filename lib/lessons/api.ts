import { supabase } from "@/lib/supabase/client";
import { Lesson, CreateLessonData } from "./types";

export async function createLesson(data: CreateLessonData): Promise<Lesson> {
  const { data: lesson, error } = await supabase
    .from("lessons")
    .insert({
      course_id: data.courseId,
      title: data.title,
      description: data.description,
      video_url: data.videoUrl,
      duration: data.duration * 60, // Convert minutes to seconds
      order: data.order,
    })
    .select()
    .single();

  if (error) throw error;
  return lesson;
}

export async function updateLesson(
  id: string,
  data: Partial<CreateLessonData>,
): Promise<Lesson> {
  const updates: any = {
    title: data.title,
    description: data.description,
    video_url: data.videoUrl,
    order: data.order,
  };

  if (data.duration !== undefined) {
    updates.duration = data.duration * 60;
  }

  const { data: lesson, error } = await supabase
    .from("lessons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return lesson;
}

export async function deleteLesson(id: string): Promise<void> {
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderLessons(
  courseId: string,
  lessonIds: string[],
): Promise<void> {
  const updates = lessonIds.map((id, index) => ({
    id,
    order: index,
  }));

  const { error } = await supabase
    .from("lessons")
    .upsert(updates, { onConflict: "id" });

  if (error) throw error;
}
