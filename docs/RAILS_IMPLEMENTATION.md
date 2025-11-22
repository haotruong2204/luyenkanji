# Rails Implementation Guide - Luyenkanji API (MySQL)

Hướng dẫn chi tiết để xây dựng backend API cho Luyenkanji bằng Ruby on Rails với MySQL.

## 📋 Tech Stack

- **Ruby on Rails** >= 7.1
- **MySQL** >= 8.0
- **Ruby** >= 3.2
- **Gems chính:**
  - `devise` hoặc `jwt` - Authentication
  - `mysql2` - MySQL adapter
  - `rack-cors` - CORS support
  - `active_model_serializers` hoặc `jsonapi-serializer` - JSON serialization
  - `kaminari` hoặc `pagy` - Pagination

---

## 🚀 Setup Project

```bash
# Tạo Rails API app mới với MySQL
rails new luyenkanji_api --api --database=mysql

cd luyenkanji_api

# Thêm gems vào Gemfile
bundle add devise-jwt
bundle add rack-cors
bundle add jsonapi-serializer
bundle add kaminari

# Cấu hình database.yml
# config/database.yml
# development:
#   adapter: mysql2
#   encoding: utf8mb4
#   pool: 5
#   username: root
#   password: your_password
#   host: localhost
#   database: luyenkanji_api_development

# Setup database
rails db:create
```

---

## 📝 Database Migrations

### 1. Migration: Create Kanjis Table

```bash
rails generate migration CreateKanjis
```

```ruby
# db/migrate/XXXXXX_create_kanjis.rb
class CreateKanjis < ActiveRecord::Migration[7.1]
  def change
    create_table :kanjis do |t|
      t.string :character, limit: 1, null: false

      # Basic info
      t.text :meaning_en, null: false
      t.text :meaning_vi

      # Readings (JSON columns for MySQL)
      t.json :onyomi
      t.json :onyomi_romaji
      t.json :kunyomi
      t.json :kunyomi_romaji

      # Classification
      t.integer :grade
      t.string :jlpt_level, limit: 2
      t.boolean :joyo, default: false
      t.boolean :jinmeiyo, default: false

      # Frequency
      t.integer :newspaper_freq_rank

      # Stroke info
      t.integer :stroke_count
      t.text :stroke_order_svg
      t.json :stroke_timings

      # URLs
      t.text :stroke_diagram_url
      t.text :video_url

      t.timestamps
    end

    # Indexes
    add_index :kanjis, :character, unique: true
    add_index :kanjis, :jlpt_level
    add_index :kanjis, :grade
  end
end
```

### 2. Migration: Create Radicals Table

```bash
rails generate migration CreateRadicals
```

```ruby
# db/migrate/XXXXXX_create_radicals.rb
class CreateRadicals < ActiveRecord::Migration[7.1]
  def change
    create_table :radicals do |t|
      t.string :character, limit: 2, null: false
      t.text :name_ja
      t.text :name_en
      t.text :name_romaji
      t.text :meaning
      t.integer :stroke_count
      t.text :position
      t.text :image_url
      t.json :animation_urls

      t.timestamps
    end

    add_index :radicals, :character, unique: true
  end
end
```

### 3. Migration: Create Join Tables

```bash
rails generate migration CreateKanjiRadicals
rails generate migration CreateKanjiComposition
```

```ruby
# db/migrate/XXXXXX_create_kanji_radicals.rb
class CreateKanjiRadicals < ActiveRecord::Migration[7.1]
  def change
    create_table :kanji_radicals do |t|
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }
      t.references :radical, null: false, foreign_key: { on_delete: :cascade }
      t.boolean :is_primary, default: false
    end

    # Unique index thay cho composite primary key
    add_index :kanji_radicals, [:kanji_id, :radical_id], unique: true
  end
end

# db/migrate/XXXXXX_create_kanji_composition.rb
class CreateKanjiComposition < ActiveRecord::Migration[7.1]
  def change
    create_table :kanji_compositions do |t|
      t.references :parent_kanji, null: false, foreign_key: { to_table: :kanjis, on_delete: :cascade }
      t.references :component_kanji, null: false, foreign_key: { to_table: :kanjis, on_delete: :cascade }
    end

    add_index :kanji_compositions, [:parent_kanji_id, :component_kanji_id],
              unique: true, name: 'index_kanji_compositions_on_parent_and_component'
  end
end
```

