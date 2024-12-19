import { z } from "zod";

// Schema for validating lesson form data
export const lessonFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  videoUrl: z.string().url("Please enter a valid video URL"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration cannot exceed 8 hours"),
});

// Type inference from the schema
export type LessonFormData = z.infer<typeof lessonFormSchema>;

// Validation function for lesson data
export function validateLessonData(data: unknown): LessonFormData {
  return lessonFormSchema.parse(data);
}
