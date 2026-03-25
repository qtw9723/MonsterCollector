import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`해당 유저는 등록되지 않았습니다. (user_id: ${userId})`);
    this.name = "UserNotFoundError";
  }
}

// 1. 점수 등록 (member 검증 후 upsert)
export async function saveGameScore(payload: any) {
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("user_id")
    .eq("user_id", payload.user_id)
    .single();

  if (memberError || !member) {
    throw new Error("등록되지 않은 유저입니다.");
  }

  const { data, error } = await supabase
    .from("rankings")
    .upsert(
      {
        user_id: payload.user_id,
        score: payload.score,
        level: payload.level,
        created_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    )
    .select();

  if (error) throw error;
  return data;
}

// 2. 랭킹 조회 (Top 10) — members JOIN
export async function getTopRankings() {
  const { data, error } = await supabase
    .from("rankings")
    .select("user_id, score, level, created_at, members(nickname)")
    .order("score", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data?.map(({ members, ...rest }) => ({
    ...rest,
    nickname: (members as any)?.nickname ?? null,
  }));
}

// 3. 단일 유저 랭킹 조회 — members JOIN
export async function getOneRanking(userId: string) {
  const { data, error } = await supabase
    .from("rankings")
    .select("user_id, score, level, members(nickname)")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new UserNotFoundError(userId);
    throw error;
  }

  const { data: lb, error: lbError } = await supabase
    .from("leaderboard")
    .select("rank")
    .eq("user_id", userId)
    .single();

  const { members, ...rest } = data as any;
  return { ...rest, nickname: members?.nickname ?? null, ranking: lbError ? null : lb.rank };
}

// 4. leaderboard 갱신 (RPC)
export async function updateLeaderboard() {
  const { data, error } = await supabase.rpc("refresh_leaderboard");

  if (error) throw error;
  return data as number;
}

// 5. 회원 등록
export async function createMember(userId: string, nickname: string) {
  const { data, error } = await supabase
    .from("members")
    .insert({ user_id: userId, nickname })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("이미 사용 중인 닉네임 또는 user_id입니다.");
    throw error;
  }
  return data;
}

// 6. 회원 조회
export async function getMember(userId: string) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new UserNotFoundError(userId);
    throw error;
  }
  return data;
}
