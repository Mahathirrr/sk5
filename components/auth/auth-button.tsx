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
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export const AuthButton = () => {
  const [mounted, setMounted] = useState(false);
  const { user, error } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    }
  }, [error, toast]);

  const handleLogin = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Berhasil Keluar",
        description: "Anda telah berhasil keluar dari akun",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description:
          error instanceof Error ? error.message : "Failed to logout",
      });
    }
  };

  // Don't render anything until component is mounted
  if (!mounted) {
    return null;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Image
              src={user.avatarUrl || `/api/placeholder/32/32`}
              alt={user.fullName || user.email}
              className="rounded-full"
              width={32}
              height={32}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem disabled className="font-medium">
            {user.fullName || user.email}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="gap-2 text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
