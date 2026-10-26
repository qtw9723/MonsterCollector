# MonsterCollector

몬스터를 수집하고 키우는 게임 프로젝트입니다. 기획 문서, Supabase 백엔드(Edge Function), Unity 클라이언트를 한 저장소에서 관리합니다.
개발 중인 프로젝트이며, 기획 문서와 백엔드, 그리고 숫자 맞추기로 카드를 뽑는 클라이언트 프로토타입이 만들어져 있습니다.

## 게임 소개

기획서(`docs/GDD_MonsterFarm_v0.6.md`) 기준의 핵심 콘셉트입니다.

- 아이템을 파밍해 티켓을 만들고, 가챠로 몬스터를 얻는 로그라이크 RPG
- 몬스터를 최대 3마리까지 장착해 공격·버프·탱킹·스탯 보조를 맡김
- 몬스터 조합으로 빌드를 다양하게 구성, 끝이 없는 던전 구조
- 일반 엔딩 이후 히든 엔딩, 뉴게임+ 루트

2026년 5월에 화면 방식을 4방향 탑뷰에서 횡스크롤로 바꾸는 방향으로 기획이 변경되었습니다.

## 저장소 구성

```
├── docs/
│   ├── GDD_MonsterFarm_v0.6.md   게임 기획서
│   ├── api-spec.md               백엔드 API 명세
│   └── exchange-plan.md          회원 간 거래소 기획
├── supabase/
│   └── functions/                Edge Function (Deno / TypeScript)
├── unity/FaceMerge/              Unity 클라이언트 (Unity 2021.3)
└── .github/workflows/            리더보드 일일 갱신
```

## 백엔드 (Supabase Edge Functions)

| 함수 | 경로 | 역할 |
|------|------|------|
| `api` | `GET /api` | 헬스 체크 |
| `member` | `POST`, `GET /member` | 회원 등록·조회 |
| `rank` | `GET /rank`, `GET /rank/{user_id}`, `POST /rank` | Top 10, 개인 순위 조회, 점수 등록 |
| `guess` | `GET /guess?number=N`, `GET /guess/rate?tryCount=N` | 숫자 맞추기로 몬스터를 뽑는 미니게임 |
| `card` | `GET /card/start`, `POST /card/flip` | 카드 뒤집기 게임 |
| `update-leaderboard` | `POST /update-leaderboard` | 리더보드 일괄 갱신 |

요청·응답 형식은 [`docs/api-spec.md`](docs/api-spec.md)에 정리되어 있습니다.

### 동적 확률 시스템 (`guess/rate.ts`)

시도 횟수에 따라 등급별 뽑기 확률이 달라집니다.

- 0~9회: 초기 확률(에픽 60%, 전설 25% 등)에서 목표 확률로 선형 보간
- 10~14회: 일반 등급 100% 확정
- 15회 이후: 목표 확률(일반 70%, 레어 25%, 에픽 4%, 전설 1%)

### 데이터베이스

`rankings`(점수)와 `leaderboard`(순위 스냅샷) 테이블을 사용합니다. 마이그레이션 파일은 없고 Supabase 대시보드에서 직접 관리합니다.

### 리더보드 자동 갱신

GitHub Actions(`update-leaderboard.yml`)가 매일 KST 자정에 `update-leaderboard` 함수를 호출합니다.

## Unity 클라이언트

`unity/FaceMerge` (Unity 2021.3 LTS). 현재는 서버와 통신하지 않고 로컬에서 완결되게 동작합니다.

1. 메인 로비에서 시작
2. 소환 화면에서 1~100 사이 숫자 맞추기
3. 정답을 맞히면 시도 횟수에 따른 확률로 카드(N / R / SR / SSR) 획득
4. 획득한 카드는 AES로 암호화한 JSON으로 기기에 저장

확률은 XML 데이터(`Resources/Data`)로 관리하고, 코드는 `Assets/Script` 아래에
`Manager`(게임·카드·UI·리소스), `Data`(모델), `UI`, `Util`(저장·XML 파싱)로 나뉘어 있습니다.

## 실행하기

[Supabase CLI](https://supabase.com/docs/guides/cli)가 필요합니다.

```bash
supabase start                      # 로컬 환경 시작
supabase functions serve            # 모든 함수 실행
supabase functions serve guess      # 특정 함수만 실행
supabase functions deploy guess     # 배포
```

Unity 클라이언트는 Unity 2021.3 LTS로 `unity/FaceMerge` 폴더를 열면 됩니다.

## 서드파티 에셋

`unity/FaceMerge/Assets` 아래에는 A* Pathfinding Project, TextMesh Pro, NotchSolution, Cainos 에셋 등 외부 에셋이 포함되어 있습니다.
각 에셋은 해당 제작자의 라이선스를 따르며, 이 저장소의 라이선스와는 무관합니다.

## 문서

- [게임 기획서 v0.6](docs/GDD_MonsterFarm_v0.6.md)
- [API 명세](docs/api-spec.md)
- [거래소 기획서](docs/exchange-plan.md)
