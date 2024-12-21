import { getCourseByIdFromServer } from "@/lib/courses/server";
import { CourseHeader } from "@/components/courses/course-header";
import { CourseContent } from "@/components/courses/course-content";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const course = await getCourseByIdFromServer(params.id);

  if (!course) {
    notFound();
  }

  let isEnrolled = false;

  if (session?.user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("course_id", course.id)
      .eq("user_id", session.user.id)
      .single();

    isEnrolled = !!enrollment;
  }

  return (
    <div>
      <CourseHeader course={course} />
      <CourseContent
        course={course}
        isEnrolled={isEnrolled}
        onEnroll={async () => {
          "use server";
          // TODO: Implement enrollment logic
        }}
      />
    </div>
  );
}
