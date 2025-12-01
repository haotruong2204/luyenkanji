# THIẾT KẾ DATABASE CHO LUYENKANJI API

> Tài liệu thiết kế database Rails cho API backend của ứng dụng học Kanji

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Sơ đồ database](#sơ-đồ-database)
3. [Chi tiết các bảng](#chi-tiết-các-bảng)
4. [Rails Models](#rails-models)
5. [Rails Migrations](#rails-migrations)
6. [Import dữ liệu](#import-dữ-liệu)

---

## 🎯 TỔNG QUAN

Database được thiết kế để hỗ trợ API backend cho ứng dụng Luyenkanji, lưu trữ thông tin của **2500+ Kanji**.

### Dữ liệu hiện tại (từ UI):

UI đang hiển thị:

- ✅ Ký tự Kanji + Hán Việt (hanzi)
- ✅ Ý nghĩa tiếng Việt/Anh
- ✅ JLPT Level, Số nét
- ✅ Âm Kun, Âm On
- ✅ Ví dụ câu với audio
- ✅ Cấu tạo từ bộ thủ (composition graph)
- ✅ Gợi ý cách nhớ (story)
- ✅ Thông tin bộ thủ (radical)
- ✅ Tham chiếu sách giáo khoa

### Cấu trúc database:

```
4 bảng chính:
├── kanjis               (Thông tin Kanji chính)
├── kanji_examples       (Ví dụ từ vựng + audio)
├── kanji_compositions   (Quan hệ thành phần - graph)
└── textbook_references  (Tham chiếu sách)
```

---

## 🗺️ SƠ ĐỒ DATABASE

```
┌──────────────────────────────────────────────┐
│              KANJIS                          │
│  character (PK) - "一", "人", "日"          │
│  + Thông tin cơ bản                          │
│  + Meanings (EN/VI)                          │
│  + Readings (Kun/On)                         │
│  + Radical info                              │
│  + References                                │
└───────┬──────────────────────────────────────┘
        │
        ├─── has_many ───> KANJI_EXAMPLES
        │                  (Ví dụ từ vựng + audio)
        │
        ├─── has_many ───> KANJI_COMPOSITIONS
        │                  (Quan hệ in/out)
        │
        └─── has_many ───> TEXTBOOK_REFERENCES
                           (Sách giáo khoa)
```

---

## 📚 CHI TIẾT CÁC BẢNG

### 1. Bảng `kanjis`

**Mục đích:** Lưu toàn bộ thông tin về mỗi Kanji

#### Cấu trúc:

```ruby
create_table :kanjis do |t|
  # === KHÓA CHÍNH ===
  t.string :character, limit: 10, null: false  # "一", "人"

  # === THÔNG TIN CƠ BẢN ===
  t.string :hanzi, limit: 100                  # Hán Việt: "NHẤT", "NHÂN"
  t.text :story                                # Gợi ý cách nhớ
  t.integer :grade                             # 1-6 (học ở lớp mấy)
  t.integer :stroke_count                      # Số nét

  # === JLPT & RANKINGS ===
  t.string :jlpt_level, limit: 5               # "N1", "N2", "N3", "N4", "N5"
  t.string :taught_in, limit: 20               # "grade 1", "grade 2"
  t.integer :newspaper_frequency_rank          # Thứ hạng trong báo

  # === MEANINGS ===
  t.text :meaning                              # Nghĩa tiếng Việt/Anh

  # === READINGS (JSON Arrays) ===
  t.json :kunyomi                              # ["ひと-", "ひと.つ"]
  t.json :onyomi                               # ["イチ", "イツ"]

  # === RADICAL INFO ===
  t.string :radical_symbol, limit: 10          # "⼀"
  t.text :radical_meaning                      # "one, horizontal stroke"

  # === STROKE ORDER URLs ===
  t.text :stroke_order_diagram_uri
  t.text :stroke_order_svg_uri
  t.text :stroke_order_gif_uri
  t.text :jisho_uri

  # === REFERENCES ===
  t.string :kodansha_ref, limit: 20
  t.string :classic_nelson_ref, limit: 20

  t.timestamps
end

add_index :kanjis, :character, unique: true
add_index :kanjis, :jlpt_level
add_index :kanjis, :stroke_count
add_index :kanjis, :grade
```

#### Ví dụ data:

```json
{
  "character": "一",
  "hanzi": "NHẤT",
  "story": "Một gạch ngang = số một",
  "grade": 1,
  "stroke_count": 1,
  "jlpt_level": "N5",
  "taught_in": "grade 1",
  "newspaper_frequency_rank": 2,
  "meaning": "one, one radical (no.1)",
  "kunyomi": ["ひと-", "ひと.つ"],
  "onyomi": ["イチ", "イツ"],
  "radical_symbol": "⼀",
  "radical_meaning": "one, horizontal stroke"
}
```

---

### 2. Bảng `kanji_examples`

**Mục đích:** Lưu các ví dụ từ vựng kèm audio

#### Cấu trúc:

```ruby
create_table :kanji_examples do |t|
  t.string :kanji_id, null: false, limit: 10     # FK to kanjis.character

  # === NỘI DUNG VÍ DỤ ===
  t.text :japanese, null: false                  # "一年生（いちねんせい）"
  t.string :reading, limit: 200                  # "イチネンセイ"
  t.text :meaning_english                        # "first-year student"

  # === AUDIO (4 formats) ===
  t.text :audio_opus
  t.text :audio_aac
  t.text :audio_ogg
  t.text :audio_mp3

  # === METADATA ===
  t.string :example_type, limit: 10              # "onyomi", "kunyomi", "jisho"
  t.integer :display_order, default: 0

  t.timestamps
end

add_index :kanji_examples, :kanji_id
add_index :kanji_examples, :example_type
```

#### Ví dụ data:

```json
{
  "kanji_id": "一",
  "japanese": "一年生（いちねんせい）",
  "reading": "いちねんせい",
  "meaning_english": "first-year student",
  "audio_opus": "https://media.kanjialive.com/.../1_06_a.opus",
  "audio_mp3": "https://media.kanjialive.com/.../1_06_a.mp3",
  "example_type": "onyomi",
  "display_order": 0
}
```

---

### 3. Bảng `kanji_compositions`

**Mục đích:** Lưu quan hệ cấu tạo giữa các Kanji (cho composition graph)

#### Cấu trúc:

```ruby
create_table :kanji_compositions do |t|
  t.string :kanji_id, null: false, limit: 10        # Kanji chính
  t.string :related_kanji, null: false, limit: 10   # Kanji liên quan
  t.string :relation_type, null: false, limit: 3    # "in" hoặc "out"

  t.timestamps
end

add_index :kanji_compositions, :kanji_id
add_index :kanji_compositions, :related_kanji
add_index :kanji_compositions, [:kanji_id, :relation_type, :related_kanji],
          unique: true, name: 'idx_unique_composition'
```

#### Giải thích relation_type:

- **`"in"`**: Kanji này được TẠO THÀNH từ related_kanji
  - Ví dụ: `{kanji_id: "林", related_kanji: "木", relation_type: "in"}`
  - Nghĩa: "林" được tạo từ "木"

- **`"out"`**: Related_kanji SỬ DỤNG kanji này làm thành phần
  - Ví dụ: `{kanji_id: "木", related_kanji: "林", relation_type: "out"}`
  - Nghĩa: "木" được dùng để tạo "林"

#### Ví dụ data (Kanji "林" = rừng):

```
composition.json: {"林": {"in": ["木", "木"], "out": ["森"]}}

Database records:
┌─────────┬───────────────┬───────────────┐
│ kanji_id│ related_kanji │ relation_type │
├─────────┼───────────────┼───────────────┤
│ 林      │ 木            │ in            │
│ 林      │ 木            │ in            │
│ 林      │ 森            │ out           │
│ 木      │ 林            │ out           │
└─────────┴───────────────┴───────────────┘
```

---

### 4. Bảng `textbook_references`

**Mục đích:** Lưu thông tin Kanji xuất hiện ở sách nào, chương nào

#### Cấu trúc:

```ruby
create_table :textbook_references do |t|
  t.string :kanji_id, null: false, limit: 10
  t.string :textbook_code, null: false, limit: 50   # "lesson", "txtGenki"
  t.string :chapter, limit: 20                      # "3", "c12"

  t.timestamps
end

add_index :textbook_references, :kanji_id
add_index :textbook_references, [:textbook_code, :chapter]
```

#### Textbook codes phổ biến:

```ruby
{
  'lesson'         => 'CIJ Lessons',
  'txtBasicKanji'  => 'Basic Kanji Book',
  'txtGenki'       => 'Genki',
  'txtAP'          => 'AP Japanese',
  'mosr'           => 'Remembering the Kanji',
  'cijr'           => 'CIJ Revised'
}
```

#### Ví dụ data:

```json
{
  "kanji_id": "一",
  "textbook_code": "txtGenki",
  "chapter": "3"
}
```

---

## 🚂 RAILS MODELS

### 1. Model: Kanji

```ruby
# app/models/kanji.rb
class Kanji < ApplicationRecord
  self.primary_key = 'character'

  # === ASSOCIATIONS ===
  has_many :kanji_examples, foreign_key: 'kanji_id', dependent: :destroy
  has_many :textbook_references, foreign_key: 'kanji_id', dependent: :destroy

  # Compositions
  has_many :in_compositions, -> { where(relation_type: 'in') },
           class_name: 'KanjiComposition', foreign_key: 'kanji_id'
  has_many :out_compositions, -> { where(relation_type: 'out') },
           class_name: 'KanjiComposition', foreign_key: 'kanji_id'

  # === VALIDATIONS ===
  validates :character, presence: true, uniqueness: true
  validates :stroke_count, numericality: { only_integer: true, greater_than: 0 },
            allow_nil: true
  validates :jlpt_level, inclusion: { in: %w[N1 N2 N3 N4 N5] }, allow_nil: true

  # === JSON SERIALIZATION ===
  serialize :kunyomi, coder: JSON
  serialize :onyomi, coder: JSON

  # === SCOPES ===
  scope :by_jlpt, ->(level) { where(jlpt_level: level) }
  scope :by_grade, ->(grade) { where(grade: grade) }
  scope :by_stroke_count, ->(count) { where(stroke_count: count) }
  scope :ordered_by_frequency, -> { order(newspaper_frequency_rank: :asc) }

  # === INSTANCE METHODS ===
  def to_param
    character
  end

  def to_s
    character
  end

  # Lấy các Kanji thành phần
  def component_kanjis
    in_compositions.pluck(:related_kanji)
  end

  # Lấy các Kanji sử dụng kanji này
  def compound_kanjis
    out_compositions.pluck(:related_kanji)
  end
end
```

---

### 2. Model: KanjiExample

```ruby
# app/models/kanji_example.rb
class KanjiExample < ApplicationRecord
  belongs_to :kanji, foreign_key: 'kanji_id', primary_key: 'character'

  # === VALIDATIONS ===
  validates :kanji_id, presence: true
  validates :japanese, presence: true
  validates :example_type, inclusion: { in: %w[onyomi kunyomi jisho] }

  # === SCOPES ===
  scope :onyomi_examples, -> { where(example_type: 'onyomi') }
  scope :kunyomi_examples, -> { where(example_type: 'kunyomi') }
  scope :ordered, -> { order(display_order: :asc, id: :asc) }

  # === INSTANCE METHODS ===
  def audio_url(format = :mp3)
    send("audio_#{format}")
  end

  def audio?
    audio_mp3.present?
  end
end
```

---

### 3. Model: KanjiComposition

```ruby
# app/models/kanji_composition.rb
class KanjiComposition < ApplicationRecord
  belongs_to :kanji, foreign_key: 'kanji_id', primary_key: 'character'

  # === VALIDATIONS ===
  validates :kanji_id, presence: true
  validates :related_kanji, presence: true
  validates :relation_type, presence: true, inclusion: { in: %w[in out] }
  validates :kanji_id, uniqueness: { scope: [:relation_type, :related_kanji] }

  # === SCOPES ===
  scope :inbound, -> { where(relation_type: 'in') }
  scope :outbound, -> { where(relation_type: 'out') }
end
```

---

### 4. Model: TextbookReference

```ruby
# app/models/textbook_reference.rb
class TextbookReference < ApplicationRecord
  belongs_to :kanji, foreign_key: 'kanji_id', primary_key: 'character'

  # === VALIDATIONS ===
  validates :kanji_id, presence: true
  validates :textbook_code, presence: true

  # === SCOPES ===
  scope :by_textbook, ->(code) { where(textbook_code: code) }
  scope :by_chapter, ->(chapter) { where(chapter: chapter) }
  scope :ordered, -> { order(textbook_code: :asc, chapter: :asc) }

  # === CONSTANTS ===
  TEXTBOOK_NAMES = {
    'lesson' => 'CIJ Lessons',
    'txtBasicKanji' => 'Basic Kanji Book',
    'txtGenki' => 'Genki',
    'txtAP' => 'AP Japanese',
    'mosr' => 'Remembering the Kanji',
    'cijr' => 'CIJ Revised'
  }.freeze

  def textbook_name
    TEXTBOOK_NAMES[textbook_code] || textbook_code
  end
end
```

---

## 📋 RAILS MIGRATIONS

### Migration 1: Update Kanjis Table

```ruby
# db/migrate/XXXXXX_add_fields_to_kanjis.rb
class AddFieldsToKanjis < ActiveRecord::Migration[8.0]
  def change
    # Rename character column to be primary key
    # (if not already - depends on existing schema)

    # Add new fields
    add_column :kanjis, :hanzi, :string, limit: 100
    add_column :kanjis, :story, :text
    add_column :kanjis, :grade, :integer
    add_column :kanjis, :taught_in, :string, limit: 20
    add_column :kanjis, :newspaper_frequency_rank, :integer
    add_column :kanjis, :meaning, :text
    add_column :kanjis, :radical_symbol, :string, limit: 10
    add_column :kanjis, :radical_meaning, :text
    add_column :kanjis, :stroke_order_diagram_uri, :text
    add_column :kanjis, :stroke_order_svg_uri, :text
    add_column :kanjis, :stroke_order_gif_uri, :text
    add_column :kanjis, :jisho_uri, :text
    add_column :kanjis, :kodansha_ref, :string, limit: 20
    add_column :kanjis, :classic_nelson_ref, :string, limit: 20

    # Add indexes
    add_index :kanjis, :grade
    add_index :kanjis, :newspaper_frequency_rank

    # Remove old fields if exists
    # remove_column :kanjis, :sino_vietnamese if column_exists?
  end
end
```

---

### Migration 2: Create Kanji Examples

```ruby
# db/migrate/XXXXXX_create_kanji_examples.rb
class CreateKanjiExamples < ActiveRecord::Migration[8.0]
  def change
    create_table :kanji_examples do |t|
      t.string :kanji_id, null: false, limit: 10

      t.text :japanese, null: false
      t.string :reading, limit: 200
      t.text :meaning_english

      t.text :audio_opus
      t.text :audio_aac
      t.text :audio_ogg
      t.text :audio_mp3

      t.string :example_type, limit: 10, default: 'jisho'
      t.integer :display_order, default: 0

      t.timestamps
    end

    add_foreign_key :kanji_examples, :kanjis,
                    column: :kanji_id, primary_key: :character,
                    on_delete: :cascade
    add_index :kanji_examples, :kanji_id
    add_index :kanji_examples, :example_type
  end
end
```

---

### Migration 3: Create Kanji Compositions

```ruby
# db/migrate/XXXXXX_create_kanji_compositions.rb
class CreateKanjiCompositions < ActiveRecord::Migration[8.0]
  def change
    create_table :kanji_compositions do |t|
      t.string :kanji_id, null: false, limit: 10
      t.string :related_kanji, null: false, limit: 10
      t.string :relation_type, null: false, limit: 3  # 'in' or 'out'

      t.timestamps
    end

    add_foreign_key :kanji_compositions, :kanjis,
                    column: :kanji_id, primary_key: :character,
                    on_delete: :cascade
    add_index :kanji_compositions, :kanji_id
    add_index :kanji_compositions, :related_kanji
    add_index :kanji_compositions, :relation_type
    add_index :kanji_compositions, [:kanji_id, :relation_type, :related_kanji],
              unique: true, name: 'idx_unique_composition'
  end
end
```

---

### Migration 4: Create Textbook References

```ruby
# db/migrate/XXXXXX_create_textbook_references.rb
class CreateTextbookReferences < ActiveRecord::Migration[8.0]
  def change
    create_table :textbook_references do |t|
      t.string :kanji_id, null: false, limit: 10
      t.string :textbook_code, null: false, limit: 50
      t.string :chapter, limit: 20

      t.timestamps
    end

    add_foreign_key :textbook_references, :kanjis,
                    column: :kanji_id, primary_key: :character,
                    on_delete: :cascade
    add_index :textbook_references, :kanji_id
    add_index :textbook_references, [:textbook_code, :chapter]
  end
end
```

---

## 📥 IMPORT DỮ LIỆU

### Rake Task: Import từ JSON files

```ruby
# lib/tasks/import_kanji.rake
namespace :kanji do
  desc "Import kanji data from luyenkanji JSON files"
  task import: :environment do
    require 'json'

    # Đường dẫn tới dự án luyenkanji
    LUYENKANJI_PATH = ENV['LUYENKANJI_PATH'] || '/Users/haotruong/Desktop/luyenkanji'

    puts "🚀 Starting import from #{LUYENKANJI_PATH}"

    # 1. Import composition data
    puts "\n📊 Importing composition data..."
    import_compositions

    # 2. Import kanji data
    puts "\n📚 Importing kanji data..."
    import_kanjis

    puts "\n✅ Import completed!"
    print_statistics
  end

  def import_compositions
    composition_file = File.join(LUYENKANJI_PATH, 'data', 'composition.json')
    composition = JSON.parse(File.read(composition_file))

    count = 0
    composition.each do |kanji, data|
      # Import 'in' relationships
      data['in'].each do |component|
        KanjiComposition.find_or_create_by!(
          kanji_id: kanji,
          related_kanji: component,
          relation_type: 'in'
        )
        count += 1
      end

      # Import 'out' relationships
      data['out'].each do |compound|
        KanjiComposition.find_or_create_by!(
          kanji_id: kanji,
          related_kanji: compound,
          relation_type: 'out'
        )
        count += 1
      end
    end

    puts "   ✓ Imported #{count} composition relationships"
  end

  def import_kanjis
    kanji_dir = File.join(LUYENKANJI_PATH, 'data', 'kanji')
    files = Dir.glob(File.join(kanji_dir, '*.json'))

    files.each_with_index do |file, index|
      data = JSON.parse(File.read(file))

      # Skip if not a proper kanji
      next if data['id'].nil? || data['id'].length > 10

      import_kanji(data)

      print "\r   Progress: #{index + 1}/#{files.count}" if (index % 10 == 0)
    end

    puts "\n   ✓ Imported #{Kanji.count} kanjis"
  end

  def import_kanji(data)
    jisho = data['jishoData'] || {}
    kanjialive = data['kanjialiveData'] || {}

    # Create or update Kanji
    kanji = Kanji.find_or_initialize_by(character: data['id'])

    kanji.assign_attributes(
      hanzi: data['hanzi'],
      story: data['story'],
      grade: kanjialive['grade'] || kanjialive.dig('references', 'grade'),
      stroke_count: jisho['strokeCount'] || kanjialive['kstroke'],
      jlpt_level: jisho['jlptLevel'],
      taught_in: jisho['taughtIn'],
      newspaper_frequency_rank: jisho['newspaperFrequencyRank'],
      meaning: jisho['meaning'],
      kunyomi: jisho['kunyomi'] || [],
      onyomi: jisho['onyomi'] || [],
      radical_symbol: jisho.dig('radical', 'symbol'),
      radical_meaning: jisho.dig('radical', 'meaning'),
      stroke_order_diagram_uri: jisho['strokeOrderDiagramUri'],
      stroke_order_svg_uri: jisho['strokeOrderSvgUri'],
      stroke_order_gif_uri: jisho['strokeOrderGifUri'],
      jisho_uri: jisho['uri'],
      kodansha_ref: kanjialive.dig('references', 'kodansha'),
      classic_nelson_ref: kanjialive.dig('references', 'classic_nelson')
    )

    kanji.save!

    # Import examples
    import_examples(kanji, kanjialive, jisho)

    # Import textbook references
    import_textbooks(kanji, kanjialive)
  end

  def import_examples(kanji, kanjialive, jisho)
    # From KanjiAlive
    if kanjialive['examples']
      kanjialive['examples'].each_with_index do |ex, idx|
        KanjiExample.find_or_create_by!(
          kanji_id: kanji.character,
          japanese: ex['japanese'],
          meaning_english: ex.dig('meaning', 'english'),
          audio_opus: ex.dig('audio', 'opus'),
          audio_aac: ex.dig('audio', 'aac'),
          audio_ogg: ex.dig('audio', 'ogg'),
          audio_mp3: ex.dig('audio', 'mp3'),
          example_type: 'onyomi',
          display_order: idx
        )
      end
    end

    # From Jisho - Onyomi examples
    if jisho['onyomiExamples']
      jisho['onyomiExamples'].each_with_index do |ex, idx|
        KanjiExample.find_or_create_by!(
          kanji_id: kanji.character,
          japanese: ex['example'],
          reading: ex['reading'],
          meaning_english: ex['meaning'],
          example_type: 'onyomi',
          display_order: idx + 100
        )
      end
    end

    # From Jisho - Kunyomi examples
    if jisho['kunyomiExamples']
      jisho['kunyomiExamples'].each_with_index do |ex, idx|
        KanjiExample.find_or_create_by!(
          kanji_id: kanji.character,
          japanese: ex['example'],
          reading: ex['reading'],
          meaning_english: ex['meaning'],
          example_type: 'kunyomi',
          display_order: idx + 200
        )
      end
    end
  end

  def import_textbooks(kanji, kanjialive)
    return unless kanjialive['txt_books']

    kanjialive['txt_books'].each do |ref|
      TextbookReference.find_or_create_by!(
        kanji_id: kanji.character,
        textbook_code: ref['txt_bk'],
        chapter: ref['chapter']
      )
    end
  end

  def print_statistics
    puts "\n📈 Statistics:"
    puts "   Kanjis: #{Kanji.count}"
    puts "   Examples: #{KanjiExample.count}"
    puts "   Compositions: #{KanjiComposition.count}"
    puts "   Textbook References: #{TextbookReference.count}"
  end
end
```

### Cách sử dụng:

```bash
cd /Users/haotruong/Desktop/nhaituvung_api

# Run migrations
rails db:migrate

# Import data (mặc định từ /Users/haotruong/Desktop/luyenkanji)
rails kanji:import

# Hoặc chỉ định đường dẫn khác
LUYENKANJI_PATH=/path/to/luyenkanji rails kanji:import
```

---

## 🎯 KẾT LUẬN

### Thiết kế này:

✅ **Đơn giản** - Chỉ 4 bảng theo đúng UI requirements
✅ **Hiệu quả** - Index đầy đủ cho query performance
✅ **Linh hoạt** - JSON cho arrays (kunyomi, onyomi)
✅ **Dễ maintain** - Mapping 1-1 với JSON structure hiện tại
✅ **Rails-friendly** - Follow Rails conventions

### Dung lượng ước tính:

| Bảng                | Records | Dung lượng |
| ------------------- | ------- | ---------- |
| kanjis              | ~2,500  | ~3 MB      |
| kanji_examples      | ~25,000 | ~12 MB     |
| kanji_compositions  | ~20,000 | ~2 MB      |
| textbook_references | ~15,000 | ~1 MB      |
| **TOTAL**           | ~62,500 | **~18 MB** |

---

**Generated:** 2025-11-30
**Project:** Luyenkanji API Backend
