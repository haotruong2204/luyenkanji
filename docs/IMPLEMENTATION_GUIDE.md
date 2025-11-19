# Implementation Guide - Luyenkanji Backend

## 🎯 Tech Stack Đề xuất

### Backend:

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL 14+
- **ORM:** Prisma hoặc TypeORM
- **Authentication:** JWT + Passport
- **Caching:** Redis
- **File Storage:** AWS S3 hoặc Cloudinary (cho audio files)

### Deployment:

- **API:** Railway / Vercel / AWS
- **Database:** Supabase / Railway / AWS RDS
- **Redis:** Upstash / Railway

---

## 📁 Project Structure

```
luyenkanji-api/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       └── login.dto.ts
│   │
│   ├── kanjis/
│   │   ├── kanjis.controller.ts
│   │   ├── kanjis.service.ts
│   │   ├── kanjis.repository.ts
│   │   └── dto/
│   │       ├── get-kanjis.dto.ts
│   │       └── search-kanjis.dto.ts
│   │
│   ├── vocabularies/
│   │   ├── vocabularies.controller.ts
│   │   ├── vocabularies.service.ts
│   │   └── vocabularies.repository.ts
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── update-profile.dto.ts
│   │
│   ├── progress/
│   │   ├── progress.controller.ts
│   │   ├── progress.service.ts
│   │   └── dto/
│   │       └── update-progress.dto.ts
│   │
│   ├── learning-paths/
│   │   ├── learning-paths.controller.ts
│   │   └── learning-paths.service.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── filters/
│   │
│   ├── config/
│   │   └── configuration.ts
│   │
│   └── main.ts
│
├── scripts/
│   ├── migrate-data.ts           # Import JSON data to DB
│   └── create-learning-paths.ts  # Create default paths
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🗄️ Step 1: Setup Database (Prisma)

### Install Prisma

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Kanji {
  id                  Int       @id @default(autoincrement())
  character           String    @unique @db.VarChar(1)

  meaningEn           String
  meaningVi           String?

  onyomi              String[]
  onyomiRomaji        String[]
  kunyomi             String[]
  kunyomiRomaji       String[]

  grade               Int?
  jlptLevel           String?   @db.VarChar(2)
  joyo                Boolean   @default(false)
  jinmeiyo            Boolean   @default(false)

  newspaperFreqRank   Int?
  strokeCount         Int
  strokeTimings       Decimal[]

  strokeDiagramUrl    String?
  videoUrl            String?

  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  // Relations
  radicals            KanjiRadical[]
  vocabularies        KanjiVocabulary[]
  parentsComposition  KanjiComposition[] @relation("ParentKanji")
  componentsOf        KanjiComposition[] @relation("ComponentKanji")
  userProgress        UserKanjiProgress[]
  userFavorites       UserFavorite[]
  pathItems           LearningPathItem[]

  @@index([character])
  @@index([jlptLevel])
  @@index([grade])
}

model Radical {
  id             Int       @id @default(autoincrement())
  character      String    @unique @db.VarChar(2)
  nameJa         String?
  nameEn         String?
  nameRomaji     String?
  meaning        String?
  strokeCount    Int
  position       String?
  imageUrl       String?
  animationUrls  String[]

  createdAt      DateTime  @default(now())

  kanjis         KanjiRadical[]

  @@index([character])
}

model KanjiRadical {
  kanjiId    Int
  radicalId  Int
  isPrimary  Boolean  @default(false)

  kanji      Kanji    @relation(fields: [kanjiId], references: [id], onDelete: Cascade)
  radical    Radical  @relation(fields: [radicalId], references: [id], onDelete: Cascade)

  @@id([kanjiId, radicalId])
}

model KanjiComposition {
  parentKanjiId     Int
  componentKanjiId  Int

  parent            Kanji @relation("ParentKanji", fields: [parentKanjiId], references: [id], onDelete: Cascade)
  component         Kanji @relation("ComponentKanji", fields: [componentKanjiId], references: [id], onDelete: Cascade)

  @@id([parentKanjiId, componentKanjiId])
}

model Vocabulary {
  id            Int       @id @default(autoincrement())
  word          String
  readingKana   String?
  readingRomaji String?
  meaningEn     String?
  meaningVi     String?

  audioMp3      String?
  audioOgg      String?

  jlptLevel     String?   @db.VarChar(2)

  createdAt     DateTime  @default(now())

  kanjis        KanjiVocabulary[]
  userProgress  UserVocabularyProgress[]

  @@index([word])
  @@index([jlptLevel])
}

model KanjiVocabulary {
  kanjiId       Int
  vocabularyId  Int

  kanji         Kanji      @relation(fields: [kanjiId], references: [id], onDelete: Cascade)
  vocabulary    Vocabulary @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)

  @@id([kanjiId, vocabularyId])
}

model LearningPath {
  id                 Int       @id @default(autoincrement())
  name               String
  description        String?
  jlptLevel          String?   @db.VarChar(2)
  sequence           Int
  kanjiCount         Int       @default(0)
  estimatedDuration  String?

  createdAt          DateTime  @default(now())

  items              LearningPathItem[]
  userPaths          UserLearningPath[]
}

model LearningPathItem {
  id        Int      @id @default(autoincrement())
  pathId    Int
  kanjiId   Int
  sequence  Int

  path      LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)
  kanji     Kanji        @relation(fields: [kanjiId], references: [id], onDelete: Cascade)

  @@unique([pathId, kanjiId])
}

model User {
  id                  Int       @id @default(autoincrement())
  email               String?   @unique
  username            String?   @unique
  passwordHash        String?
  fullName            String?

  preferredLanguage   String    @default("vi") @db.VarChar(2)

  totalKanjiLearned   Int       @default(0)
  currentStreak       Int       @default(0)
  longestStreak       Int       @default(0)

  createdAt           DateTime  @default(now())
  lastLogin           DateTime?
  updatedAt           DateTime  @updatedAt

  kanjiProgress       UserKanjiProgress[]
  vocabProgress       UserVocabularyProgress[]
  favorites           UserFavorite[]
  learningPaths       UserLearningPath[]
  dailyActivity       UserDailyActivity[]
  achievements        UserAchievement[]

  @@index([email])
  @@index([username])
}

model UserKanjiProgress {
  userId           Int
  kanjiId          Int

  status           String    @default("learning") @db.VarChar(20)
  srsLevel         Int       @default(0)
  nextReviewDate   DateTime?

  timesReviewed    Int       @default(0)
  timesCorrect     Int       @default(0)
  timesIncorrect   Int       @default(0)

  firstStudiedAt   DateTime  @default(now())
  lastReviewedAt   DateTime?
  masteredAt       DateTime?

  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  kanji            Kanji     @relation(fields: [kanjiId], references: [id], onDelete: Cascade)

  @@id([userId, kanjiId])
  @@index([userId, status])
  @@index([nextReviewDate])
}

model UserVocabularyProgress {
  userId           Int
  vocabularyId     Int

  status           String    @default("learning") @db.VarChar(20)
  srsLevel         Int       @default(0)
  nextReviewDate   DateTime?

  timesReviewed    Int       @default(0)
  timesCorrect     Int       @default(0)
  timesIncorrect   Int       @default(0)

  firstStudiedAt   DateTime  @default(now())
  lastReviewedAt   DateTime?
  masteredAt       DateTime?

  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  vocabulary       Vocabulary   @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)

  @@id([userId, vocabularyId])
}

model UserFavorite {
  userId     Int
  kanjiId    Int
  createdAt  DateTime  @default(now())

  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  kanji      Kanji     @relation(fields: [kanjiId], references: [id], onDelete: Cascade)

  @@id([userId, kanjiId])
}

model UserLearningPath {
  userId             Int
  pathId             Int
  progressPercentage Decimal   @default(0.00) @db.Decimal(5, 2)
  startedAt          DateTime  @default(now())
  completedAt        DateTime?

  user               User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  path               LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)

  @@id([userId, pathId])
}

model UserDailyActivity {
  userId           Int
  activityDate     DateTime  @db.Date
  kanjiReviewed    Int       @default(0)
  vocabReviewed    Int       @default(0)
  timeSpentMinutes Int       @default(0)

  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, activityDate])
  @@index([userId, activityDate(sort: Desc)])
}

model UserAchievement {
  id              Int      @id @default(autoincrement())
  userId          Int
  achievementType String   @db.VarChar(50)
  unlockedAt      DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementType])
}
```

