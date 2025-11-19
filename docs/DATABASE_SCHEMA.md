# Database Schema & API Design for Luyenkanji

## 📊 Phân tích Data hiện tại

### Các file data:

1. **composition.json** (661KB) - Composition graph cho 2500+ kanji
2. **kanjilist.json** (448KB) - Danh sách kanji cơ bản
3. **radicallist.json** (105KB) - Danh sách radical
4. **searchlist.json** (702KB) - Data cho search
5. **kanji/{character}.json** - Chi tiết từng kanji (~2500 files)

### Vấn đề hiện tại:

- ❌ Data bị duplicate (kanjilist, searchlist)
- ❌ Không có user data (progress, favorites, streak)
- ❌ Không có vocabulary management
- ❌ Không có learning path tracking

---

## 🗄️ Database Schema (PostgreSQL)

### 1. **Table: kanjis**

```sql
CREATE TABLE kanjis (
  id SERIAL PRIMARY KEY,
  character VARCHAR(1) UNIQUE NOT NULL,  -- Kanji character: "一"

  -- Basic info
  meaning_en TEXT NOT NULL,              -- "one"
  meaning_vi TEXT,                       -- "một" (Vietnamese)

  -- Readings
  onyomi TEXT[],                         -- ["イチ", "イツ"]
  onyomi_romaji TEXT[],                  -- ["ichi", "itsu"]
  kunyomi TEXT[],                        -- ["ひと-", "ひと.つ"]
  kunyomi_romaji TEXT[],                 -- ["hito-", "hito.tsu"]

  -- Classification
  grade INT,                             -- 1-6 (school grade)
  jlpt_level VARCHAR(2),                 -- "N5", "N4", "N3", "N2", "N1"
  joyo BOOLEAN DEFAULT false,            -- Joyo kanji?
  jinmeiyo BOOLEAN DEFAULT false,        -- Jinmeiyo kanji?

  -- Frequency
  newspaper_freq_rank INT,               -- Newspaper frequency rank

  -- Stroke info
  stroke_count INT,
  stroke_order_svg TEXT,                 -- SVG path or URL
  stroke_timings DECIMAL[],              -- Animation timings

  -- URLs
  stroke_diagram_url TEXT,
  video_url TEXT,

  -- Search optimization
  search_vector TSVECTOR,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kanjis_character ON kanjis(character);
CREATE INDEX idx_kanjis_jlpt ON kanjis(jlpt_level);
CREATE INDEX idx_kanjis_grade ON kanjis(grade);
CREATE INDEX idx_kanjis_search ON kanjis USING GIN(search_vector);
```

### 2. **Table: radicals**

```sql
CREATE TABLE radicals (
  id SERIAL PRIMARY KEY,
  character VARCHAR(2) UNIQUE NOT NULL, -- "⼀"
  name_ja TEXT,                         -- "いち"
  name_en TEXT,                         -- "one"
  name_romaji TEXT,                     -- "ichi"
  meaning TEXT,                         -- "one, horizontal stroke"
  stroke_count INT,
  position TEXT,                        -- Position type
  image_url TEXT,
  animation_urls TEXT[],

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_radicals_character ON radicals(character);
```

### 3. **Table: kanji_radicals** (Many-to-Many)

```sql
CREATE TABLE kanji_radicals (
  kanji_id INT REFERENCES kanjis(id) ON DELETE CASCADE,
  radical_id INT REFERENCES radicals(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,

  PRIMARY KEY (kanji_id, radical_id)
);
```

### 4. **Table: kanji_composition** (Graph)

```sql
CREATE TABLE kanji_composition (
  parent_kanji_id INT REFERENCES kanjis(id) ON DELETE CASCADE,
  component_kanji_id INT REFERENCES kanjis(id) ON DELETE CASCADE,

  PRIMARY KEY (parent_kanji_id, component_kanji_id)
);

-- Parent "漢" is composed of components "氵", "口", "夫"
-- Query: Get all components of "漢"
-- SELECT * FROM kanji_composition WHERE parent_kanji_id = ?

-- Query: Get all kanji that use "一" as component
-- SELECT * FROM kanji_composition WHERE component_kanji_id = ?
```

### 5. **Table: vocabularies**

```sql
CREATE TABLE vocabularies (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,                   -- "一年生"
  reading_kana TEXT,                    -- "いちねんせい"
  reading_romaji TEXT,                  -- "ichi nensei"
  meaning_en TEXT,                      -- "first-year student"
  meaning_vi TEXT,                      -- "học sinh năm nhất"

  -- Audio URLs
  audio_mp3 TEXT,
  audio_ogg TEXT,

  jlpt_level VARCHAR(2),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vocab_word ON vocabularies(word);
CREATE INDEX idx_vocab_jlpt ON vocabularies(jlpt_level);
```

### 6. **Table: kanji_vocabularies** (Many-to-Many)

```sql
CREATE TABLE kanji_vocabularies (
  kanji_id INT REFERENCES kanjis(id) ON DELETE CASCADE,
  vocabulary_id INT REFERENCES vocabularies(id) ON DELETE CASCADE,

  PRIMARY KEY (kanji_id, vocabulary_id)
);
```

