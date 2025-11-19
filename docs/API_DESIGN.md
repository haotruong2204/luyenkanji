# API Design for Luyenkanji Backend

## 🌐 Base URL

```
Development: http://localhost:3000/api
Production: https://api.nhaikanji.com/api
```

## 🔐 Authentication

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📚 Kanji APIs

### 1. Get All Kanjis (with pagination & filters)

```
GET /api/kanjis
```

**Query Parameters:**

```typescript
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 20, Max: 100
  jlpt?: string;          // "N5" | "N4" | "N3" | "N2" | "N1"
  grade?: number;         // 1-6
  search?: string;        // Search by character, meaning, reading
}
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "character": "一",
      "meaning_en": "one",
      "meaning_vi": "một",
      "onyomi": ["イチ", "イツ"],
      "kunyomi": ["ひと-", "ひと.つ"],
      "jlpt_level": "N5",
      "grade": 1,
      "stroke_count": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2500,
    "totalPages": 125
  }
}
```

---

### 2. Get Kanji by Character

```
GET /api/kanjis/:character
```

**Example:** `GET /api/kanjis/一`

**Response:**

```json
{
  "id": 1,
  "character": "一",
  "meaning_en": "one",
  "meaning_vi": "một",
  "onyomi": ["イチ", "イツ"],
  "onyomi_romaji": ["ichi", "itsu"],
  "kunyomi": ["ひと-", "ひと.つ"],
  "kunyomi_romaji": ["hito-", "hito.tsu"],
  "jlpt_level": "N5",
  "grade": 1,
  "stroke_count": 1,
  "stroke_timings": [0.84, 1.733333],
  "newspaper_freq_rank": 2,
  "stroke_diagram_url": "https://...",
  "video_url": "https://...",

  "radical": {
    "character": "⼀",
    "name_ja": "いち",
    "meaning": "one, horizontal stroke"
  },

  "components": [
    // Empty for "一" (no components)
  ],

  "used_in": [
    { "character": "七", "meaning": "seven" },
    { "character": "三", "meaning": "three" }
  ],

  "vocabularies": [
    {
      "id": 1,
      "word": "一年生",
      "reading_kana": "いちねんせい",
      "meaning_en": "first-year student",
      "audio_mp3": "https://..."
    }
  ]
}
```

---

### 3. Search Kanjis

```
POST /api/kanjis/search
```

**Request Body:**

```json
{
  "query": "one", // Search term
  "filters": {
    "jlpt": ["N5", "N4"],
    "grade": [1, 2],
    "minStrokes": 1,
    "maxStrokes": 10
  },
  "page": 1,
  "limit": 20
}
```

**Response:** Same as Get All Kanjis

---

### 4. Get Kanji Composition Graph

```
GET /api/kanjis/:character/composition
```

**Response:**

```json
{
  "character": "漢",
  "graph": {
    "nodes": [
      { "id": "漢", "label": "漢" },
      { "id": "氵", "label": "氵" },
      { "id": "口", "label": "口" },
      { "id": "夫", "label": "夫" }
    ],
    "links": [
      { "source": "漢", "target": "氵" },
      { "source": "漢", "target": "口" },
      { "source": "漢", "target": "夫" }
    ]
  }
}
```

---

## 📖 Vocabulary APIs

### 5. Get Vocabularies

```
GET /api/vocabularies
```

**Query Parameters:**

```typescript
{
  page?: number;
  limit?: number;
  jlpt?: string;
  kanji?: string;         // Filter by kanji character
  search?: string;
}
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "word": "一年生",
      "reading_kana": "いちねんせい",
      "reading_romaji": "ichi nensei",
      "meaning_en": "first-year student",
      "meaning_vi": "học sinh năm nhất",
      "audio_mp3": "https://...",
      "jlpt_level": "N5",
      "kanjis": ["一", "年", "生"]
    }
  ],
  "pagination": { ... }
}
```

---

## 🎯 Learning Path APIs

### 6. Get All Learning Paths

```
GET /api/learning-paths
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Kanji Sơ Cấp N5",
      "description": "Nền tảng cho người mới bắt đầu...",
      "jlpt_level": "N5",
      "kanji_count": 103,
      "estimated_duration": "2-3 tháng",
      "sequence": 1
    }
  ]
}
```

---

### 7. Get Learning Path Details

```
GET /api/learning-paths/:id
```

**Response:**

```json
{
  "id": 1,
  "name": "Kanji Sơ Cấp N5",
  "description": "...",
  "kanji_count": 103,
  "kanjis": [
    {
      "id": 1,
      "character": "一",
      "meaning": "one",
      "sequence": 1
    }
  ]
}
```

---

## 👤 User APIs

### 8. Register

```
POST /api/auth/register
```

**Request:**

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "Nguyễn Văn A"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "full_name": "Nguyễn Văn A"
  }
}
```

---

### 9. Login

```
POST /api/auth/login
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as Register

---

### 10. Get User Profile

