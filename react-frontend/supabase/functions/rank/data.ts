import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://elqomxaemqiqalzhczfc.supabase.co"; // 포트 확인 필요
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscW9teGFlbXFpcWFsemhjemZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjk2MDQsImV4cCI6MjA4NDYwNTYwNH0.0he5PJ_4W9pEUR1Vi8LbnhUwsOsb-8vh2wVXUh11R0k";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. 점수 등록 (Create)
// data.ts
// data.ts
export async function saveGameScore(payload: any) {
  const { data, error } = await supabase
    .from("rankings")
    .upsert(
      {
        user_id: payload.user_id,
        nickname: payload.nickname,
        score: payload.score,
        level: payload.level,
        // 업데이트 시점 기록을 위해 명시적으로 넣어줄 수 있습니다.
        created_at: new Date().toISOString()
      },
      { onConflict: 'user_id' } // user_id가 같으면 업데이트 하라는 설정
    )
    .select();

  if (error) throw error;
  return data;
}
// 2. 랭킹 조회 (Top 10)
export async function getTopRankings() {
  const { data, error } = await supabase
    .from("rankings")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}