### 7. **Table: learning_paths**

```sql
CREATE TABLE learning_paths (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,                   -- "Kanji Sơ Cấp N5"
  description TEXT,
  jlpt_level VARCHAR(2),
  sequence INT,                         -- Display order
  kanji_count INT,                      -- Cached count
  estimated_duration TEXT,              -- "2-3 tháng"

  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8. **Table: learning_path_items**

```sql
CREATE TABLE learning_path_items (
  id SERIAL PRIMARY KEY,
  path_id INT REFERENCES learning_paths(id) ON DELETE CASCADE,
  kanji_id INT REFERENCES kanjis(id) ON DELETE CASCADE,
  sequence INT,                         -- Order within path

  UNIQUE(path_id, kanji_id)
);
```

---

## 👥 User Tables

### 9. **Table: users**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE,
  password_hash TEXT,
  full_name TEXT,

  -- Settings
  preferred_language VARCHAR(2) DEFAULT 'vi',  -- vi, en

  -- Stats (cached)
  total_kanji_learned INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 10. **Table: user_kanji_progress**

```sql
CREATE TABLE user_kanji_progress (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  kanji_id INT REFERENCES kanjis(id) ON DELETE CASCADE,

  -- Progress levels: learning, practicing, mastered
  status VARCHAR(20) DEFAULT 'learning',

  -- SRS (Spaced Repetition System)
  srs_level INT DEFAULT 0,              -- 0-8 (WaniKani-style)
  next_review_date TIMESTAMP,

  -- Practice stats
  times_reviewed INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  times_incorrect INT DEFAULT 0,

  -- Timestamps
  first_studied_at TIMESTAMP DEFAULT NOW(),
  last_reviewed_at TIMESTAMP,
  mastered_at TIMESTAMP,

  PRIMARY KEY (user_id, kanji_id)
);

CREATE INDEX idx_user_progress_status ON user_kanji_progress(user_id, status);
CREATE INDEX idx_user_progress_review ON user_kanji_progress(next_review_date);
```

### 11. **Table: user_vocabulary_progress**

```sql
CREATE TABLE user_vocabulary_progress (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  vocabulary_id INT REFERENCES vocabularies(id) ON DELETE CASCADE,

  status VARCHAR(20) DEFAULT 'learning',
  srs_level INT DEFAULT 0,
  next_review_date TIMESTAMP,

  times_reviewed INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  times_incorrect INT DEFAULT 0,

  first_studied_at TIMESTAMP DEFAULT NOW(),
  last_reviewed_at TIMESTAMP,
  mastered_at TIMESTAMP,

  PRIMARY KEY (user_id, vocabulary_id)
);
```

### 12. **Table: user_favorites**

```sql
CREATE TABLE user_favorites (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  kanji_id INT REFERENCES kanjis(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (user_id, kanji_id)
);
```

### 13. **Table: user_learning_paths**

```sql
CREATE TABLE user_learning_paths (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  path_id INT REFERENCES learning_paths(id) ON DELETE CASCADE,

  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,

  PRIMARY KEY (user_id, path_id)
);
```

### 14. **Table: user_daily_activity**

```sql
CREATE TABLE user_daily_activity (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,

  kanji_reviewed INT DEFAULT 0,
  vocab_reviewed INT DEFAULT 0,
  time_spent_minutes INT DEFAULT 0,

  PRIMARY KEY (user_id, activity_date)
);

CREATE INDEX idx_daily_activity_date ON user_daily_activity(user_id, activity_date DESC);
```

### 15. **Table: user_achievements**

```sql
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50),         -- "streak_7", "kanji_100", etc.
  unlocked_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, achievement_type)
);
```

---

## 🔄 Data Migration Strategy

### Phase 1: Import Static Data

```sql
-- 1. Import kanjis from /data/kanji/*.json
-- 2. Import radicals from radicallist.json
-- 3. Import composition graph from composition.json
-- 4. Import vocabularies from kanji examples
-- 5. Create default learning paths (N5-N1)
```

### Phase 2: Optimize Search

```sql
-- Update search vectors for full-text search
UPDATE kanjis SET search_vector =
  to_tsvector('simple',
    coalesce(character, '') || ' ' ||
    coalesce(meaning_en, '') || ' ' ||
    coalesce(meaning_vi, '') || ' ' ||
    coalesce(array_to_string(onyomi_romaji, ' '), '') || ' ' ||
    coalesce(array_to_string(kunyomi_romaji, ' '), '')
  );
```

---

## 📝 Notes on Optimization

### Removed Duplicates:

- ✅ `kanjilist.json` → merged into `kanjis` table
- ✅ `searchlist.json` → replaced by PostgreSQL full-text search
- ✅ Separate kanji files → consolidated into single table

### Added Features:

- ✅ User progress tracking (SRS)
- ✅ Streak system
- ✅ Achievements
- ✅ Favorites
- ✅ Learning paths
- ✅ Daily activity tracking

### Search Optimization:

- Full-text search using PostgreSQL `tsvector`
- Indexed by JLPT level, grade, character
- Support search by: kanji, meaning (EN/VI), reading (romaji/kana)

---

**Next:** API Endpoints Design
