"use client";

import { useState, useRef, useCallback } from "react";
import { CourseDetails } from "@/lib/courses/types";
import { VideoPlayer } from "./video-player";
import { LessonList } from "./lesson-list";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from "lucide-react";

interface CourseContentProps {
  course: CourseDetails;
  isEnrolled: boolean;
  enrollmentRef?: React.MutableRefObject<() => Promise<void>>;
}

export function CourseContent({
  course,
  isEnrolled,
  enrollmentRef,
}: CourseContentProps) {
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

  // Rest of the component implementation...
  // (Update to use refs instead of function props)
}
