# 거래소 기획서

## 개요

MonsterCollector의 거래소는 등록된 회원 간 아이템을 사고팔 수 있는 기능입니다.
싱글게임 기반의 특성을 고려하여, 서버는 거래소에 등록된 아이템만 관리하며
사용자의 전체 인벤토리는 서버에 저장하지 않습니다.

---

## 기본 원칙

- 등록된 회원만 거래 참여 가능
- 아이템은 거래소에 등록하는 시점에만 서버에 기록됨
- 거래 대금은 서버에서 관리하는 예치 화폐로만 진행
- 자신이 등록한 아이템은 본인이 구매 불가 (조회는 허용, 서버에서 구매 차단)

---

## DB 설계

### item_master — 아이템 마스터 데이터
아이템의 종류 정의. 클라이언트의 아이템 ID와 동일한 값을 PK로 사용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `item_id` | TEXT | PK, 클라이언트 아이템 ID와 일치 |
| `name` | TEXT | 아이템 이름 |
| `grade` | TEXT | 등급 (N / R / SR / SSR 등) |
| `description` | TEXT | 아이템 설명 (optional) |

> 거래소에 등록 가능한 아이템 종류를 사전에 정의해두는 테이블.
> 클라이언트의 CARD_DATA.xml 등과 ID를 맞춰 관리.

---

### listings — 거래소 등록 목록

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `listing_id` | UUID | PK |
| `seller_id` | TEXT | FK → members.user_id |
| `item_id` | TEXT | FK → item_master.item_id |
| `item_instance_id` | TEXT | 로컬 아이템 고유 ID (GUID), 이중 등록 방지용 |
| `price` | INTEGER | 등록 가격 |
| `status` | TEXT | `active` / `sold` / `cancelled` |
| `created_at` | TIMESTAMPTZ | 등록 시각 |

> `item_instance_id`는 클라이언트에서 아이템 생성 시 부여한 GUID.
> active 상태의 listing에 동일 GUID가 존재하면 이중 등록 차단.

---

### wallets — 거래소 예치 화폐

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `user_id` | TEXT | PK, FK → members.user_id |
| `balance` | INTEGER | 현재 잔액 |

> 회원 가입 시 초기 잔액 지급 (지급량은 별도 결정 필요).
> 아이템 판매 수익, 게임 점수 연동 등 획득 방법은 추후 결정.

---

### transactions — 거래 내역

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `tx_id` | UUID | PK |
| `listing_id` | UUID | FK → listings.listing_id |
| `buyer_id` | TEXT | FK → members.user_id |
| `seller_id` | TEXT | FK → members.user_id |
| `price` | INTEGER | 실제 거래 가격 |
| `created_at` | TIMESTAMPTZ | 거래 시각 |

---

## API 설계

### 거래소 목록 조회
```
GET /exchange
```
- 전체 active 상태 listing 반환
- 판매자 본인 목록도 포함 (구매 버튼만 클라이언트에서 비활성화)

---

### 내 등록 목록 조회
```
GET /exchange/my/{user_id}
```
- 본인이 등록한 listing 반환 (전체 status 포함)

---

### 아이템 등록
```
POST /exchange
```

**Request Body**

| 필드 | 설명 |
|------|------|
| `seller_id` | 판매자 user_id |
| `item_id` | item_master의 item_id |
| `item_instance_id` | 로컬 아이템 GUID |
| `price` | 등록 가격 |

**서버 처리**
1. seller_id members 검증
2. item_instance_id 이중 등록 여부 확인
3. listing 생성 (status: active)

---

### 아이템 구매
```
POST /exchange/{listing_id}/buy
```

**Request Body**

| 필드 | 설명 |
|------|------|
| `buyer_id` | 구매자 user_id |

**서버 처리 (단일 트랜잭션)**
1. buyer_id members 검증
2. 본인 listing 구매 시도 차단
3. listing status가 active인지 확인
4. 구매자 잔액 확인
5. 구매자 잔액 차감 → 판매자 잔액 증가 → listing status: sold → transactions 기록

> 모든 처리는 Postgres RPC로 원자적으로 실행하여 중간 실패 방지.

---

### 등록 취소
```
POST /exchange/{listing_id}/cancel
```

**Request Body**

| 필드 | 설명 |
|------|------|
| `user_id` | 취소 요청자 (본인만 가능) |

**서버 처리**
1. listing의 seller_id와 요청자 일치 확인
2. status가 active인 경우만 취소 허용
3. listing status: cancelled

---

## 보안 고려사항

| 위협 | 대응 방법 |
|------|---------|
| 비회원 거래 시도 | 모든 API에서 members 테이블 검증 |
| 이중 등록 | item_instance_id + active status 중복 체크 |
| 본인 구매 | buyer_id == seller_id 서버에서 차단 |
| 잔액 부족 구매 | 구매 트랜잭션 내 잔액 검증 |
| 동시 구매 경쟁 | Postgres 트랜잭션으로 원자적 처리 |
| 가격 조작 | 등록 시 최소/최대 가격 범위 제한 (범위 추후 결정) |

---

## 추가 고려사항

- **거래 수수료**: 거래 금액의 일정 % 차감 여부 결정 필요
- **등록 기간 만료**: 일정 기간 미거래 시 자동 cancelled 처리 (cron 활용 가능)
- **등급별 최저가**: 희귀 아이템의 비정상적 저가 등록 방지
- **화폐 획득 방법**: 초기 지급 외 게임 점수 연동, 판매 수익 순환 등 결정 필요

---

## 클라이언트 수정 필요 사항 (Unity)

> 서버 개발 완료 후 연동 시 수정이 필요한 항목입니다.

1. **아이템 등록 시**
   - `POST /exchange` 호출
   - 성공 시 로컬에서 해당 아이템을 비활성화 또는 삭제 처리

2. **아이템 구매 시**
   - `POST /exchange/{listing_id}/buy` 호출
   - 성공 시 응답으로 받은 아이템 정보를 로컬 인벤토리에 추가

3. **등록 취소 시**
   - `POST /exchange/{listing_id}/cancel` 호출
   - 성공 시 로컬에서 해당 아이템을 다시 활성화

4. **게임 시작 시 동기화**
   - 본인의 active listings 조회 후 로컬 아이템 상태와 동기화
   - sold/cancelled 된 항목 처리

5. **잔액 표시**
   - wallets API 연동하여 현재 예치 화폐 잔액 UI에 표시
