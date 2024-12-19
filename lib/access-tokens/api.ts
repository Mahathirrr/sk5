import { supabase } from "@/lib/supabase/client";
import { nanoid } from "nanoid";
import {
  AccessToken,
  CreateAccessTokenData,
  UseAccessTokenData,
} from "./types";

export async function generateAccessToken(
  data: CreateAccessTokenData,
): Promise<string> {
  const token = nanoid(16);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Token expires in 30 days

  const { error } = await supabase.from("access_tokens").insert({
    token,
    course_id: data.courseId,
    created_by: data.createdBy,
    expires_at: expiresAt.toISOString(),
  });

  if (error) throw error;
  return token;
}

export async function validateAccessToken(
  token: string,
): Promise<AccessToken | null> {
  const { data, error } = await supabase
    .from("access_tokens")
    .select()
    .eq("token", token)
    .is("used_by", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error) return null;
  return data;
}

export async function useAccessToken(
  data: UseAccessTokenData,
): Promise<boolean> {
  const token = await validateAccessToken(data.token);
  if (!token) return false;

  const { error: updateError } = await supabase
    .from("access_tokens")
    .update({
      used_by: data.userId,
      used_at: new Date().toISOString(),
    })
    .eq("token", data.token);

  if (updateError) return false;

  // Create enrollment
  const { error: enrollmentError } = await supabase.from("enrollments").insert({
    user_id: data.userId,
    course_id: token.course_id,
    status: "active",
    progress: 0,
  });

  if (enrollmentError) return false;
  return true;
}

