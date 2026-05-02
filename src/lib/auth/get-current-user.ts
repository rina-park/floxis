import { createServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to get current user: ${error.message}`);
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
