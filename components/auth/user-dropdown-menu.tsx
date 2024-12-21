"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { LogOut, User, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownMenuProps {
  user: {
    email: string;
    fullName?: string;
    avatarUrl?: string;
  };
  onProfileClick: () => void;
}

export function UserDropdownMenu({
  user,
  onProfileClick,
}: UserDropdownMenuProps) {
  const { toast } = useToast();

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
        title: "Gagal Keluar",
        description: "Terjadi kesalahan saat mencoba keluar",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatarUrl}
              alt={user.fullName || user.email}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.fullName
                ? user.fullName[0].toUpperCase()
                : user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-background border border-border shadow-lg"
      >
        <DropdownMenuItem
          disabled
          className="font-medium text-foreground opacity-70"
        >
          {user.fullName || user.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border opacity-50" />
        <DropdownMenuItem
          onClick={onProfileClick}
          className="cursor-pointer text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="cursor-pointer text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center w-full"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border opacity-50" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
