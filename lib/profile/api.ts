import { supabase } from "@/lib/supabase/client";

interface UpdateProfileData {
  fullName?: string;
  avatarUrl?: string;
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileData,
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({
      full_name: data.fullName,
      avatar_url: data.avatarUrl,
    })
    .eq("id", userId);

  if (error) throw error;
}
