import { saveGameScore, getTopRankings } from "./data.ts";

Deno.serve(async (req) => {
  const { method } = req;
  const url = new URL(req.url);
  const pathname = url.pathname;

  // 디버깅을 위해 서버 로그에 출력 (supabase functions serve/logs 에서 확인 가능)
  console.log(`${method} 요청 발생: ${pathname}`);

  // 1. 점수 저장 API (POST)
  // 경로가 /rank 이거나 함수 루트(/)일 때 모두 허용
  if (method === "POST") {
        try {
          const incomingData = await req.json().catch(() => null);

          if (!incomingData) {
            return new Response(JSON.stringify({ error: "바디가 비어있습니다." }), { status: 400 });
          }

          // 필수 칼럼 체크 (user_id, nickname, score)
          if (!incomingData.user_id || !incomingData.nickname || incomingData.score === undefined) {
            return new Response(JSON.stringify({
              error: "필수 데이터(user_id, nickname, score)가 부족합니다."
            }), { status: 400 });
          }

          const result = await saveGameScore(incomingData);

          return new Response(JSON.stringify({ message: "성공", data: result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }catch (error) {
      return new Response(JSON.stringify({ error: "서버 내부 오류", details: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // 2. 랭킹 조회 API (GET)
  if (method === "GET") {
    try {
      const rankings = await getTopRankings();
      return new Response(JSON.stringify(rankings), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
});