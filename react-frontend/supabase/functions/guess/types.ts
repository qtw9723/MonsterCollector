
export enum MonsterGrade {
  NORMAL = "NORMAL",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

import { MonsterGrade } from "./types.ts"

export interface Monster {
  name: string
  grade: MonsterGrade
  power: number
}
