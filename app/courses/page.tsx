import { getCoursesFromServer } from "@/lib/courses/server";
import { CourseCard } from "@/components/courses/course-card";

export default async function CoursesPage() {
  const courses = await getCoursesFromServer();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="container flex-grow py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Kursus Tersedia</h1>
          <p className="mt-2 text-muted-foreground">
            Pilih dari berbagai kursus berkualitas dari instruktur terbaik
          </p>
        </div>

        {courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">
              Belum ada kursus tersedia saat ini.
            </p>
            <p className="text-sm text-muted-foreground">
              Silakan cek kembali nanti untuk kursus baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
