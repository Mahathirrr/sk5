"use client";

import { Lesson } from "@/lib/lessons/types";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";

interface LessonListItemProps {
  lesson: Lesson;
  index: number;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

export function LessonListItem({
  lesson,
  index,
  onEdit,
  onDelete,
}: LessonListItemProps) {
  return (
    <Draggable draggableId={lesson.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex items-center gap-4 rounded-lg border bg-card p-4"
        >
          <div {...provided.dragHandleProps} className="cursor-move">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground">
              {Math.floor(lesson.duration / 60)} minutes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(lesson)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(lesson.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
