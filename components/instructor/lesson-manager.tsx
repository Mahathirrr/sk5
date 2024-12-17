'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  DragDropContext,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Lesson } from '@/lib/courses/types';
import {
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from '@/lib/lessons/api';
import { Plus, Loader2 } from 'lucide-react';
import { LessonListItem } from './lesson-list';
import { LessonForm } from './lesson-form';
import { z } from 'zod';

interface LessonManagerProps {
  courseId: string;
  lessons: Lesson[];
}

const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  videoUrl: z.string().url(),
  duration: z.number().min(1),
});

type FormData = z.infer<typeof formSchema>;

export function LessonManager({ courseId, lessons: initialLessons }: LessonManagerProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      if (editingLesson) {
        const updatedLesson = await updateLesson(editingLesson.id, {
          ...data,
          courseId,
          order: editingLesson.order,
        });
        setLessons(lessons.map((l) => 
          l.id === updatedLesson.id ? updatedLesson : l
        ));
        toast({
          title: 'Lesson updated',
          description: 'The lesson has been updated successfully.',
        });
      } else {
        const newLesson = await createLesson({
          ...data,
          courseId,
          order: lessons.length,
        });
        setLessons([...lessons, newLesson]);
        toast({
          title: 'Lesson created',
          description: 'The new lesson has been added to the course.',
        });
      }
      setIsDialogOpen(false);
      setEditingLesson(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error saving the lesson.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsDialogOpen(true);
  };

  const handleDelete = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter((l) => l.id !== lessonId));
      toast({
        title: 'Lesson deleted',
        description: 'The lesson has been removed from the course.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error deleting the lesson.',
        variant: 'destructive',
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLessons(items);

    try {
      await reorderLessons(
        courseId,
        items.map((lesson) => lesson.id)
      );
      toast({
        title: 'Order updated',
        description: 'The lesson order has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error updating the lesson order.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Course Lessons</h2>
        <Button
          onClick={() => {
            setEditingLesson(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lessons">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {lessons.map((lesson, index) => (
                <LessonListItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </DialogTitle>
          </DialogHeader>
          <LessonForm
            initialData={editingLesson || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}