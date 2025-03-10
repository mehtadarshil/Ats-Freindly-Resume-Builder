import { createServerClient } from "@supabase/ssr";
import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/cookies";
import { type CookieOptions } from "@supabase/ssr";

export const createClient = (cookies: () => ReadonlyRequestCookies) => {
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
