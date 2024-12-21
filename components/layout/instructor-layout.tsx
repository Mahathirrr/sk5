"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

export function InstructorLayout({ children }: InstructorLayoutProps) {
  const navigation = [
    {
      name: "Dashboard",
      href: "/instructor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Kursus Saya",
      href: "/instructor/courses",
      icon: BookOpen,
    },
    {
      name: "Siswa",
      href: "/instructor/students",
      icon: Users,
    },
    {
      name: "Analisis",
      href: "/instructor/analytics",
      icon: BarChart2,
    },
    {
      name: "Pengaturan",
      href: "/instructor/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="hidden w-64 flex-shrink-0 border-r border-border bg-background lg:block">
        <nav className="flex h-full flex-col space-y-2 px-6 py-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground/60",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-4xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
