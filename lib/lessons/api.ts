import { supabase } from '@/lib/supabase/client';
import { Lesson, CreateLessonData } from './types';

// ... existing code ...

export async function reorderLessons(
  courseId: string,
  lessonIds: string[]
): Promise<void> {
  const updates = lessonIds.map((id, index) => ({
    id,
    order: index,
  }));

  const { error } = await supabase
    .from('lessons')
    .upsert(updates, { onConflict: 'id' });

  if (error) throw error;
}