### 4. Migration: Create Vocabularies Tables

```bash
rails generate migration CreateVocabularies
rails generate migration CreateKanjiVocabularies
```

```ruby
# db/migrate/XXXXXX_create_vocabularies.rb
class CreateVocabularies < ActiveRecord::Migration[7.1]
  def change
    create_table :vocabularies do |t|
      t.string :word, null: false
      t.text :reading_kana
      t.text :reading_romaji
      t.text :meaning_en
      t.text :meaning_vi

      # Audio URLs
      t.text :audio_mp3
      t.text :audio_ogg

      t.string :jlpt_level, limit: 2

      t.timestamps
    end

    add_index :vocabularies, :word
    add_index :vocabularies, :jlpt_level
  end
end

# db/migrate/XXXXXX_create_kanji_vocabularies.rb
class CreateKanjiVocabularies < ActiveRecord::Migration[7.1]
  def change
    create_table :kanji_vocabularies do |t|
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }
      t.references :vocabulary, null: false, foreign_key: { on_delete: :cascade }
    end

    add_index :kanji_vocabularies, [:kanji_id, :vocabulary_id], unique: true
  end
end
```

### 5. Migration: Create Learning Paths Tables

```bash
rails generate migration CreateLearningPaths
rails generate migration CreateLearningPathItems
```

```ruby
# db/migrate/XXXXXX_create_learning_paths.rb
class CreateLearningPaths < ActiveRecord::Migration[7.1]
  def change
    create_table :learning_paths do |t|
      t.text :name, null: false
      t.text :description
      t.string :jlpt_level, limit: 2
      t.integer :sequence
      t.integer :kanji_count
      t.text :estimated_duration

      t.timestamps
    end
  end
end

# db/migrate/XXXXXX_create_learning_path_items.rb
class CreateLearningPathItems < ActiveRecord::Migration[7.1]
  def change
    create_table :learning_path_items do |t|
      t.references :learning_path, null: false, foreign_key: { on_delete: :cascade }
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }
      t.integer :sequence
    end

    add_index :learning_path_items, [:learning_path_id, :kanji_id], unique: true
  end
end
```

### 6. Migration: Create Users Table

```bash
rails generate devise User
# Hoặc nếu dùng custom authentication:
rails generate migration CreateUsers
```

```ruby
# db/migrate/XXXXXX_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :username, limit: 50
      t.string :password_digest  # Nếu dùng has_secure_password
      t.text :full_name

      # Settings
      t.string :preferred_language, limit: 2, default: 'vi'

      # Stats (cached)
      t.integer :total_kanji_learned, default: 0
      t.integer :current_streak, default: 0
      t.integer :longest_streak, default: 0

      t.datetime :last_login
      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :username, unique: true
  end
end
```

### 7. Migration: Create User Progress Tables

```bash
rails generate migration CreateUserKanjiProgress
rails generate migration CreateUserVocabularyProgress
rails generate migration CreateUserFavorites
rails generate migration CreateUserLearningPaths
rails generate migration CreateUserDailyActivity
rails generate migration CreateUserAchievements
```

