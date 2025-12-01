# API Integration & Performance Optimization Guide

## 📋 Tổng quan

Dự án đã được tích hợp với Rails API backend, bao gồm rate limiting, caching, và server-side rendering để tối ưu cả SEO, performance và bảo mật data.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Request                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Next.js (SSR Mode)                      │
│  - Server-side rendering                             │
│  - Revalidate every 1 hour                          │
│  - Fallback to local files if API fails             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            Rails API (Protected)                     │
│  - Rate limiting (Rack::Attack)                     │
│  - Redis caching (1 hour)                           │
│  - Bot detection & blocking                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              MySQL Database                          │
│  - 6,603 kanjis                                     │
│  - 32,343 examples                                  │
│  - 6,226 textbook references                        │
└─────────────────────────────────────────────────────┘
```

---

## 🔒 Security & Rate Limiting

### Rate Limits (Rack::Attack)

| Endpoint Type | Limit | Period | Purpose |
|--------------|-------|---------|---------|
| All requests | 100 req | 1 minute | General protection |
| API endpoints | 60 req | 1 minute | API-specific limit |
| `/ui_format` | 30 req | 1 minute | Anti-scraping for main data |

### Bot Detection

**Blocked:**
- scrapy, crawler, spider, bot (generic)
- wget, curl (command-line tools)

**Allowed:**
- googlebot, bingbot, slurp, duckduckbot (legitimate crawlers)
- Luyenkanji-NextJS/1.0 (our own app)

### Response when rate limited:
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retry_after": 60
}
```

**HTTP Status:** `429 Too Many Requests`

---

## ⚡ Caching Strategy

### 1. Redis Cache (Server-side)

**Location:** Rails API
**Duration:** 1 hour
**Store:** Redis
**Key format:** `kanji_ui_format:{character}`

```ruby
# Automatic caching in controller
Rails.cache.fetch(cache_key, expires_in: 1.hour) do
  KanjiUiSerializer.new(@kanji).as_json
end
```

### 2. HTTP Cache Headers

```
Cache-Control: max-age=3600, public
```

- **CDN:** Can cache response for 1 hour
- **Browser:** Can cache response for 1 hour
- **Shared cache:** Allowed (public)

### 3. Next.js Revalidation

```typescript
fetch(url, {
  next: { revalidate: 3600 } // 1 hour
})
```

### Performance Metrics

| Scenario | Response Time | Improvement |
|----------|---------------|-------------|
| First request (no cache) | ~1.7s | Baseline |
| Cached request (Redis) | ~0.08s | **20x faster** |
| Browser cached | ~0.01s | **170x faster** |

---

## 🌐 API Endpoints

### Base URL
```
Development: http://localhost:3001/api/v1
Production: https://your-domain.com/api/v1
```

### Main Endpoint: Get Kanji Data (UI Format)

```http
GET /api/v1/kanjis/:id/ui_format
```

**Response Format:**
```json
{
  "id": "一",
  "hanzi": null,
  "story": null,
  "jishoData": {
    "meaning": "one, one radical (no.1)",
    "jlptLevel": "N5",
    "strokeCount": 1,
    "kunyomi": ["ひと-", "ひと.つ"],
    "onyomi": ["イチ", "イツ"],
    "onyomiExamples": [
      {
        "example": "一",
        "reading": "イチ",
        "meaning": "one, 1, best, first..."
      }
    ],
    "kunyomiExamples": [...],
    "radical": {
      "symbol": "一",
      "meaning": "one"
    }
  },
  "kanjialiveData": {
    "examples": [
      {
        "japanese": "一年生（いちねんせい）",
        "meaning": {
          "english": "first-year student"
        },
        "audio": {
          "opus": "https://...",
          "aac": "https://...",
          "ogg": "https://...",
          "mp3": "https://..."
        }
      }
    ]
  }
}
```

**Features:**
- ✅ Only returns data used by UI (no bloat)
- ✅ Optimized serialization
- ✅ Cached for 1 hour
- ✅ Rate limited (30 req/min)

---

## 🚀 Next.js Configuration

### Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Page Configuration

```typescript
// src/app/[id]/page.tsx

// Enable dynamic rendering (SSR)
export const dynamic = 'force-dynamic';

// Allow dynamic params
export const dynamicParams = true;

// Optional: Enable ISR with revalidation
// export const revalidate = 3600;
```

### Fetch Configuration

```typescript
// src/lib/index.ts

const response = await fetch(url, {
  next: {
    revalidate: 3600, // Revalidate every 1 hour
  },
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Luyenkanji-NextJS/1.0',
  },
});
```

### Fallback Strategy

Nếu API fails → Tự động fallback về local JSON files:

```typescript
try {
  // Try API first
  return await getKanjiDataFromAPI(id);
} catch (error) {
  // Fallback to local data
  return await getKanjiDataLocal(id);
}
```

---

## 📊 Data Protection

### Why not use static files?

| Method | SEO | Performance | Data Protection |
|--------|-----|-------------|-----------------|
| Static JSON files | ✅ | ⚡⚡⚡ | ❌ (easily crawled) |
| Client-side API | ❌ | ⚡ | ⚡ (rate limited) |
| **SSR + API** | ✅ | ⚡⚡ | ✅ (protected) |

### Protection Layers

1. **Rate Limiting**: Max 30 requests/minute per IP
2. **Bot Detection**: Block scrapers, allow legitimate bots
3. **Cache Headers**: Control how data is cached
4. **Server-side Rendering**: Data never exposed in build output

---

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18.18.0
- Docker & Docker Compose
- Rails 8.0+
- MySQL 8.0
- Redis 7+

### Backend Setup (Rails API)

```bash
cd /Users/haotruong/Desktop/nhaituvung_api

# Start services
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f web
```

