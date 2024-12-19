export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "student" | "instructor";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "instructor";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "instructor";
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructor_id: string;
          price: number;
          category: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          thumbnail_url: string | null;
          student_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          instructor_id: string;
          price: number;
          category: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          thumbnail_url?: string | null;
          student_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          instructor_id?: string;
          price?: number;
          category?: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          thumbnail_url?: string | null;
          student_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string;
          video_url: string;
          duration: number;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description: string;
          video_url: string;
          duration: number;
          order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string;
          video_url?: string;
          duration?: number;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: "active" | "completed" | "cancelled";
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: "active" | "completed" | "cancelled";
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          status?: "active" | "completed" | "cancelled";
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      access_tokens: {
        Row: {
          id: string;
          token: string;
          course_id: string;
          created_by: string;
          used_by: string | null;
          used_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          token: string;
          course_id: string;
          created_by: string;
          used_by?: string | null;
          used_at?: string | null;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          token?: string;
          course_id?: string;
          created_by?: string;
          used_by?: string | null;
          used_at?: string | null;
          expires_at?: string;
          created_at?: string;
        };
      };
      discussions: {
        Row: {
          id: string;
          course_id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          user_id: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string;
          published: boolean;
          tags: string[];
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string;
          published?: boolean;
          tags?: string[];
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string;
          published?: boolean;
          tags?: string[];
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          discussion_id: string;
          user_id: string;
          content: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          discussion_id: string;
          user_id: string;
          content: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          discussion_id?: string;
          user_id?: string;
          content?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          enrollment_id: string;
          lesson_id: string;
          progress: number;
          watch_time: number;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          lesson_id: string;
          progress: number;
          watch_time: number;
          completed: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          lesson_id?: string;
          progress?: number;
          watch_time?: number;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          amount: number;
          status: "pending" | "success" | "failed" | "expired" | "refunded";
          payment_token: string;
          payment_url: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          amount: number;
          status?: "pending" | "success" | "failed" | "expired" | "refunded";
          payment_token: string;
          payment_url: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          amount?: number;
          status?: "pending" | "success" | "failed" | "expired" | "refunded";
          payment_token?: string;
          payment_url?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
