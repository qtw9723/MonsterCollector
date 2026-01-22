// supabase/functions/guess/monster.ts
export enum MonsterGrade {
  NORMAL = "NORMAL",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export interface Monster {
  name: string
  grade: MonsterGrade
  power: number
}

export const MONSTER_POOL: Record<MonsterGrade, Monster[]> = {
  NORMAL: [
    { name: "슬라임", grade: MonsterGrade.NORMAL, power: 3 },
    { name: "고블린", grade: MonsterGrade.NORMAL, power: 4 },
    { name: "박쥐", grade: MonsterGrade.NORMAL, power: 2 },
  ],
  RARE: [
    { name: "스켈레톤", grade: MonsterGrade.RARE, power: 7 },
    { name: "늑대", grade: MonsterGrade.RARE, power: 6 },
  ],
  EPIC: [
    { name: "미믹", grade: MonsterGrade.EPIC, power: 15 },
    { name: "리치", grade: MonsterGrade.EPIC, power: 18 },
  ],
  LEGENDARY: [
    { name: "드래곤", grade: MonsterGrade.LEGENDARY, power: 50 },
  ],
}

import { Monster, MonsterGrade } from "./types.ts"

export function createMonster(
  name: string,
  grade: MonsterGrade,
  power: number
): Monster {
  return { name, grade, power }
}