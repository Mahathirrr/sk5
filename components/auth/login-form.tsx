"use client";

import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm() {
  const { toast } = useToast();

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
        title: "Gagal Masuk",
        description: "Terjadi kesalahan saat mencoba masuk",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-8 lg:p-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang di Skillopa
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bergabung dengan komunitas pembelajar kami dan mulai perjalanan Anda
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full gap-2 h-12 text-base"
            onClick={() => handleLogin("google")}
          >
            <Mail className="h-5 w-5" />
            Lanjutkan dengan Google
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2 h-12 text-base"
            onClick={() => handleLogin("github")}
          >
            <Github className="h-5 w-5" />
            Lanjutkan dengan GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Dengan melanjutkan, Anda menyetujui{" "}
          <a href="/terms" className="underline hover:text-primary">
            Ketentuan Layanan
          </a>{" "}
          dan{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Kebijakan Privasi
          </a>{" "}
          kami
        </p>
      </div>
    </div>
  );
}
