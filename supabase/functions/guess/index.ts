// supabase/functions/guess/index.ts
import { serve } from "https://deno.land/std/http/server.ts"
import { getState, increaseTry, resetGame } from "./state.ts"
import { getRandomMonster } from "./game.ts"
import { getDynamicRate, MAX_TRIES } from "./rate.ts"

serve(async (req) => {
  try {
    const url = new URL(req.url)

    if (url.pathname.endsWith("/guess")) {
      const num = Number(url.searchParams.get("number"))
      if (Number.isNaN(num)) {
        return Response.json({ message: "number 필요" }, { status: 400 })
      }

      increaseTry()
      const state = getState()

      if (state.tryCount > MAX_TRIES) {
        resetGame()
        return Response.json({ message: "15번 실패! 게임 오버!" })
      }

      if (num < state.targetNumber)
        return Response.json({ message: "너무 낮아요!" })

      if (num > state.targetNumber)
        return Response.json({ message: "너무 높아요!" })

      const monster = getRandomMonster(state.tryCount)
      resetGame()

      return Response.json({
        message: "정답입니다!",
        monster,
      })
    }

    if (url.pathname.endsWith("/rate")) {
      const tc = Number(url.searchParams.get("tryCount") ?? 0)
      return Response.json(getDynamicRate(tc))
    }

    return new Response("Not Found", { status: 404 })
  } catch (e) {
    console.error("❌ ERROR", e)
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500 }
    )
  }
})
