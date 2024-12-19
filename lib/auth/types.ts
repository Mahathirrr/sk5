export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: "student" | "instructor";
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
}
