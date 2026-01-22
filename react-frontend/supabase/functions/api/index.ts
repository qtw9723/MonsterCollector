import { serve } from "https://deno.land/std/http/server.ts";

serve((_req) => {
  return new Response(
    JSON.stringify({ ok: true, msg: "Edge Function OK" }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
