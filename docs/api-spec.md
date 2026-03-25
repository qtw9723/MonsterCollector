# MonsterCollector API 명세서

**Base URL**: `https://elqomxaemqiqalzhczfc.supabase.co/functions/v1`

---

## 공통

### 응답 형식
모든 응답은 `Content-Type: application/json`

### 에러 응답 형식
```json
{ "error": "에러 메시지" }
```

---

## Member API

### 회원 등록
점수를 업로드하려면 먼저 회원 등록이 필요합니다.

```
POST /member
```

**Request Body**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `user_id` | string | ✅ | 유저 고유 ID |
| `nickname` | string | ✅ | 닉네임 (중복 불가) |

**Request 예시**
```json
{
  "user_id": "user-abc123",
  "nickname": "플레이어1"
}
```

**Response `201`**
```json
{
  "message": "회원 등록 완료",
  "data": {
    "user_id": "user-abc123",
    "nickname": "플레이어1",
    "created_at": "2026-03-25T00:00:00.000Z"
  }
}
```

**에러 응답**
| 상태코드 | 원인 |
|---------|------|
| `400` | 필수 필드 누락 |
| `400` | 이미 사용 중인 user_id 또는 닉네임 |

---

### 회원 조회

```
GET /member/{user_id}
```

**Path Parameter**
| 파라미터 | 설명 |
|---------|------|
| `user_id` | 조회할 유저 ID |

**Response `200`**
```json
{
  "user_id": "user-abc123",
  "nickname": "플레이어1",
  "created_at": "2026-03-25T00:00:00.000Z"
}
```

**에러 응답**
| 상태코드 | 원인 |
|---------|------|
| `400` | user_id 미입력 |
| `404` | 존재하지 않는 유저 |

---

## Rank API

### Top 10 랭킹 조회

```
GET /rank
```

**Response `200`**
```json
[
  {
    "user_id": "user-abc123",
    "nickname": "플레이어1",
    "score": 9500,
    "level": 10,
    "created_at": "2026-03-25T00:00:00.000Z"
  }
]
```

---

### 단일 유저 랭킹 조회

```
GET /rank/{user_id}
```

**Path Parameter**
| 파라미터 | 설명 |
|---------|------|
| `user_id` | 조회할 유저 ID |

**Response `200`**
```json
{
  "user_id": "user-abc123",
  "nickname": "플레이어1",
  "score": 9500,
  "level": 10,
  "ranking": 3
}
```

> `ranking`은 매일 자정 갱신되는 leaderboard 스냅샷 기준입니다. 당일 점수 변경은 다음날 반영됩니다.
> 아직 leaderboard에 반영되지 않은 경우 `ranking: null`을 반환합니다.

**에러 응답**
| 상태코드 | 원인 |
|---------|------|
| `404` | 존재하지 않는 유저 |

---

### 점수 등록

```
POST /rank
```

> 반드시 `POST /member`로 회원 등록 후 사용 가능합니다.

**Request Body**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `user_id` | string | ✅ | 등록된 유저 ID |
| `score` | number | ✅ | 점수 |
| `level` | number | | 레벨 (선택) |

**Request 예시**
```json
{
  "user_id": "user-abc123",
  "score": 9500,
  "level": 10
}
```

**Response `200`**
```json
{
  "message": "성공",
  "data": [
    {
      "user_id": "user-abc123",
      "score": 9500,
      "level": 10,
      "created_at": "2026-03-25T00:00:00.000Z"
    }
  ]
}
```

**에러 응답**
| 상태코드 | 원인 |
|---------|------|
| `400` | 필수 필드 누락 |
| `500` | 등록되지 않은 유저 또는 서버 오류 |

---

## 게임 플로우

```
1. POST /member       → 회원 등록 (최초 1회)
2. [게임 플레이]
3. POST /rank         → 점수 업로드
4. GET  /rank         → Top 10 랭킹 확인
5. GET  /rank/{id}    → 내 순위 확인
```
