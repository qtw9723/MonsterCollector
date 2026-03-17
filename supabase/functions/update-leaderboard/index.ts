import { updateLeaderboard } from "../rank/data.ts";

Deno.serve(async () => {
  try {
    const count = await updateLeaderboard();
    return new Response(
      JSON.stringify({ message: "리더보드 업데이트 완료", updated: count }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
