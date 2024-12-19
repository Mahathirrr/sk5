export interface Lesson {
  id: string;
  course_id: string; // Match database column name
  title: string;
  description: string;
  video_url: string; // Match database column name
  duration: number;
  order: number;
  created_at: string; // Match database column name
  updated_at: string; // Match database column name
}

export interface CreateLessonData {
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

// Add type mapper for database to frontend conversion
export function mapDatabaseLesson(lesson: any): Lesson {
  return {
    id: lesson.id,
    course_id: lesson.course_id,
    title: lesson.title,
    description: lesson.description,
    video_url: lesson.video_url,
    duration: lesson.duration,
    order: lesson.order,
    created_at: lesson.created_at,
    updated_at: lesson.updated_at,
  };
}

