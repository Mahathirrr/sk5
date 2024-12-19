"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AuthState, AuthUser } from "./types";

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            // If profile doesn't exist, create one
            if (profileError.code === "PGRST116") {
              const { data: newProfile, error: insertError } = await supabase
                .from("users")
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata.full_name,
                  avatar_url: session.user.user_metadata.avatar_url,
                  role: "student",
                })
                .select()
                .single();

              if (insertError) throw insertError;

              setState({
                user: newProfile
                  ? {
                      id: newProfile.id,
                      email: newProfile.email,
                      fullName: newProfile.full_name,
                      avatarUrl: newProfile.avatar_url,
                      role: newProfile.role,
                    }
                  : null,
                isLoading: false,
                error: null,
              });
              return;
            }
            throw profileError;
          }

          setState({
            user: profile
              ? {
                  id: profile.id,
                  email: profile.email,
                  fullName: profile.full_name,
                  avatarUrl: profile.avatar_url,
                  role: profile.role,
                }
              : null,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session) {
          const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          setState({
            user: profile
              ? {
                  id: profile.id,
                  email: profile.email,
                  fullName: profile.full_name,
                  avatarUrl: profile.avatar_url,
                  role: profile.role,
                }
              : null,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
