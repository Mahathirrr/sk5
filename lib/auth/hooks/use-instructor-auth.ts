"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { useRouter } from "next/navigation";

export function useInstructorAuth() {
  const { user, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Only check authorization after loading is complete
    if (!isLoading) {
      const hasAccess = user?.role === "instructor";
      setIsAuthorized(hasAccess);

      if (!hasAccess) {
        router.replace("/");
      }
    }
  }, [isLoading, user, router]);

  return {
    isLoading,
    isAuthorized,
    user,
  };
}
