"use client";
import { Logo } from "@/components/ui/logo";
import { AuthButton } from "@/components/auth/auth-button";
import { NotificationList } from "@/components/notifications/notification-list";
import { useAuth } from "@/lib/auth/hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, FileText } from "lucide-react";

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses">
              <Button variant="ghost" className="gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Kursus
              </Button>
            </Link>
            <Link href="/articles">
              <Button variant="ghost" className="gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                Artikel
              </Button>
            </Link>
            {user?.role === "instructor" && (
              <Link href="/instructor/dashboard">
                <Button variant="ghost" className="gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  Dashboard Instruktur
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && <NotificationList />}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
