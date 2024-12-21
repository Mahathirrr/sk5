"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CourseStats } from "@/lib/instructor/types";
import { Edit2, BarChart2 } from "lucide-react";
import Link from "next/link";

interface CourseTableProps {
  courses: CourseStats[];
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="text-muted-foreground">Kursus</TableHead>
            <TableHead className="text-right text-muted-foreground">
              Siswa
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Tingkat Penyelesaian
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Pendapatan
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Rating
            </TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow
              key={course.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium text-card-foreground">
                {course.title}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {course.studentCount}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {Math.round(course.completionRate)}%
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                Rp {course.revenue.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {course.rating.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/instructor/courses/${course.id}/analytics`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/instructor/courses/${course.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
