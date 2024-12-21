"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/hooks";
import { supabase } from "@/lib/supabase/client";
import { LogIn, LogOut, User, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserDropdownMenu } from "@/components/auth/user-dropdown-menu";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { useState } from "react";

export const AuthButton = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    return (
      <>
        <UserDropdownMenu
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}
        />
        <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      </>
    );
  }

  return (
    <Button
      variant="default"
      className="gap-2"
      onClick={() => router.push("/auth/login")}
    >
      <LogIn className="h-4 w-4" />
      Masuk
    </Button>
  );
};
