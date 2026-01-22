import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  /* =====================
     게임 시작
  ====================== */
  if (req.method === "GET" && url.pathname === "/card/start") {
    const deck: number[] = [];
    for (let i = 0; i < 36; i++) {
      deck.push(Math.floor(Math.random() * 100) + 1);
    }

    return Response.json({
      deck,
      flipped: [],
      score: 0,
      cards: Array(36).fill("?"),
    });
  }

  /* =====================
     카드 뒤집기
  ====================== */
  if (req.method === "POST" && url.pathname === "/card/flip") {
    const { index, deck, flipped, score } = await req.json();

    if (
      index < 0 ||
      index >= deck.length ||
      flipped.includes(index)
    ) {
      return Response.json({
        message: "잘못된 선택 또는 이미 오픈됨",
        score,
        cards: deck.map((_: number, i: number) =>
          flipped.includes(i) ? String(deck[i]) : "?"
        ),
      });
    }

    const value = deck[index];
    const newScore = score + value;
    const newFlipped = [...flipped, index];

    const cards = deck.map((v: number, i: number) =>
      newFlipped.includes(i) ? String(v) : "?"
    );

    return Response.json({
      openedIndex: index,
      openedValue: value,
      cards,
      score: newScore,
      flipped: newFlipped,
      message: `${value} 점 획득!`,
    });
  }

  return new Response("Not Found", { status: 404 });
});
