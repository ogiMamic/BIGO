import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function createClient(request: NextRequest) {
  // Resolve headers() if it's a function returning a Promise (Next.js v16+)
  const rawHeaders = typeof (request as any).headers === "function" ? await (request as any).headers() : (request as any).headers
  // Normalize Headers to a plain object (HeadersInit) to avoid runtime errors
  let headers: Record<string, string> = {}
  try {
    if (rawHeaders && typeof (rawHeaders as any).entries === "function") {
      headers = Object.fromEntries((rawHeaders as any).entries())
    } else if (rawHeaders && typeof rawHeaders === "object") {
      headers = Object.fromEntries(Object.entries(rawHeaders as any))
    }
  } catch (e) {
    headers = {}
  }

  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.delete({
            name,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers,
            },
          });
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}