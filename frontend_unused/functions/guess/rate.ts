// supabase/functions/guess/rate.ts
import { MonsterGrade } from "./monster.ts"

export const BASE_RATE = {
  NORMAL: 5,
  RARE: 10,
  EPIC: 60,
  LEGENDARY: 25,
}

export const TARGET_RATE = {
  NORMAL: 70,
  RARE: 25,
  EPIC: 4,
  LEGENDARY: 1,
}

export const MAX_TRIES = 15
export const FORCE_NORMAL_TRY = 10

export function getDynamicRate(tryCount: number): Record<MonsterGrade, number> {
  if (tryCount >= MAX_TRIES) return TARGET_RATE as any

  if (tryCount >= FORCE_NORMAL_TRY) {
    return {
      NORMAL: 100,
      RARE: 0,
      EPIC: 0,
      LEGENDARY: 0,
    }
  }

  const ratio = tryCount / FORCE_NORMAL_TRY
  const temp: any = {}

  let sum = 0
  for (const g of Object.values(MonsterGrade)) {
    const v = BASE_RATE[g] + (TARGET_RATE[g] - BASE_RATE[g]) * ratio
    temp[g] = Math.max(v, 0)
    sum += temp[g]
  }

  for (const g of Object.values(MonsterGrade)) {
    temp[g] = (temp[g] / sum) * 100
  }

  return temp
}

export function pickGrade(tryCount: number): MonsterGrade {
  const rate = getDynamicRate(tryCount)
  const roll = Math.random() * 100

  let sum = 0
  for (const g of Object.values(MonsterGrade)) {
    sum += rate[g]
    if (roll <= sum) return g
  }
  return MonsterGrade.NORMAL
}
