# vizeqa QA Form Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a simple anonymous question submission form for vizeqa section that saves questions to database for admin review.

**Architecture:** Single HTML page with form submits to Next.js API endpoint, which inserts into Supabase database. Admin queries database directly to review questions.

**Tech Stack:** HTML, vanilla JavaScript, Next.js API routes, Supabase (PostgreSQL)

---

## Task 1: Create database migration

**Files:**
- Create: `supabase/migrations/20260222_create_vizeqa_questions.sql`

**Step 1: Write migration file**

```sql
-- Migration: Create vizeqa_questions table
-- Purpose: Store anonymous questions submitted via vizeqa form

CREATE TABLE IF NOT EXISTS vizeqa_questions (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL CHECK (LENGTH(TRIM(question)) >= 3),
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries sorted by created_at
CREATE INDEX IF NOT EXISTS idx_vizeqa_questions_created_at ON vizeqa_questions(created_at DESC);
```

**Step 2: Run migration**

Run via Supabase dashboard or CLI:
```bash
supabase db push
```
Expected: Table created successfully

**Step 3: Commit**

```bash
git add supabase/migrations/20260222_create_vizeqa_questions.sql
git commit -m "feat: add vizeqa_questions table migration"
```

---

## Task 2: Create API endpoint for question submission

**Files:**
- Create: `api/vizeqa-question-submit.js`

**Step 1: Write the API endpoint**

```javascript
import { createClient } from '@supabase/supabase-js';

const MAX_QUESTION_LENGTH = 500;
const MIN_QUESTION_LENGTH = 3;

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body;
}

function cleanQuestion(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, MAX_QUESTION_LENGTH);
}

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const realIp = String(req.headers['x-real-ip'] || '').trim();
  const remoteAddress = String(req.connection?.remoteAddress || '').trim();
  return forwarded || realIp || remoteAddress || '';
}

function mapInsertError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('vizeqa_questions') && message.includes('does not exist')) {
    return 'vizeqa_questions tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Soru kaydedilemedi.';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const body = readBody(req);
  if (body === null) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Honeypot check for spam
  if (body.website || body.email) {
    return res.status(400).json({ error: 'Nope.' });
  }

  const question = cleanQuestion(body.question);
  if (!question) {
    return res.status(400).json({ error: 'Soru zorunlu.' });
  }
  if (question.length < MIN_QUESTION_LENGTH) {
    return res.status(400).json({ error: `Soru çok kısa (min ${MIN_QUESTION_LENGTH} karakter).` });
  }

  const ip = getClientIp(req);
  const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 16) : null;
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 255);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('vizeqa_questions')
      .insert([
        {
          question,
          ip_hash: ipHash,
          user_agent: userAgent,
        },
      ])
      .select('id, question, created_at')
      .single();

    if (error) {
      console.error('vizeqa-question-submit insert failed:', error);
      return res.status(500).json({ error: mapInsertError(error) });
    }

    return res.status(200).json({ ok: true, item: data || null });
  } catch (error) {
    console.error('vizeqa-question-submit failed:', error);
    return res.status(500).json({ error: 'Gönderim başarısız.' });
  }
}
```

**Step 2: Test API endpoint manually**

```bash
curl -X POST http://localhost:3000/api/vizeqa-question-submit \
  -H "Content-Type: application/json" \
  -d '{"question":"Test sorusu"}'
```
Expected: `{"ok":true,"item":{"id":1,"question":"Test sorusu","created_at":"..."}}`

**Step 3: Commit**

```bash
git add api/vizeqa-question-submit.js
git commit -m "feat: add vizeqa question submission API endpoint"
```

---

## Task 3: Create vizeqa/qa.html page

**Files:**
- Create: `vizeqa/qa.html`

**Step 1: Write HTML page**