```ruby
# db/migrate/XXXXXX_create_user_kanji_progress.rb
class CreateUserKanjiProgress < ActiveRecord::Migration[7.1]
  def change
    create_table :user_kanji_progresses do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }

      t.string :status, limit: 20, default: 'learning'

      # SRS (Spaced Repetition System)
      t.integer :srs_level, default: 0
      t.datetime :next_review_date

      # Practice stats
      t.integer :times_reviewed, default: 0
      t.integer :times_correct, default: 0
      t.integer :times_incorrect, default: 0

      # Timestamps
      t.datetime :first_studied_at
      t.datetime :last_reviewed_at
      t.datetime :mastered_at
    end

    add_index :user_kanji_progresses, [:user_id, :kanji_id], unique: true
    add_index :user_kanji_progresses, [:user_id, :status]
    add_index :user_kanji_progresses, :next_review_date
  end
end

# db/migrate/XXXXXX_create_user_vocabulary_progress.rb
class CreateUserVocabularyProgress < ActiveRecord::Migration[7.1]
  def change
    create_table :user_vocabulary_progresses do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :vocabulary, null: false, foreign_key: { on_delete: :cascade }

      t.string :status, limit: 20, default: 'learning'
      t.integer :srs_level, default: 0
      t.datetime :next_review_date

      t.integer :times_reviewed, default: 0
      t.integer :times_correct, default: 0
      t.integer :times_incorrect, default: 0

      t.datetime :first_studied_at
      t.datetime :last_reviewed_at
      t.datetime :mastered_at
    end

    add_index :user_vocabulary_progresses, [:user_id, :vocabulary_id], unique: true
  end
end

# db/migrate/XXXXXX_create_user_favorites.rb
class CreateUserFavorites < ActiveRecord::Migration[7.1]
  def change
    create_table :user_favorites do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }

      t.datetime :created_at
    end

    add_index :user_favorites, [:user_id, :kanji_id], unique: true
  end
end

# db/migrate/XXXXXX_create_user_learning_paths.rb
class CreateUserLearningPaths < ActiveRecord::Migration[7.1]
  def change
    create_table :user_learning_paths do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :learning_path, null: false, foreign_key: { on_delete: :cascade }

      t.decimal :progress_percentage, precision: 5, scale: 2, default: 0.0
      t.datetime :started_at
      t.datetime :completed_at
    end

    add_index :user_learning_paths, [:user_id, :learning_path_id], unique: true
  end
end

# db/migrate/XXXXXX_create_user_daily_activity.rb
class CreateUserDailyActivity < ActiveRecord::Migration[7.1]
  def change
    create_table :user_daily_activities do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.date :activity_date, null: false

      t.integer :kanji_reviewed, default: 0
      t.integer :vocab_reviewed, default: 0
      t.integer :time_spent_minutes, default: 0
    end

    add_index :user_daily_activities, [:user_id, :activity_date], unique: true
  end
end

# db/migrate/XXXXXX_create_user_achievements.rb
class CreateUserAchievements < ActiveRecord::Migration[7.1]
  def change
    create_table :user_achievements do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.string :achievement_type, limit: 50
      t.datetime :unlocked_at
    end

    add_index :user_achievements, [:user_id, :achievement_type], unique: true
  end
end
```

### 8. Migration: Add Full-Text Search (MySQL FULLTEXT)

```bash
rails generate migration AddFulltextSearchToKanjis
rails generate migration AddFulltextSearchToVocabularies
```

```ruby
# db/migrate/XXXXXX_add_fulltext_search_to_kanjis.rb
class AddFulltextSearchToKanjis < ActiveRecord::Migration[7.1]
  def up
    # Thêm cột search_text để tối ưu full-text search
    add_column :kanjis, :search_text, :text

    # Tạo FULLTEXT index (chỉ hoạt động với InnoDB từ MySQL 5.6+)
    execute <<-SQL
      CREATE FULLTEXT INDEX idx_kanjis_fulltext
      ON kanjis(character, meaning_en, meaning_vi, search_text)
    SQL
  end

  def down
    execute "DROP INDEX idx_kanjis_fulltext ON kanjis"
    remove_column :kanjis, :search_text
  end
end

# db/migrate/XXXXXX_add_fulltext_search_to_vocabularies.rb
class AddFulltextSearchToVocabularies < ActiveRecord::Migration[7.1]
  def up
    execute <<-SQL
      CREATE FULLTEXT INDEX idx_vocabularies_fulltext
      ON vocabularies(word, reading_kana, meaning_en, meaning_vi)
    SQL
  end

  def down
    execute "DROP INDEX idx_vocabularies_fulltext ON vocabularies"
  end
end
```

