# Rails Implementation Guide - Luyenkanji API

Hướng dẫn chi tiết để xây dựng backend API cho Luyenkanji bằng Ruby on Rails.

## 📋 Tech Stack

- **Ruby on Rails** >= 7.1
- **PostgreSQL** >= 14
- **Ruby** >= 3.2
- **Gems chính:**
  - `devise` hoặc `jwt` - Authentication
  - `pg` - PostgreSQL adapter
  - `pg_search` - Full-text search
  - `rack-cors` - CORS support
  - `active_model_serializers` hoặc `jsonapi-serializer` - JSON serialization
  - `kaminari` hoặc `pagy` - Pagination

---

## 🚀 Setup Project

```bash
# Tạo Rails API app mới
rails new luyenkanji_api --api --database=postgresql

cd luyenkanji_api

# Thêm gems vào Gemfile
bundle add devise-jwt
bundle add pg_search
bundle add rack-cors
bundle add jsonapi-serializer
bundle add kaminari

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
      t.string :character, limit: 1, null: false, index: { unique: true }

      # Basic info
      t.text :meaning_en, null: false
      t.text :meaning_vi

      # Readings (use array type)
      t.text :onyomi, array: true, default: []
      t.text :onyomi_romaji, array: true, default: []
      t.text :kunyomi, array: true, default: []
      t.text :kunyomi_romaji, array: true, default: []

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
      t.decimal :stroke_timings, array: true, default: []

      # URLs
      t.text :stroke_diagram_url
      t.text :video_url

      t.timestamps
    end

    # Indexes
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
      t.string :character, limit: 2, null: false, index: { unique: true }
      t.text :name_ja
      t.text :name_en
      t.text :name_romaji
      t.text :meaning
      t.integer :stroke_count
      t.text :position
      t.text :image_url
      t.text :animation_urls, array: true, default: []

      t.timestamps
    end
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
    create_table :kanji_radicals, primary_key: [:kanji_id, :radical_id] do |t|
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }
      t.references :radical, null: false, foreign_key: { on_delete: :cascade }
      t.boolean :is_primary, default: false
    end
  end
end

# db/migrate/XXXXXX_create_kanji_composition.rb
class CreateKanjiComposition < ActiveRecord::Migration[7.1]
  def change
    create_table :kanji_compositions, primary_key: [:parent_kanji_id, :component_kanji_id] do |t|
      t.references :parent_kanji, null: false, foreign_key: { to_table: :kanjis, on_delete: :cascade }
      t.references :component_kanji, null: false, foreign_key: { to_table: :kanjis, on_delete: :cascade }
    end
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
      t.text :word, null: false
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
    create_table :kanji_vocabularies, primary_key: [:kanji_id, :vocabulary_id] do |t|
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }
      t.references :vocabulary, null: false, foreign_key: { on_delete: :cascade }
    end
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
      t.string :email, index: { unique: true }
      t.string :username, limit: 50, index: { unique: true }
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
    create_table :user_kanji_progresses, primary_key: [:user_id, :kanji_id] do |t|
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

    add_index :user_kanji_progresses, [:user_id, :status]
    add_index :user_kanji_progresses, :next_review_date
  end
end

# db/migrate/XXXXXX_create_user_vocabulary_progress.rb
class CreateUserVocabularyProgress < ActiveRecord::Migration[7.1]
  def change
    create_table :user_vocabulary_progresses, primary_key: [:user_id, :vocabulary_id] do |t|
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
  end
end

# db/migrate/XXXXXX_create_user_favorites.rb
class CreateUserFavorites < ActiveRecord::Migration[7.1]
  def change
    create_table :user_favorites, primary_key: [:user_id, :kanji_id] do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :kanji, null: false, foreign_key: { on_delete: :cascade }

      t.datetime :created_at
    end
  end
end

# db/migrate/XXXXXX_create_user_learning_paths.rb
class CreateUserLearningPaths < ActiveRecord::Migration[7.1]
  def change
    create_table :user_learning_paths, primary_key: [:user_id, :learning_path_id] do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :learning_path, null: false, foreign_key: { on_delete: :cascade }

      t.decimal :progress_percentage, precision: 5, scale: 2, default: 0.0
      t.datetime :started_at
      t.datetime :completed_at
    end
  end
end

# db/migrate/XXXXXX_create_user_daily_activity.rb
class CreateUserDailyActivity < ActiveRecord::Migration[7.1]
  def change
    create_table :user_daily_activities, primary_key: [:user_id, :activity_date] do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.date :activity_date, null: false

      t.integer :kanji_reviewed, default: 0
      t.integer :vocab_reviewed, default: 0
      t.integer :time_spent_minutes, default: 0
    end

    add_index :user_daily_activities, [:user_id, :activity_date], order: { activity_date: :desc }
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

### 8. Migration: Add Full-Text Search

```bash
rails generate migration AddSearchToKanjis
```

```ruby
# db/migrate/XXXXXX_add_search_to_kanjis.rb
class AddSearchToKanjis < ActiveRecord::Migration[7.1]
  def up
    # Add tsvector column
    add_column :kanjis, :search_vector, :tsvector

    # Create GIN index
    execute <<-SQL
      CREATE INDEX index_kanjis_on_search_vector
      ON kanjis USING GIN(search_vector);
    SQL

    # Create trigger to auto-update search_vector
    execute <<-SQL
      CREATE OR REPLACE FUNCTION kanjis_search_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          to_tsvector('simple', coalesce(NEW.character, '')) ||
          to_tsvector('simple', coalesce(NEW.meaning_en, '')) ||
          to_tsvector('simple', coalesce(NEW.meaning_vi, '')) ||
          to_tsvector('simple', coalesce(array_to_string(NEW.onyomi_romaji, ' '), '')) ||
          to_tsvector('simple', coalesce(array_to_string(NEW.kunyomi_romaji, ' '), ''));
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER tsvector_update_trigger
      BEFORE INSERT OR UPDATE ON kanjis
      FOR EACH ROW EXECUTE FUNCTION kanjis_search_trigger();
    SQL
  end

  def down
    execute "DROP TRIGGER IF EXISTS tsvector_update_trigger ON kanjis;"
    execute "DROP FUNCTION IF EXISTS kanjis_search_trigger();"
    remove_column :kanjis, :search_vector
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

  # Scopes
  scope :by_jlpt, ->(level) { where(jlpt_level: level) }
  scope :by_grade, ->(grade) { where(grade: grade) }
  scope :joyo, -> { where(joyo: true) }
  scope :with_stroke_count, ->(count) { where(stroke_count: count) }

  # Full-text search using pg_search
  include PgSearch::Model
  pg_search_scope :search_by_text,
    against: [:character, :meaning_en, :meaning_vi],
    associated_against: {
      radicals: [:name_en, :meaning]
    },
    using: {
      tsearch: {
        prefix: true,
        dictionary: 'simple'
      }
    }

  # Class methods
  def self.search_advanced(query:, jlpt_level: nil, grade: nil, stroke_range: nil)
    results = all
    results = results.search_by_text(query) if query.present?
    results = results.by_jlpt(jlpt_level) if jlpt_level.present?
    results = results.by_grade(grade) if grade.present?
    results = results.where(stroke_count: stroke_range) if stroke_range.present?
    results
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
  self.primary_key = [:kanji_id, :radical_id]

  belongs_to :kanji
  belongs_to :radical
