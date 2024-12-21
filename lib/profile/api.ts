import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface UpdateProfileData {
  fullName?: string;
  avatarUrl?: string;
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileData,
): Promise<void> {
  const supabase = createClientComponentClient();

  // Only include fields that are being updated
  const updates: { [key: string]: any } = {};

  if (data.fullName !== undefined) {
    updates.full_name = data.fullName;
  }
  if (data.avatarUrl !== undefined) {
    updates.avatar_url = data.avatarUrl;
  }

  // Only proceed if there are actual updates
  if (Object.keys(updates).length === 0) {
    return;
  }

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Profile update error:", error);
    throw error;
  }

  // Refresh the session to update the user metadata
  await supabase.auth.refreshSession();
}
