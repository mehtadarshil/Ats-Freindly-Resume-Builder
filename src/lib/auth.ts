import { createClient } from "@/lib/supabase/client";

export async function getSession() {
  const supabase = createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getUserDetails() {
  const supabase = createClient();
  try {
    const { data: userDetails } = await supabase
      .from("users")
      .select("*")
      .single();
    return userDetails;
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
}
