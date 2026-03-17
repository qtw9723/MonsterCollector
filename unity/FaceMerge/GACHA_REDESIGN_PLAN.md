# 가챠 시스템 리디자인 계획

## 작성일: 2026-03-17

---

## 확정 사항

### 등급 체계
- **N / R / SR / SSR** 으로 통일
- 기존 GDD의 S/A/B/C/D 표기 폐기

### 가챠 방식
- 기존: 숫자 맞추기 미니게임 (tryCount 기반 확률 변동) → **폐기**
- 변경: **단일 티켓 방식**

### 티켓
- 단일 티켓 1종류
- 1뽑 / 10뽑 지원
- 10뽑 보정: 10번째는 최소 R 확정 (N 제거) → *추후 구현*

### 기본 확률
| 등급 | 가중치 | 기본 확률 (참고) |
|------|--------|----------------|
| SSR  | 2      | ~2%            |
| SR   | 13     | ~13%           |
| R    | 35     | ~35%           |
| N    | 50     | ~50%           |

### 천장 (Pity)
- **SSR 하드 천장**: 80연 도달 시 SSR 확정, 카운터 초기화
- **SR 소프트 천장**: 20연마다 N 제거 (SR 이상 확정)
- 파밍 난이도에 따라 수치 재밸런싱 예정

---

## 변경 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `Assets/Resources/Data/SUMMON_RATE.xml` | tryCount 10행 → 단일 행 (기본확률 + 천장값) |
| `Assets/Script/Data/SummonRateModelData.cs` | tryCount 기반 → 싱글 설정 + pity 로직 |
| `Assets/Script/Manager/GachaManager.cs` | **신규** — pity 카운터, PullOne(), Pull10(), 세이브/로드 |
| `Assets/Script/Manager/GameManager.cs` | Init()에 GachaManager.LoadPity() 추가 |
| `Assets/Script/UI/UIController/SummonController.cs` | 숫자맞추기 제거 → 1뽑/10뽑 버튼 로직 |
| `Assets/Script/UI/UIRoot/SummonRoot.cs` | 숫자패드/추측버튼 제거 → 1뽑/10뽑 버튼 추가 |

---

## 신규 XML 구조 (SUMMON_RATE.xml)

```xml
<Element>
  <Row>
    <A>2</A>   <!-- SSR 가중치 -->
    <B>13</B>  <!-- SR 가중치 -->
    <C>35</C>  <!-- R 가중치 -->
    <D>50</D>  <!-- N 가중치 -->
    <E>80</E>  <!-- SSR 하드 천장 -->
    <F>20</F>  <!-- SR 소프트 피티 간격 -->
  </Row>
</Element>
```

---

## 신규 GachaManager 설계

```
GachaManager (Singleton)
├── pityCnt     : int  (마지막 SSR 이후 뽑기 횟수)
├── srPityCnt   : int  (마지막 SR 이상 이후 뽑기 횟수)
├── PullOne()   : CardModelData
├── Pull10()    : List<CardModelData>
├── SavePity()
└── LoadPity()

GachaSaveData (Serializable)
├── pityCnt     : int
└── srPityCnt   : int
```

### 뽑기 로직
1. `pityCnt >= 80` → SSR 확정
2. `srPityCnt >= 20` → SR 이상 확정 (N 제거)
3. 그 외 → 기본 확률 랜덤

---

## 기존 코드 현황 (변경 전)

### SummonController (현재)
- 1~100 숫자 맞추기
- curTryCount 1~10 에 따라 확률 변동
- 정답 맞추면 카드 획득

### SUMMON_RATE.xml (현재)
- tryCount 1~10, 10행
- tryCount 1: SSR 40, SR 60 (첫 시도 유리)
- tryCount 10: N 70, R 25, SR 5 (많이 틀릴수록 불리)

---

## 미결 사항
- [ ] SummonRoot UI 프리팹에서 숫자패드/추측버튼 제거, 1뽑/10뽑 버튼 추가 (Unity Inspector 작업)
- [ ] 티켓 아이템 시스템 연동 (파밍 → 티켓 제작 루프)
- [ ] 뽑기 결과 연출 UI
- [ ] 파밍 난이도 확정 후 천장 수치 재밸런싱