end

# app/models/kanji_composition.rb
class KanjiComposition < ApplicationRecord
  self.primary_key = [:parent_kanji_id, :component_kanji_id]

  belongs_to :parent_kanji, class_name: 'Kanji'
  belongs_to :component_kanji, class_name: 'Kanji'
end

# app/models/kanji_vocabulary.rb
class KanjiVocabulary < ApplicationRecord
  self.primary_key = [:kanji_id, :vocabulary_id]

  belongs_to :kanji
  belongs_to :vocabulary
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
  # has_secure_password  # For BCrypt
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

  private

  def initialize_stats
    update(
      total_kanji_learned: 0,
      current_streak: 0,
      longest_streak: 0
    )
  end
end
```

### 7. User Progress Models

```ruby
# app/models/user_kanji_progress.rb
class UserKanjiProgress < ApplicationRecord
  self.primary_key = [:user_id, :kanji_id]

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
  self.primary_key = [:user_id, :vocabulary_id]

  belongs_to :user
  belongs_to :vocabulary

  validates :status, inclusion: { in: %w[learning practicing mastered] }
  validates :srs_level, inclusion: { in: 0..8 }

  # Similar implementation as UserKanjiProgress
end

# app/models/user_favorite.rb
class UserFavorite < ApplicationRecord
  self.primary_key = [:user_id, :kanji_id]

  belongs_to :user
  belongs_to :kanji
end

# app/models/user_learning_path.rb
class UserLearningPath < ApplicationRecord
  self.primary_key = [:user_id, :learning_path_id]

  belongs_to :user
  belongs_to :learning_path

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
  self.primary_key = [:user_id, :activity_date]

  belongs_to :user

  validates :activity_date, presence: true
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

## 📖 Next Steps

1. **Setup Routes & Controllers** - Tạo API endpoints theo API_DESIGN.md
2. **Add Serializers** - Format JSON responses
3. **Implement Authentication** - JWT hoặc Devise
4. **Add Tests** - RSpec hoặc Minitest
5. **Deploy** - Heroku, Railway, hoặc AWS

---

Tài liệu này cung cấp đầy đủ migrations, models, và seed script để bắt đầu xây dựng backend Rails cho Luyenkanji! 🚀
