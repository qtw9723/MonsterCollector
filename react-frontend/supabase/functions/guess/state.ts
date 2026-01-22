// supabase/functions/guess/state.ts

export interface GameState {
  tryCount: number
  targetNumber: number
}

let state: GameState = {
  tryCount: 0,
  targetNumber: Math.floor(Math.random() * 100) + 1,
}

export function getState(): GameState {
  return state
}

export function increaseTry() {
  state.tryCount++
}

export function resetGame() {
  state = {
    tryCount: 0,
    targetNumber: Math.floor(Math.random() * 100) + 1,
  }
}
