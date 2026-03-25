import { createMember, getMember, UserNotFoundError } from "../rank/data.ts";

Deno.serve(async (req) => {
  const { method } = req;
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (method === "HEAD") {
    return new Response(null, { status: 200 });
  }

  // POST /member — 회원 등록
  if (method === "POST") {
    try {
      const body = await req.json().catch(() => null);
      if (!body) {
        return new Response(JSON.stringify({ error: "바디가 비어있습니다." }), { status: 400 });
      }
      if (!body.user_id || !body.nickname) {
        return new Response(JSON.stringify({ error: "user_id, nickname은 필수입니다." }), { status: 400 });
      }

      const member = await createMember(body.user_id, body.nickname);
      return new Response(JSON.stringify({ message: "회원 등록 완료", data: member }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // GET /member/{user_id} — 회원 조회
  if (method === "GET") {
    try {
      const segments = pathname.split("/").filter(Boolean);
      const userId = segments[segments.length - 1];
      if (!userId || userId === "member") {
        return new Response(JSON.stringify({ error: "user_id가 필요합니다." }), { status: 400 });
      }

      const member = await getMember(userId);
      return new Response(JSON.stringify(member), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
});
