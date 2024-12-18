"use client";

import { useAuth } from "@/lib/auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "instructor")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      {/* Sidebar */}
      <div className="hidden w-64 flex-shrink-0 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  );
}
