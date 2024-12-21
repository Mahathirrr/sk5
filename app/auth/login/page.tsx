"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { LoginFeatures } from "@/components/auth/login-features";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <LoginForm />
      <LoginFeatures />
    </div>
  );
}
