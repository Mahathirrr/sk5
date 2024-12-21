import { DashboardHeader } from "@/components/instructor/dashboard-header";
import { DashboardStats } from "@/components/instructor/dashboard-stats";
import { CourseTable } from "@/components/instructor/course-table";
import { RecentEnrollments } from "@/components/instructor/recent-enrollments";
import { getInstructorStats, getCourseStats } from "@/lib/instructor/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function InstructorDashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/");
  }

  const stats = await getInstructorStats(session.user.id);
  const courseStats = await getCourseStats(session.user.id);

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseTable courses={courseStats} />
        </div>
        <div>
          <RecentEnrollments enrollments={stats.recentEnrollments} />
        </div>
      </div>
    </div>
  );
}
