// Shared helpers for the privileged Newsletter edge functions.
//
// These endpoints expose subscriber PII and the ability to send mail, so they
// must never be world-callable. Every privileged function calls `requireAdmin`
// before doing any work. The caller proves it is the admin panel by sending the
// `ADMIN_TOKEN` secret in the `x-admin-token` header.
//
// Configure the secret once with:
//   supabase secrets set ADMIN_TOKEN="<a long random string>"

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Constant-time string comparison to avoid leaking the token via timing. */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

/**
 * Returns a `Response` to short-circuit with when the request is not an
 * authenticated admin call, or `null` when the caller is authorized.
 */
export function requireAdmin(req: Request): Response | null {
  const expected = Deno.env.get("ADMIN_TOKEN");
  if (!expected) {
    console.error("ADMIN_TOKEN is not configured for this function");
    return jsonResponse(
      { error: "Server is missing ADMIN_TOKEN configuration" },
      500,
    );
  }
  const provided = req.headers.get("x-admin-token") ?? "";
  if (!provided || !timingSafeEqual(provided, expected)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  return null;
}