### Run Migrations

```bash
rails db:migrate
```

---

## 🎯 Rails Models

### 1. Kanji Model

```ruby
# app/models/kanji.rb
class Kanji < ApplicationRecord
  # Associations
  has_many :kanji_radicals, dependent: :destroy
  has_many :radicals, through: :kanji_radicals

  has_many :kanji_vocabularies, dependent: :destroy
  has_many :vocabularies, through: :kanji_vocabularies

  # Composition graph relationships
  has_many :parent_compositions,
           class_name: 'KanjiComposition',
           foreign_key: 'component_kanji_id'
  has_many :parent_kanjis, through: :parent_compositions, source: :parent_kanji

  has_many :component_compositions,
           class_name: 'KanjiComposition',
           foreign_key: 'parent_kanji_id'
  has_many :component_kanjis, through: :component_compositions, source: :component_kanji

  # User relationships
  has_many :user_kanji_progresses, dependent: :destroy
  has_many :users, through: :user_kanji_progresses
  has_many :user_favorites, dependent: :destroy

  # Learning paths
  has_many :learning_path_items, dependent: :destroy
  has_many :learning_paths, through: :learning_path_items

  # Validations
  validates :character, presence: true, uniqueness: true, length: { is: 1 }
  validates :meaning_en, presence: true
  validates :jlpt_level, inclusion: { in: %w[N5 N4 N3 N2 N1], allow_nil: true }
  validates :grade, inclusion: { in: 1..6, allow_nil: true }

  # Callbacks
  before_save :update_search_text

  # Scopes
  scope :by_jlpt, ->(level) { where(jlpt_level: level) }
  scope :by_grade, ->(grade) { where(grade: grade) }
  scope :joyo, -> { where(joyo: true) }
  scope :with_stroke_count, ->(count) { where(stroke_count: count) }

  # Full-text search using MySQL MATCH AGAINST
  def self.search_fulltext(query)
    return all if query.blank?

    where(
      "MATCH(character, meaning_en, meaning_vi, search_text) AGAINST(? IN BOOLEAN MODE)",
      query
    )
  end

  # Advanced search
  def self.search_advanced(query: nil, jlpt_level: nil, grade: nil, stroke_range: nil)
    results = all
    results = results.search_fulltext(query) if query.present?
    results = results.by_jlpt(jlpt_level) if jlpt_level.present?
    results = results.by_grade(grade) if grade.present?
    results = results.where(stroke_count: stroke_range) if stroke_range.present?
    results
  end

  private

  def update_search_text
    # Combine all searchable text for fulltext index
    texts = []
    texts << onyomi&.join(' ')
    texts << onyomi_romaji&.join(' ')
    texts << kunyomi&.join(' ')
    texts << kunyomi_romaji&.join(' ')
    self.search_text = texts.compact.join(' ')
  end
end
```

### 2. Radical Model

```ruby
# app/models/radical.rb
class Radical < ApplicationRecord
  has_many :kanji_radicals, dependent: :destroy
  has_many :kanjis, through: :kanji_radicals

  validates :character, presence: true, uniqueness: true
end
```

### 3. Join Models

```ruby
# app/models/kanji_radical.rb
class KanjiRadical < ApplicationRecord
  belongs_to :kanji
  belongs_to :radical

  validates :kanji_id, uniqueness: { scope: :radical_id }
end

# app/models/kanji_composition.rb
class KanjiComposition < ApplicationRecord
  belongs_to :parent_kanji, class_name: 'Kanji'
  belongs_to :component_kanji, class_name: 'Kanji'

  validates :parent_kanji_id, uniqueness: { scope: :component_kanji_id }
end

# app/models/kanji_vocabulary.rb
class KanjiVocabulary < ApplicationRecord
  belongs_to :kanji
  belongs_to :vocabulary

  validates :kanji_id, uniqueness: { scope: :vocabulary_id }
end
```

### 4. Vocabulary Model

