"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/hooks";
import { supabase } from "@/lib/supabase/client";
import { LogIn, LogOut, Github, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AuthButton = () => {
  const { user, isLoading } = useAuth();

  const handleLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <Button variant="ghost" disabled>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <Button variant="ghost" onClick={handleLogout} className="gap-2">
        <LogOut className="h-4 w-4" />
        Keluar
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          <LogIn className="h-4 w-4" />
          Masuk
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleLogin("google")}
          className="gap-2 cursor-pointer"
        >
          <Mail className="h-4 w-4" />
          <span>Masuk dengan Google</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLogin("github")}
          className="gap-2 cursor-pointer"
        >
          <Github className="h-4 w-4" />
          <span>Masuk dengan GitHub</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
