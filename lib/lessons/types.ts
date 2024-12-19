// Define the base lesson type that matches the database schema
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  order: number;
  created_at: string;
  updated_at: string;
}

// Data required to create a new lesson
export interface CreateLessonData {
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

// Form data for lesson creation/editing
export interface LessonFormData {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
}

// Utility function to convert database lesson to frontend format
export function mapDatabaseLesson(lesson: Lesson): Lesson {
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