```ruby
# app/models/vocabulary.rb
class Vocabulary < ApplicationRecord
  has_many :kanji_vocabularies, dependent: :destroy
  has_many :kanjis, through: :kanji_vocabularies

  has_many :user_vocabulary_progresses, dependent: :destroy

  validates :word, presence: true
  validates :jlpt_level, inclusion: { in: %w[N5 N4 N3 N2 N1], allow_nil: true }

  scope :by_jlpt, ->(level) { where(jlpt_level: level) }

  # Full-text search
  def self.search_fulltext(query)
    return all if query.blank?

    where(
      "MATCH(word, reading_kana, meaning_en, meaning_vi) AGAINST(? IN BOOLEAN MODE)",
      query
    )
  end
end
```

### 5. Learning Path Models

```ruby
# app/models/learning_path.rb
class LearningPath < ApplicationRecord
  has_many :learning_path_items, -> { order(:sequence) }, dependent: :destroy
  has_many :kanjis, through: :learning_path_items

  has_many :user_learning_paths, dependent: :destroy
  has_many :users, through: :user_learning_paths

  validates :name, presence: true
  validates :jlpt_level, inclusion: { in: %w[N5 N4 N3 N2 N1], allow_nil: true }

  scope :ordered, -> { order(:sequence) }
end

# app/models/learning_path_item.rb
class LearningPathItem < ApplicationRecord
  belongs_to :learning_path
  belongs_to :kanji

  validates :learning_path_id, uniqueness: { scope: :kanji_id }

  default_scope { order(:sequence) }
end
```

### 6. User Model

```ruby
# app/models/user.rb
class User < ApplicationRecord
  # Authentication (choose one)
  has_secure_password  # For BCrypt
  # devise :database_authenticatable, :registerable, :jwt_authenticatable  # For Devise + JWT

  # Associations
  has_many :user_kanji_progresses, dependent: :destroy
  has_many :studied_kanjis, through: :user_kanji_progresses, source: :kanji

  has_many :user_vocabulary_progresses, dependent: :destroy
  has_many :studied_vocabularies, through: :user_vocabulary_progresses, source: :vocabulary

  has_many :user_favorites, dependent: :destroy
  has_many :favorite_kanjis, through: :user_favorites, source: :kanji

  has_many :user_learning_paths, dependent: :destroy
  has_many :learning_paths, through: :user_learning_paths

  has_many :user_daily_activities, dependent: :destroy
  has_many :user_achievements, dependent: :destroy

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :username, uniqueness: true, allow_nil: true
  validates :preferred_language, inclusion: { in: %w[vi en] }

  # Callbacks
  after_create :initialize_stats

  # Record daily activity
  def record_daily_activity!(kanji_reviewed: 0, vocab_reviewed: 0, time_spent_minutes: 0)
    activity = user_daily_activities.find_or_initialize_by(activity_date: Date.current)
    activity.kanji_reviewed += kanji_reviewed
    activity.vocab_reviewed += vocab_reviewed
    activity.time_spent_minutes += time_spent_minutes
    activity.save!

    update_streak!
  end

  private

  def initialize_stats
    update(
      total_kanji_learned: 0,
      current_streak: 0,
      longest_streak: 0
    )
  end

  def update_streak!
    yesterday = user_daily_activities.find_by(activity_date: Date.yesterday)

    if yesterday
      increment!(:current_streak)
    else
      update!(current_streak: 1)
    end

    update!(longest_streak: current_streak) if current_streak > longest_streak
  end
end
```

### 7. User Progress Models

