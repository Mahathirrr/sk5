"use client";

import { useState, useRef } from "react";
import { CourseDetails } from "@/lib/courses/types";
import { VideoPlayer } from "./video-player";
import { LessonList } from "./lesson-list";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from "lucide-react";

interface CourseContentProps {
  course: CourseDetails;
  isEnrolled: boolean;
  onEnroll?: () => Promise<void>;
}

export function CourseContent({
  course,
  isEnrolled,
  onEnroll,
}: CourseContentProps): JSX.Element {
  const [currentLessonId, setCurrentLessonId] = useState(course.lessons[0]?.id);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const { toast } = useToast();

  const progressRef = useRef((progress: number) => {
    // Handle progress
    console.log("Progress:", progress);
  });

  const completeRef = useRef(() => {
    if (currentLessonId && !completedLessons.includes(currentLessonId)) {
      setCompletedLessons([...completedLessons, currentLessonId]);

      toast({
        title: "Pelajaran selesai! 🎉",
        description: "Lanjutkan ke pelajaran berikutnya.",
      });

      // Automatically move to next lesson
      const currentIndex = course.lessons.findIndex(
        (lesson) => lesson.id === currentLessonId,
      );
      if (currentIndex < course.lessons.length - 1) {
        setCurrentLessonId(course.lessons[currentIndex + 1].id);
      }
    }
  });

  const currentLesson = course.lessons.find(
    (lesson) => lesson.id === currentLessonId,
  );

  if (!currentLesson) {
    return (
      <div className="text-center py-8">
        <p>No lessons available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {isEnrolled ? (
          <VideoPlayer
            videoUrl={currentLesson.video_url}
            progressRef={progressRef}
            completeRef={completeRef}
          />
        ) : (
          <div className="aspect-video flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center space-y-4">
              <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Enroll to access course content
              </p>
              {onEnroll && (
                <Button onClick={onEnroll} className="mt-2">
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
          <p className="text-muted-foreground">{currentLesson.description}</p>
        </div>
      </div>
      <div>
        <LessonList
          lessons={course.lessons}
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          onSelectLesson={setCurrentLessonId}
          isEnrolled={isEnrolled}
        />
      </div>
    </div>
  );
}
