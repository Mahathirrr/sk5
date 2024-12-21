import { supabase } from "@/lib/supabase/client";
import { nanoid } from "nanoid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Uploads an image file to the specified Supabase storage bucket
 * @param file - The file to upload
 * @param bucket - The storage bucket to upload to ("thumbnails" or "avatars")
 * @returns Promise resolving to the public URL of the uploaded image
 * @throws Error if upload fails
 */

export async function uploadImage(
  file: File,
  bucket: "thumbnails" | "avatars",
): Promise<string> {
  const supabase = createClientComponentClient();

  try {
    // Generate a unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const fileName = `${nanoid()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error("Failed to upload file to storage");
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Upload image error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image",
    );
  }
}
/**
 * Deletes an image from the specified Supabase storage bucket
 * @param path - The full path of the file to delete
 * @param bucket - The storage bucket containing the file
 * @throws Error if deletion fails
 */
export async function deleteImage(
  path: string,
  bucket: "thumbnails" | "avatars",
): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Storage delete error:", error);
      throw new Error("Failed to delete file from storage");
    }
  } catch (error) {
    console.error("Delete image error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete image",
    );
  }
}

/**
 * Gets the public URL for an image in the specified bucket
 * @param path - The path of the file in the bucket
 * @param bucket - The storage bucket containing the file
 * @returns The public URL of the image
 */
export function getImageUrl(
  path: string,
  bucket: "thumbnails" | "avatars",
): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