```ruby
# app/models/user_kanji_progress.rb
class UserKanjiProgress < ApplicationRecord
  belongs_to :user
  belongs_to :kanji

  # SRS level intervals (in hours)
  SRS_INTERVALS = [
    4,    # Level 0 -> 1: 4 hours
    8,    # Level 1 -> 2: 8 hours
    24,   # Level 2 -> 3: 1 day
    72,   # Level 3 -> 4: 3 days
    168,  # Level 4 -> 5: 1 week
    336,  # Level 5 -> 6: 2 weeks
    720,  # Level 6 -> 7: 1 month
    2160  # Level 7 -> 8: 3 months
  ].freeze

  validates :user_id, uniqueness: { scope: :kanji_id }
  validates :status, inclusion: { in: %w[learning practicing mastered] }
  validates :srs_level, inclusion: { in: 0..8 }

  scope :due_for_review, -> { where('next_review_date <= ?', Time.current) }
  scope :by_status, ->(status) { where(status: status) }

  # Update progress after review
  def record_review!(is_correct:, time_spent: 0)
    self.times_reviewed += 1
    self.last_reviewed_at = Time.current

    if is_correct
      self.times_correct += 1
      level_up!
    else
      self.times_incorrect += 1
      level_down!
    end

    update_status!
    save!

    # Record daily activity
    user.record_daily_activity!(kanji_reviewed: 1, time_spent_minutes: time_spent)

    self
  end

  private

  def level_up!
    return if srs_level >= 8

    self.srs_level += 1
    self.next_review_date = Time.current + SRS_INTERVALS[srs_level].hours
  end

  def level_down!
    self.srs_level = [srs_level - 1, 0].max
    self.next_review_date = Time.current + SRS_INTERVALS[srs_level].hours
  end

  def update_status!
    self.status = case srs_level
                  when 0..2 then 'learning'
                  when 3..6 then 'practicing'
                  when 7..8
                    self.mastered_at = Time.current unless mastered_at
                    'mastered'
                  end
  end
end

# app/models/user_vocabulary_progress.rb
class UserVocabularyProgress < ApplicationRecord
  belongs_to :user
  belongs_to :vocabulary

  validates :user_id, uniqueness: { scope: :vocabulary_id }
  validates :status, inclusion: { in: %w[learning practicing mastered] }
  validates :srs_level, inclusion: { in: 0..8 }

  # Similar implementation as UserKanjiProgress
end

# app/models/user_favorite.rb
class UserFavorite < ApplicationRecord
  belongs_to :user
  belongs_to :kanji

  validates :user_id, uniqueness: { scope: :kanji_id }
end

# app/models/user_learning_path.rb
class UserLearningPath < ApplicationRecord
  belongs_to :user
  belongs_to :learning_path

  validates :user_id, uniqueness: { scope: :learning_path_id }

  def update_progress!
    total_kanjis = learning_path.kanjis.count
    completed_kanjis = user.user_kanji_progresses
                           .where(kanji_id: learning_path.kanji_ids)
                           .where(status: 'mastered')
                           .count

    self.progress_percentage = (completed_kanjis.to_f / total_kanjis * 100).round(2)
    self.completed_at = Time.current if progress_percentage >= 100.0
    save!
  end
end

# app/models/user_daily_activity.rb
class UserDailyActivity < ApplicationRecord
  belongs_to :user

  validates :activity_date, presence: true
  validates :user_id, uniqueness: { scope: :activity_date }
end

# app/models/user_achievement.rb
class UserAchievement < ApplicationRecord
  belongs_to :user

  validates :achievement_type, uniqueness: { scope: :user_id }

  # Achievement types
  ACHIEVEMENTS = {
    'streak_7' => 'Học 7 ngày liên tiếp',
    'streak_30' => 'Học 30 ngày liên tiếp',
    'streak_100' => 'Học 100 ngày liên tiếp',
    'kanji_50' => 'Hoàn thành 50 kanji',
    'kanji_100' => 'Hoàn thành 100 kanji',
    'kanji_500' => 'Hoàn thành 500 kanji',
    'kanji_1000' => 'Hoàn thành 1000 kanji',
    'n5_complete' => 'Hoàn thành JLPT N5',
    'n4_complete' => 'Hoàn thành JLPT N4',
    'n3_complete' => 'Hoàn thành JLPT N3',
    'n2_complete' => 'Hoàn thành JLPT N2',
    'n1_complete' => 'Hoàn thành JLPT N1'
  }.freeze
end
```

---

## 🌱 Seed Data - Import từ JSON

