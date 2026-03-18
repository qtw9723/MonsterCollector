# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

MonsterCollector는 숫자 맞추기 게임으로 몬스터(카드)를 수집하는 게임. Unity 클라이언트 + Supabase Edge Functions 백엔드로 구성.

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

---

## Unity 클라이언트

- **Unity 버전**: 2021.3.45f1 (LTS)
- **프로젝트 경로**: `unity/FaceMerge/`
- **API 통신**: 현재 없음 (완전 로컬 동작)

### 디렉토리 구조

```
unity/FaceMerge/Assets/
├── Script/
│   ├── Common/       # 싱글톤, 베이스 클래스
│   ├── Data/         # 데이터 모델 (CardModelData, NumberPadSummonRateModelData)
│   ├── Manager/      # 게임/카드/UI/리소스 매니저
│   ├── Tile/         # 타일 렌더링 (미사용)
│   ├── UI/
│   │   ├── Popup/
│   │   ├── Rate/          # 숫자 패드, 확률 슬라이더 UI
│   │   ├── UIController/  # MainLobbyController, SummonController
│   │   └── UIRoot/        # MainLobbyRoot, SummonRoot
│   └── Util/         # 저장, XML파싱, 공통유틸
└── Resources/
    ├── Data/         # CARD_DATA.xml, NUMBER_PAD_SUMMON_RATE.xml
    └── Prefabs/      # UI 및 팝업 프리팹
```

### 주요 매니저 클래스

| 클래스 | 역할 |
|--------|------|
| `GameManager` | 게임 초기화 진입점 |
| `ModelDataManager` | XML 기반 게임 데이터 모델 컨테이너 |
| `CardManager` | 플레이어 카드 수집 데이터 관리 (GUID 기반, AES 암호화 저장) |
| `ControlManager` | UI 프리팹 로드, 씬 전환 |
| `ResourceManager` | Resources 폴더 에셋 로드 및 캐싱 |

### 게임 플로우

1. MainLobby → 시작 버튼 클릭
2. Summon 화면: 1~100 숫자 맞추기
3. 정답 시: 시도 횟수 기반 확률로 카드(N/R/SR/SSR) 획득
4. 카드 로컬 저장 (AES 암호화 JSON, `Application.persistentDataPath/cards.sav`)

### 확률 시스템 (Unity 클라이언트)

- 데이터: `NUMBER_PAD_SUMMON_RATE.xml` (시도 횟수별 N/R/SR/SSR 가중치)
- 1~9회: SSR 2%, SR 13%, R 35%, N 50%
- 10~14회: N 100% 확정
- 15회+: 동일 유지
- 등급: `SummonGrade` enum (N=1, R=2, SR=3, SSR=4)

### 카드 데이터 모델

```
CardModelData: id, grade(SummonGrade), name, value1/2/3, imageName
NumberPadSummonRateModelData: tryCount, ssrValue, srValue, rValue, nValue
CardData: guid(GUID), modelData(CardModelData 참조)
```
