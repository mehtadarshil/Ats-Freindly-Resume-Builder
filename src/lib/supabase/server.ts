import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type CookieOptions } from "@supabase/ssr";

type Cookies = ReturnType<typeof cookies>;
export const createClient = (cookies: () => Cookies) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // @ts-ignore - ReadonlyRequestCookies vs RequestCookies mismatch
          cookies().set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          // @ts-ignore - ReadonlyRequestCookies vs RequestCookies mismatch
          cookies().set(name, "", { ...options, maxAge: 0 });
        },
      },
    },
  );
};