```ruby
# db/seeds.rb
require 'json'

puts "🌱 Starting seed process..."

# 1. Import Radicals
puts "\n📍 Importing radicals..."
radicals_file = File.read(Rails.root.join('data', 'radicallist.json'))
radicals_data = JSON.parse(radicals_file)

radicals_data.each do |radical_data|
  Radical.find_or_create_by!(character: radical_data['radical']) do |radical|
    radical.name_en = radical_data['meaning']
    radical.stroke_count = radical_data['strokes']
    radical.position = radical_data['position']
    radical.image_url = radical_data['image']
    radical.animation_urls = radical_data['animations'] || []
  end
end

puts "✅ Imported #{Radical.count} radicals"

# 2. Import Kanjis
puts "\n📍 Importing kanjis..."
kanji_dir = Rails.root.join('data', 'kanji')
kanji_files = Dir.glob("#{kanji_dir}/*.json")

kanji_files.each_with_index do |file_path, index|
  kanji_data = JSON.parse(File.read(file_path))

  # Extract jisho data
  jisho = kanji_data['jishoData'] || {}
  kanjialive = kanji_data['kanjialiveData'] || {}

  kanji = Kanji.find_or_create_by!(character: kanji_data['id']) do |k|
    k.meaning_en = jisho['meaning'] || ''
    k.meaning_vi = jisho['meaning_vi']

    k.onyomi = jisho['onyomi'] || []
    k.onyomi_romaji = jisho['onyomi_romaji'] || []
    k.kunyomi = jisho['kunyomi'] || []
    k.kunyomi_romaji = jisho['kunyomi_romaji'] || []

    k.grade = jisho['taughtIn']
    k.jlpt_level = jisho['jlptLevel']&.gsub('JLPT ', '')
    k.stroke_count = jisho['strokeCount'] || kanjialive['stroke_count']
    k.newspaper_freq_rank = jisho['newspaperFrequencyRank']

    k.stroke_diagram_url = kanjialive['stroke_diagram_url']
    k.video_url = jisho['videoUrl']
  end

  # Import vocabularies from examples
  if jisho['examples'].present?
    jisho['examples'].each do |example|
      vocab = Vocabulary.find_or_create_by!(word: example['japanese']) do |v|
        v.reading_kana = example['reading']
        v.meaning_en = example['meaning']
        v.audio_mp3 = example['audio_mp3']
        v.audio_ogg = example['audio_ogg']
      end

      # Link kanji to vocabulary
      KanjiVocabulary.find_or_create_by!(kanji: kanji, vocabulary: vocab)
    end
  end

  # Link radicals to kanji
  if kanjialive['radical'].present?
    radical = Radical.find_by(character: kanjialive['radical'])
    if radical
      KanjiRadical.find_or_create_by!(
        kanji: kanji,
        radical: radical,
        is_primary: true
      )
    end
  end

  print "\r#{index + 1}/#{kanji_files.count} kanjis imported..." if (index + 1) % 10 == 0
end

puts "\n✅ Imported #{Kanji.count} kanjis"

# 3. Import Composition Graph
puts "\n📍 Importing composition graph..."
composition_file = File.read(Rails.root.join('data', 'composition.json'))
composition_data = JSON.parse(composition_file)

composition_data.each do |parent_char, components|
  parent_kanji = Kanji.find_by(character: parent_char)
  next unless parent_kanji

  components.each do |component_char|
    component_kanji = Kanji.find_by(character: component_char)
    next unless component_kanji

    KanjiComposition.find_or_create_by!(
      parent_kanji: parent_kanji,
      component_kanji: component_kanji
    )
  end
end

puts "✅ Imported composition relationships"

# 4. Create Learning Paths
puts "\n📍 Creating learning paths..."

learning_paths_data = [
  { name: 'Kanji Sơ Cấp N5', jlpt_level: 'N5', sequence: 1, description: 'Học 80 kanji cơ bản JLPT N5', estimated_duration: '1-2 tháng' },
  { name: 'Kanji Sơ Trung Cấp N4', jlpt_level: 'N4', sequence: 2, description: 'Học 170 kanji JLPT N4', estimated_duration: '2-3 tháng' },
  { name: 'Kanji Trung Cấp N3', jlpt_level: 'N3', sequence: 3, description: 'Học 370 kanji JLPT N3', estimated_duration: '3-4 tháng' },
  { name: 'Kanji Trung Cao Cấp N2', jlpt_level: 'N2', sequence: 4, description: 'Học 415 kanji JLPT N2', estimated_duration: '4-6 tháng' },
  { name: 'Kanji Cao Cấp N1', jlpt_level: 'N1', sequence: 5, description: 'Học 1165 kanji JLPT N1', estimated_duration: '6-12 tháng' }
]

learning_paths_data.each do |path_data|
  learning_path = LearningPath.find_or_create_by!(
    name: path_data[:name],
    jlpt_level: path_data[:jlpt_level]
  ) do |lp|
    lp.sequence = path_data[:sequence]
    lp.description = path_data[:description]
    lp.estimated_duration = path_data[:estimated_duration]
  end

  # Add kanjis to path
  kanjis = Kanji.where(jlpt_level: path_data[:jlpt_level]).order(:character)
  learning_path.update!(kanji_count: kanjis.count)

  kanjis.each_with_index do |kanji, index|
    LearningPathItem.find_or_create_by!(
      learning_path: learning_path,
      kanji: kanji,
      sequence: index + 1
    )
  end
end

puts "✅ Created #{LearningPath.count} learning paths"

puts "\n🎉 Seed completed!"
puts "📊 Summary:"
puts "  - Kanjis: #{Kanji.count}"
puts "  - Radicals: #{Radical.count}"
puts "  - Vocabularies: #{Vocabulary.count}"
puts "  - Learning Paths: #{LearningPath.count}"
```

