# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

MonsterCollector는 숫자 맞추기 게임으로 몬스터를 수집하는 게임의 Supabase Edge Functions 백엔드입니다.

## 개발 명령어

```bash
# 로컬 Supabase 실행
supabase start

# Edge Function 로컬 실행
supabase functions serve
supabase functions serve guess  # 특정 함수만

# 배포
supabase functions deploy         # 전체
supabase functions deploy guess   # 특정 함수만
```

## 아키텍처

### Edge Functions (`supabase/functions/`) — Deno/TypeScript

| 함수 | 엔드포인트 | 역할 |
|------|-----------|------|
| `api/` | GET `/api` | 헬스체크 |
| `guess/` | GET `/guess?number=N`<br>GET `/guess/rate?tryCount=N` | 숫자 맞추기 게임 |
| `card/` | GET `/card/start`<br>POST `/card/flip` | 카드 게임 |
| `rank/` | GET `/rank`<br>GET `/rank/{user_id}`<br>POST `/rank` | 랭킹 저장/조회 |
| `update-leaderboard/` | POST `/update-leaderboard` | leaderboard 일괄 갱신 (cron용) |

### guess 함수 구조
```
guess/
├── index.ts    # 라우터 (/guess vs /guess/rate 분기)
├── state.ts    # 게임 상태 (메모리 기반, 서버 재시작 시 초기화)
├── game.ts     # 몬스터 선택 로직
├── rate.ts     # 동적 확률 계산 (선형 보간)
├── monster.ts  # 몬스터 풀 정의
└── types.ts    # 공통 타입 (Monster, MonsterGrade)
```

### 동적 확률 시스템 (`guess/rate.ts`)
- 0~9회: BASE_RATE (EPIC 60%, LEGENDARY 25%) → TARGET_RATE로 선형 전환
- 10~14회: 100% NORMAL 확정
- 15회+: TARGET_RATE (NORMAL 70%, RARE 25%)

### DB 스키마
**rankings** — 게임 점수 저장
| 컬럼 | 설명 |
|------|------|
| `user_id` | PK (upsert 기준) |
| `nickname` | 닉네임 |
| `score` | 점수 |
| `level` | 레벨 (optional) |
| `created_at` | 생성/업데이트 시간 |

**leaderboard** — 순위 스냅샷 (매일 자정 갱신)
| 컬럼 | 설명 |
|------|------|
| `user_id` | rankings의 user_id |
| `rank` | 순위 (숫자) |

마이그레이션 파일 없음 — 스키마는 Supabase 대시보드에서 직접 관리됨.

### rank 함수 로직
- `GET /rank` — rankings 테이블 Top 10 조회
- `GET /rank/{user_id}` — rankings + leaderboard 조인하여 점수 및 순위 반환
- `POST /rank` — rankings upsert (user_id 기준)
- `POST /update-leaderboard` — rankings 전체를 score 내림차순 정렬 후 leaderboard 재생성 (delete → insert)

### 자동화
- GitHub Actions (`.github/workflows/update-leaderboard.yml`)
- 매일 KST 자정 (UTC 15:00)에 `update-leaderboard` 함수 자동 호출
- `workflow_dispatch`로 수동 실행 가능

### 배포
- **플랫폼**: Supabase Edge Functions
- **Project ID**: `elqomxaemqiqalzhczfc`
- **URL**: https://elqomxaemqiqalzhczfc.supabase.co
- **GitHub**: https://github.com/qtw9723/MonsterCollector
