# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

MonsterCollector는 숫자 맞추기 게임으로 몬스터를 수집하는 게임의 Supabase Edge Functions 백엔드입니다.

## 개발 명령어

```bash
# 로컬 Supabase 실행
supabase start

# Edge Function 로컬 실행 (전체)
supabase functions serve

# 특정 함수만 실행
supabase functions serve guess

# 프로덕션 배포
supabase functions deploy guess
supabase functions deploy card
supabase functions deploy rank

# 전체 함수 배포
supabase functions deploy
```

## 아키텍처

### Edge Functions (`supabase/functions/`) — Deno/TypeScript

| 함수 | 엔드포인트 | 역할 |
|------|-----------|------|
| `api/` | `/api` | 헬스체크 |
| `guess/` | `/guess`, `/rate` | 숫자 맞추기 게임 핵심 로직 |
| `card/` | `/card/start`, `/card/flip` | 카드 게임 |
| `rank/` | `/rank` (GET/POST) | 랭킹 저장/조회 |

### guess 함수 구조 (가장 복잡)
```
guess/
├── index.ts    # 라우터 (/guess vs /rate 분기)
├── state.ts    # 게임 상태 (메모리 기반, 서버 재시작 시 초기화)
├── game.ts     # 몬스터 선택 로직
├── rate.ts     # 동적 확률 계산 (선형 보간)
├── monster.ts  # 몬스터 풀 정의
└── types.ts    # 공통 타입 (Monster, MonsterGrade)
```

### 동적 확률 시스템 (`guess/rate.ts`)
시도 횟수에 따라 등급 확률 선형 보간:
- 0~9회: BASE_RATE (EPIC 60%, LEGENDARY 25%) → TARGET_RATE로 전환
- 10~14회: 100% NORMAL 확정
- 15회+: TARGET_RATE (NORMAL 70%, RARE 25%)

### DB 스키마 (`rankings` 테이블)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| `user_id` | string | PK (upsert 기준) |
| `nickname` | string | 닉네임 |
| `score` | number | 점수 |
| `level` | number? | 레벨 (optional) |
| `created_at` | timestamp | 생성/업데이트 시간 |

마이그레이션 파일 없음 — 스키마는 Supabase 대시보드에서 직접 관리됨.

### 배포
- **플랫폼**: Supabase Edge Functions
- **URL**: https://elqomxaemqiqalzhczfc.supabase.co