**Run seed:**

```bash
rails db:seed
```

---

## 📖 MySQL-Specific Notes

### 1. JSON Columns vs Serialize

MySQL 5.7+ hỗ trợ JSON datatype native. Bạn có 2 options:

**Option 1: Dùng JSON column (recommended)**

```ruby
# Migration
t.json :onyomi

# Model - không cần serialize, Rails tự động handle
kanji.onyomi = ['イチ', 'イツ']
kanji.save
```

**Option 2: Dùng serialize với TEXT column**

```ruby
# Migration
t.text :onyomi

# Model
class Kanji < ApplicationRecord
  serialize :onyomi, Array
  serialize :onyomi_romaji, Array
  serialize :kunyomi, Array
  serialize :kunyomi_romaji, Array
end
```

### 2. Full-Text Search với MySQL

MySQL FULLTEXT search yêu cầu:

- InnoDB engine (MySQL 5.6+) hoặc MyISAM
- Minimum word length (default: 3-4 chars)
- Boolean mode cho wildcard search

```ruby
# Search với wildcard
Kanji.where(
  "MATCH(character, meaning_en, meaning_vi) AGAINST(? IN BOOLEAN MODE)",
  "*#{query}*"
)
```

### 3. Composite Primary Keys

MySQL không hỗ trợ composite primary keys tốt như PostgreSQL. Workaround:

```ruby
# Thay vì
create_table :kanji_radicals, primary_key: [:kanji_id, :radical_id]

# Dùng
create_table :kanji_radicals do |t|
  # Auto-generated id column
  t.references :kanji
  t.references :radical
end
add_index :kanji_radicals, [:kanji_id, :radical_id], unique: true
```

---

## 📖 Next Steps

1. **Setup Routes & Controllers** - Tạo API endpoints theo API_DESIGN.md
2. **Add Serializers** - Format JSON responses
3. **Implement Authentication** - JWT hoặc Devise
4. **Add Tests** - RSpec hoặc Minitest
5. **Deploy** - Heroku, Railway, hoặc AWS

---

Tài liệu này cung cấp đầy đủ migrations, models, và seed script cho MySQL để bắt đầu xây dựng backend Rails cho Luyenkanji! 🚀
