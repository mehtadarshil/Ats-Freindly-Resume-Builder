import { createServerClient } from "@supabase/ssr";

export const createClient = (cookies: () => RequestCookies) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookies().set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          cookies().set(name, "", { ...options, maxAge: 0 });
        },
      },
    },
  );
};

type CookieOptions = {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
};