### Run Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 📥 Step 2: Data Migration Script

### `scripts/migrate-data.ts`

```typescript
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function migrateKanjis() {
  console.log("🔄 Migrating kanjis...");

  const kanjiDir = path.join(__dirname, "../data/kanji");
  const files = fs.readdirSync(kanjiDir);

  let count = 0;

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(kanjiDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const kanji = await prisma.kanji.create({
      data: {
        character: data.id,
        meaningEn:
          data.jishoData?.meaning || data.kanjialiveData?.meaning || "",
        meaningVi: "", // TODO: Add Vietnamese translations

        onyomi: data.jishoData?.onyomi || [],
        onyomiRomaji: data.kanjialiveData?.onyomi_search || [],
        kunyomi: data.jishoData?.kunyomi || [],
        kunyomiRomaji: data.kanjialiveData?.kunyomi_search || [],

        grade: data.kanjialiveData?.grade,
        jlptLevel: data.jishoData?.jlptLevel?.replace("JLPT ", ""),

        newspaperFreqRank: data.jishoData?.newspaperFrequencyRank
          ? parseInt(data.jishoData.newspaperFrequencyRank)
          : null,

        strokeCount:
          data.jishoData?.strokeCount || data.kanjialiveData?.kstroke || 0,
        strokeTimings: data.kanjialiveData?.stroketimes || [],

        strokeDiagramUrl: data.jishoData?.strokeOrderSvgUri,
        videoUrl: data.kanjialiveData?.kanji?.video?.mp4,
      },
    });

    count++;
    if (count % 100 === 0) {
      console.log(`  Migrated ${count} kanjis...`);
    }
  }

  console.log(`✅ Migrated ${count} kanjis`);
}

async function migrateComposition() {
  console.log("🔄 Migrating composition graph...");

  const compositionPath = path.join(__dirname, "../data/composition.json");
  const composition = JSON.parse(fs.readFileSync(compositionPath, "utf-8"));

  let count = 0;

  for (const [parentChar, data] of Object.entries(composition)) {
    const parent = await prisma.kanji.findUnique({
      where: { character: parentChar },
    });

    if (!parent) continue;

    const components = data.in || [];

    for (const componentChar of components) {
      const component = await prisma.kanji.findUnique({
        where: { character: componentChar },
      });

      if (!component) continue;

      await prisma.kanjiComposition
        .create({
          data: {
            parentKanjiId: parent.id,
            componentKanjiId: component.id,
          },
        })
        .catch(() => {}); // Ignore duplicates

      count++;
    }
  }

  console.log(`✅ Migrated ${count} composition relationships`);
}

async function migrateVocabularies() {
  console.log("🔄 Migrating vocabularies from kanji examples...");

  const kanjiDir = path.join(__dirname, "../data/kanji");
  const files = fs.readdirSync(kanjiDir);

  let count = 0;

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(kanjiDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const kanji = await prisma.kanji.findUnique({
      where: { character: data.id },
    });

    if (!kanji) continue;

    const examples = data.kanjialiveData?.examples || [];

    for (const example of examples) {
      const vocab = await prisma.vocabulary.upsert({
        where: {
          word_readingKana: {
            word: example.japanese.split("（")[0],
            readingKana: example.japanese.match(/（(.+)）/)?.[1] || "",
          },
        },
        update: {},
        create: {
          word: example.japanese.split("（")[0],
          readingKana: example.japanese.match(/（(.+)）/)?.[1],
          meaningEn: example.meaning?.english,
          audioMp3: example.audio?.mp3,
          audioOgg: example.audio?.ogg,
          jlptLevel: kanji.jlptLevel,
        },
      });

      await prisma.kanjiVocabulary
        .create({
          data: {
            kanjiId: kanji.id,
            vocabularyId: vocab.id,
          },
        })
        .catch(() => {}); // Ignore duplicates

      count++;
    }
  }

  console.log(`✅ Migrated ${count} vocabularies`);
}

async function createLearningPaths() {
  console.log("🔄 Creating learning paths...");

  const paths = [
    {
      name: "Kanji Sơ Cấp",
      description: "Nền tảng cho người mới bắt đầu",
      jlptLevel: "N5",
      sequence: 1,
      estimatedDuration: "2-3 tháng",
    },
    {
      name: "Kanji Sơ Trung Cấp",
      description: "Nâng cao kiến thức cơ bản",
      jlptLevel: "N4",
      sequence: 2,
      estimatedDuration: "3-4 tháng",
    },
    {
      name: "Kanji Trung Cấp",
      description: "Phát triển kỹ năng trung cấp",
      jlptLevel: "N3",
      sequence: 3,
      estimatedDuration: "4-6 tháng",
    },
    {
      name: "Kanji Trung Cao Cấp",
      description: "Chuẩn bị cho trình độ cao",
      jlptLevel: "N2",
      sequence: 4,
      estimatedDuration: "6-8 tháng",
    },
    {
      name: "Kanji Cao Cấp",
      description: "Làm chủ kanji nâng cao",
      jlptLevel: "N1",
      sequence: 5,
      estimatedDuration: "8-12 tháng",
    },
  ];

  for (const pathData of paths) {
    const path = await prisma.learningPath.create({
      data: pathData,
    });

    const kanjis = await prisma.kanji.findMany({
      where: { jlptLevel: pathData.jlptLevel },
      orderBy: { strokeCount: "asc" },
    });

    let sequence = 1;
    for (const kanji of kanjis) {
      await prisma.learningPathItem.create({
        data: {
          pathId: path.id,
          kanjiId: kanji.id,
          sequence: sequence++,
        },
      });
    }

    await prisma.learningPath.update({
      where: { id: path.id },
      data: { kanjiCount: kanjis.length },
    });

    console.log(`  Created path: ${path.name} (${kanjis.length} kanjis)`);
  }

  console.log(`✅ Created learning paths`);
}

async function main() {
  console.log("🚀 Starting data migration...\n");

  await migrateKanjis();
  await migrateComposition();
  await migrateVocabularies();
  await createLearningPaths();

  console.log("\n✅ Data migration completed!");
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run Migration

```bash
npm run migrate-data
```

---

## 🔐 Step 3: Authentication Setup

### `src/auth/auth.service.ts`

```typescript
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string, username: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    const token = this.jwtService.sign({ userId: user.id });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = this.jwtService.sign({ userId: user.id });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
```

---

## 🚀 Step 4: Deploy

### Railway Deploy

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your-super-secret-key-change-this"
REDIS_URL="redis://..."
PORT=3000
```

---

## 📝 Next Steps

1. ✅ Setup database schema
2. ✅ Migrate data from JSON files
3. ✅ Implement authentication
4. 🔄 Implement kanji APIs
5. 🔄 Implement progress tracking
6. 🔄 Implement SRS algorithm
7. 🔄 Add caching with Redis
8. 🔄 Deploy to production

**Estimated Time:** 2-3 weeks for complete implementation

---

**Ready to start implementation!** 🎉
