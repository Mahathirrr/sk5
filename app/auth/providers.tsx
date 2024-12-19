"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";

export function AuthProviders() {
  const supabase = createClientComponentClient();

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const handleGithubSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="gap-2" onClick={handleGoogleSignIn}>
        <Mail className="h-4 w-4" />
        Continue with Google
      </Button>

      <Button variant="outline" className="gap-2" onClick={handleGithubSignIn}>
        <Github className="h-4 w-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}
