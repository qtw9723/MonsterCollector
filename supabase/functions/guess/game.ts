// supabase/functions/guess/game.ts
import { MONSTER_POOL, Monster, MonsterGrade } from "./monster.ts"
import { pickGrade, MAX_TRIES } from "./rate.ts"
import { targetNumber, tryCount, resetGame } from "./state.ts"

export function getRandomMonsterByGrade(g: MonsterGrade): Monster {
  const list = MONSTER_POOL[g]
  return list[Math.floor(Math.random() * list.length)]
}

export function getRandomMonster(tryCount: number): Monster {
  return getRandomMonsterByGrade(pickGrade(tryCount))
}