```html
<!doctype html>
<html lang="tr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/png" href="../img/icons/headericon.png" />
  <title>Genel Soru Gönder - almanya101</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="stylesheet" href="../devuser/devuser.css" />
  <style>
    body {
      overflow-y: auto;
      padding: 12px 0;
    }

    .container1 {
      height: auto;
      min-height: calc(100dvh - 24px);
      display: flex;
      flex-direction: column;
      overflow: visible;
      gap: 10px;
    }

    .card p {
      margin: 0;
      color: #cfcfcf;
      line-height: 1.5;
      font-size: 14px;
    }

    .stack-form {
      display: grid;
      gap: 12px;
    }

    .field-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }

    .textarea-input {
      min-height: 120px;
      resize: vertical;
      margin-bottom: 0;
    }

    .char-meta {
      text-align: right;
      color: #9a9a9a;
      font-size: 12px;
    }

    .hp-field {
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }

    .form-status {
      display: none;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
    }

    .form-status.loading {
      display: block;
      background: #3e2d06;
      color: #ffe08a;
    }

    .form-status.success {
      display: block;
      background: #143b27;
      color: #9af0be;
    }

    .form-status.error {
      display: block;
      background: #46181d;
      color: #ff9aa6;
    }
  </style>
</head>

<body>
  <div class="container1">
    <div class="card hero-card1">
      <div class="hero-domain1">almanya101.de</div>
      <h3 style="margin-bottom: 8px;">Genel Soru Gönder</h3>
      <p style="color: rgba(255,255,255,.95);">
        Sorunuzu anonim olarak gönderin.
      </p>
    </div>

    <div class="card">
      <h4 style="margin-top:0; margin-bottom:10px; color:#fff;">Soru</h4>
      <form id="questionForm" class="stack-form" novalidate>
        <textarea id="questionInput" class="form-input textarea-input" maxlength="500" placeholder="Sorunuzu yazın..." required></textarea>
        <div class="char-meta"><span id="questionCharCount">0</span> / 500</div>

        <input id="questionWebsiteTrap" class="hp-field" type="text" name="website" autocomplete="off" tabindex="-1" />

        <button id="questionSubmitBtn" class="btn btn-primary" type="submit">Gönder</button>
        <div id="questionStatus" class="form-status" aria-live="polite"></div>
      </form>
    </div>
  </div>

  <script>
    const QUESTION_SUBMIT_API_URL = '/api/vizeqa-question-submit';

    const questionForm = document.getElementById('questionForm');
    const questionInput = document.getElementById('questionInput');
    const questionCharCount = document.getElementById('questionCharCount');
    const questionSubmitBtn = document.getElementById('questionSubmitBtn');
    const questionStatus = document.getElementById('questionStatus');
    const questionWebsiteTrap = document.getElementById('questionWebsiteTrap');

    function normalizeLine(value) {
      return String(value || '').replace(/\r\n/g, '\n').trim();
    }

    function setStatus(element, message, type) {
      if (!message) {
        element.className = 'form-status';
        element.textContent = '';
        return;
      }

      element.className = `form-status ${type}`.trim();
      element.textContent = message;
    }

    function updateQuestionCharCount() {
      questionCharCount.textContent = String(questionInput.value.length);
    }

    async function submitQuestion(event) {
      event.preventDefault();
      setStatus(questionStatus, '', '');

      const question = normalizeLine(questionInput.value);
      if (!question) {
        setStatus(questionStatus, 'Soru zorunlu.', 'error');
        return;
      }
      if (question.length > 500) {
        setStatus(questionStatus, 'Soru en fazla 500 karakter olabilir.', 'error');
        return;
      }

      questionSubmitBtn.disabled = true;
      questionSubmitBtn.textContent = 'Gönderiliyor...';
      setStatus(questionStatus, 'Soru kaydediliyor...', 'loading');

      try {
        const response = await fetch(QUESTION_SUBMIT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            website: questionWebsiteTrap.value || '',
          }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || 'Gönderim başarısız');
        }

        questionForm.reset();
        updateQuestionCharCount();
        setStatus(questionStatus, 'Soru gönderildi.', 'success');
      } catch (error) {
        setStatus(questionStatus, error.message || 'Gönderim sırasında hata oluştu.', 'error');
      } finally {
        questionSubmitBtn.disabled = false;
        questionSubmitBtn.textContent = 'Gönder';
      }
    }

    questionInput.addEventListener('input', updateQuestionCharCount);
    questionForm.addEventListener('submit', submitQuestion);

    updateQuestionCharCount();
  </script>
</body>

</html>
```

**Step 2: Test page manually**

1. Open `http://localhost:3000/vizeqa/qa.html`
2. Type a question in the textarea
3. Click "Gönder"
4. Verify success message appears
5. Check database: question should be in `vizeqa_questions` table

Expected: Question submitted successfully, success message shows

**Step 3: Commit**

```bash
git add vizeqa/qa.html
git commit -m "feat: add vizeqa question submission form"
```

---

## Task 4: Final commit and push

**Files:**
- None (all already committed in previous tasks)

**Step 1: Push to remote**

```bash
git push
```
Expected: All changes pushed to main branch

**Step 2: Test in production**

1. Deploy to Vercel (if auto-deploy doesn't trigger)
2. Open `https://almanya101.de/vizeqa/qa.html`
3. Submit a test question
4. Verify in Supabase dashboard

Expected: Everything works in production

---

## Summary

- Database migration creates `vizeqa_questions` table
- API endpoint handles POST requests with validation
- HTML page provides simple form for anonymous question submission
- Admin can query database to review submitted questions