```
GET /api/users/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "Nguyễn Văn A",
  "preferred_language": "vi",
  "stats": {
    "total_kanji_learned": 45,
    "current_streak": 7,
    "longest_streak": 15
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 11. Update User Profile

```
PUT /api/users/me
```

**Request:**

```json
{
  "full_name": "Nguyễn Văn B",
  "preferred_language": "en"
}
```

---

## 📈 Progress APIs

### 12. Get User Progress

```
GET /api/users/me/progress
```

**Query:**

```typescript
{
  status?: "learning" | "practicing" | "mastered";
  page?: number;
  limit?: number;
}
```

**Response:**

```json
{
  "data": [
    {
      "kanji": {
        "character": "一",
        "meaning": "one"
      },
      "status": "mastered",
      "srs_level": 5,
      "times_reviewed": 10,
      "times_correct": 9,
      "accuracy": 90.0,
      "next_review_date": "2024-11-25T10:00:00Z",
      "last_reviewed_at": "2024-11-20T10:00:00Z"
    }
  ]
}
```

---

### 13. Update Kanji Progress

```
POST /api/users/me/progress/kanji/:kanjiId
```

**Request:**

```json
{
  "is_correct": true, // User answered correctly?
  "time_spent": 5 // Seconds spent
}
```

**Response:**

```json
{
  "kanji": {
    "character": "一",
    "meaning": "one"
  },
  "status": "practicing",
  "srs_level": 3,
  "next_review_date": "2024-11-22T10:00:00Z",
  "level_up": true // Did user level up?
}
```

---

### 14. Get Due Reviews

```
GET /api/users/me/reviews/due
```

**Response:**

```json
{
  "kanjis": [
    {
      "id": 1,
      "character": "一",
      "meaning": "one",
      "next_review_date": "2024-11-20T09:00:00Z"
    }
  ],
  "vocabularies": [
    {
      "id": 1,
      "word": "一年生",
      "meaning": "first-year student"
    }
  ],
  "total_due": 15
}
```

---

## ⭐ Favorites APIs

### 15. Get User Favorites

```
GET /api/users/me/favorites
```

**Response:**

```json
{
  "data": [
    {
      "kanji": {
        "character": "一",
        "meaning": "one"
      },
      "favorited_at": "2024-11-15T10:00:00Z"
    }
  ]
}
```

---

### 16. Add to Favorites

```
POST /api/users/me/favorites/:kanjiId
```

**Response:**

```json
{
  "message": "Added to favorites",
  "favorited": true
}
```

---

### 17. Remove from Favorites

```
DELETE /api/users/me/favorites/:kanjiId
```

---

## 📊 Statistics APIs

### 18. Get User Statistics

```
GET /api/users/me/stats
```

**Response:**

```json
{
  "overview": {
    "total_kanji_learned": 45,
    "total_vocab_learned": 120,
    "current_streak": 7,
    "longest_streak": 15,
    "total_study_time_hours": 25.5
  },
  "daily_activity": [
    {
      "date": "2024-11-20",
      "kanji_reviewed": 12,
      "vocab_reviewed": 20,
      "time_spent_minutes": 45
    }
  ],
  "achievements": [
    {
      "type": "streak_7",
      "name": "Người kiên trì",
      "description": "Học liên tục 7 ngày",
      "unlocked_at": "2024-11-20T10:00:00Z",
      "icon": "🔥"
    }
  ]
}
```

---

### 19. Get Leaderboard

```
GET /api/leaderboard
```

**Query:**

```typescript
{
  type?: "streak" | "kanji_count" | "study_time";
  period?: "weekly" | "monthly" | "all_time";
  limit?: number;           // Default: 10
}
```

**Response:**

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "username": "user123",
        "full_name": "Nguyễn Văn A"
      },
      "score": 150, // Depends on type
      "current_streak": 15
    }
  ],
  "user_rank": {
    "rank": 25,
    "score": 45
  }
}
```

---

## 🎯 Learning Path Progress APIs

### 20. Start Learning Path

```
POST /api/users/me/learning-paths/:pathId/start
```

**Response:**

```json
{
  "message": "Started learning path",
  "path": {
    "id": 1,
    "name": "Kanji Sơ Cấp N5",
    "progress_percentage": 0.0
  }
}
```

---

### 21. Get Learning Path Progress

```
GET /api/users/me/learning-paths/:pathId/progress
```

**Response:**

```json
{
  "path": {
    "id": 1,
    "name": "Kanji Sơ Cấp N5"
  },
  "progress_percentage": 43.68,
  "kanjis_completed": 45,
  "kanjis_total": 103,
  "started_at": "2024-10-01T00:00:00Z"
}
```

---

## 🔍 Advanced Search API

### 22. Advanced Kanji Search

```
POST /api/search/advanced
```

**Request:**

```json
{
  "query": "water",
  "search_in": ["meaning", "reading", "radical"],
  "filters": {
    "jlpt": ["N5", "N4"],
    "grade": [1, 2, 3],
    "stroke_range": [1, 10],
    "has_radical": "氵",
    "frequency_rank_max": 500
  },
  "sort": "frequency", // "frequency" | "stroke_count" | "grade"
  "order": "asc",
  "page": 1,
  "limit": 20
}
```

---

## 📱 Mobile-Specific APIs

### 23. Sync User Data

```
POST /api/users/me/sync
```

**Request:**

```json
{
  "last_sync": "2024-11-19T10:00:00Z",
  "updates": [
    {
      "type": "kanji_progress",
      "kanji_id": 1,
      "data": { ... }
    }
  ]
}
```

**Response:**

```json
{
  "updates": [
    // Server updates since last_sync
  ],
  "conflicts": [
    // Conflicts to resolve
  ]
}
```

---

## 🚨 Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "email": "Email is required"
    }
  }
}
```

**Error Codes:**

- `VALIDATION_ERROR` - 400
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `CONFLICT` - 409
- `INTERNAL_ERROR` - 500

---

## 📊 Rate Limiting

```
Rate Limit: 100 requests per minute per IP
Rate Limit Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1234567890
```

---

**Next:** Backend Implementation Guide
