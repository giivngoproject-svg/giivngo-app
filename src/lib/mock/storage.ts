import { createClient } from "@supabase/supabase-js";

// Get Supabase client (lazy init)
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials not configured in environment variables");
  }

  return createClient(url, key);
}

// Upload image to Supabase Storage
export async function uploadImage(file: File): Promise<string> {
  const supabase = getSupabaseClient();

  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `campaign-cover-${timestamp}-${random}.${ext}`;

  try {
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("campaigns")
      .upload(filename, file);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("campaigns").getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
}

// Delete image from Supabase Storage
export async function deleteImage(url: string): Promise<void> {
  const supabase = getSupabaseClient();

  try {
    // Extract filename from URL (e.g., "campaign-cover-xxx.jpg")
    const filename = url.split("/").pop();
    if (!filename) throw new Error("Invalid URL");

    await supabase.storage.from("campaigns").remove([filename]);
  } catch (error) {
    console.error("Storage delete error:", error);
    // Don't throw, just warn - deletion failure shouldn't break the flow
  }
}

// Upload video to Supabase Storage
export async function uploadVideo(file: Blob): Promise<string> {
  const supabase = getSupabaseClient();

  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const filename = `campaign-video-${timestamp}-${random}.mp4`;

  try {
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("campaigns")
      .upload(filename, file);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("campaigns").getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
}