**API will be available at:** `http://localhost:3001`

### Frontend Setup (Next.js)

```bash
cd /Users/haotruong/Desktop/luyenkanji

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

# Start dev server
npm run dev
```

**App will be available at:** `http://localhost:3000`

---

## 🧪 Testing

### Test Rate Limiting

```bash
# Send 35 requests rapidly (should get 429 after 30)
for i in {1..35}; do
  curl -w "%{http_code}\n" -o /dev/null -s \
    "http://localhost:3001/api/v1/kanjis/一/ui_format"
done
```

Expected: First 30 return `200`, rest return `429`

### Test Caching

```bash
# First request (cold cache)
time curl -s "http://localhost:3001/api/v1/kanjis/一/ui_format" > /dev/null

# Second request (warm cache)
time curl -s "http://localhost:3001/api/v1/kanjis/一/ui_format" > /dev/null
```

Expected: Second request ~20x faster

### Test Cache Headers

```bash
curl -I "http://localhost:3001/api/v1/kanjis/一/ui_format"
```

Expected headers:
```
Cache-Control: max-age=3600, public
```

### Test Bot Detection

```bash
# Should be blocked
curl -A "scrapy/1.0" "http://localhost:3001/api/v1/kanjis/一/ui_format"

# Should be allowed
curl -A "Googlebot/2.1" "http://localhost:3001/api/v1/kanjis/一/ui_format"
```

---

## 📈 Performance Optimization Tips

### 1. CDN Integration

Add a CDN (Cloudflare, Vercel Edge) để cache HTML responses:

```typescript
// next.config.ts
const nextConfig = {
  headers: async () => [
    {
      source: '/:id',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600',
        },
      ],
    },
  ],
};
```

### 2. Connection Pooling

Rails API đã config connection pooling trong `database.yml`:
```yaml
pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

### 3. Redis Connection

Sử dụng `hiredis` cho faster Redis connections:
```ruby
# Gemfile
gem "redis", "~> 5.0"
gem "hiredis-client", "~> 0.22"
```

### 4. HTTP/2

Enable HTTP/2 trong production cho multiplexing:
```ruby
# config/puma.rb (production)
ssl_bind '0.0.0.0', '443', {
  cert: 'path/to/cert.pem',
  key: 'path/to/key.pem',
  verify_mode: 'none'
}
```

---

## 🚢 Deployment

### Backend (Rails API)

**Option 1: Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Option 2: Kamal**
```bash
kamal setup
kamal deploy
```

**Environment Variables:**
```env
RAILS_ENV=production
SECRET_KEY_BASE=your_secret_key
DATABASE_URL=mysql2://user:pass@host/db
REDIS_URL=redis://host:6379/0
```

### Frontend (Next.js)

**Option 1: Vercel (Recommended)**
```bash
vercel --prod
```

**Option 2: Docker**
```bash
docker build -t luyenkanji .
docker run -p 3000:3000 luyenkanji
```

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
```

### Post-Deployment Checklist

- [ ] Test API endpoints
- [ ] Verify rate limiting works
- [ ] Check cache is warming up
- [ ] Monitor response times
- [ ] Test SEO with Google Search Console
- [ ] Verify CDN caching (if applicable)

---

## 📝 Monitoring

### Key Metrics to Monitor

1. **API Response Time**
   - Target: < 100ms (cached)
   - Target: < 2s (uncached)

2. **Cache Hit Rate**
   - Target: > 95%
   - Check: `redis-cli info stats | grep keyspace_hits`

3. **Rate Limit Triggers**
   - Monitor 429 responses
   - Alert if > 5% of requests

4. **Error Rate**
   - Target: < 0.1%
   - Monitor API 5xx errors

### Redis Monitoring

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check cache stats
INFO stats

# View cached keys
KEYS kanji_ui_format:*

# Check memory usage
INFO memory
```

---

## 🐛 Troubleshooting

### API returns 429 (Rate Limited)

**Cause:** Too many requests from same IP
**Solution:** Wait 1 minute or whitelist your IP in `rack_attack.rb`

```ruby
# config/initializers/rack_attack.rb
safelist("allow-your-ip") do |req|
  req.ip == "YOUR_IP_HERE"
end
```

### Cache not working

**Check:**
```bash
# Verify Redis is running
docker-compose ps redis

# Check cache keys
docker-compose exec redis redis-cli KEYS "*"

# Check Rails cache config
docker-compose exec web rails runner "puts Rails.cache.class"
```

### Next.js build fails

**Node version error:**
```
Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required
```

**Solution:**
```bash
# Check current version
node --version

# Upgrade Node.js
nvm install 20
nvm use 20
```

### API fallback to local files

**Symptoms:** App works but logs show API errors
**Check:**
1. API server is running: `curl http://localhost:3001/api/v1/kanjis/一/ui_format`
2. Environment variable is set: `echo $NEXT_PUBLIC_API_URL`
3. Network connectivity between Next.js and Rails

---

## 📚 Additional Resources

### Rails API Documentation
- Full API docs: `/Users/haotruong/Desktop/nhaituvung_api/API_DOCUMENTATION.md`
- Setup guide: `/Users/haotruong/Desktop/nhaituvung_api/KANJI_SETUP.md`

### Dependencies
- [Rack::Attack](https://github.com/rack/rack-attack) - Rate limiting
- [Redis](https://redis.io/) - Caching
- [Next.js](https://nextjs.org/docs) - SSR framework

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `docker-compose logs web`
2. Check Redis: `docker-compose exec redis redis-cli INFO`
3. Check API: `curl -I http://localhost:3001/api/v1/kanjis/一/ui_format`

---

**Last Updated:** 2025-12-01
**Version:** 1.0
