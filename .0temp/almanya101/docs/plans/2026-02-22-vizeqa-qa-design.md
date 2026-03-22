# vizeqa/qa.html Design Document

## Overview
Simple anonymous question submission form for vizeqa section. Users submit questions, admin copies and answers via WhatsApp.

## Files to Create

```
vizeqa/
└── qa.html                     # Simple form page
api/
└── vizeqa-question-submit.js   # POST endpoint for question submission
```

## Database Table

**Table: `vizeqa_questions`**
```sql
CREATE TABLE vizeqa_questions (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Page Structure

**vizeqa/qa.html**
```html
<div class="container1">
  <!-- Hero Card -->
  <div class="card hero-card1">
    <div class="hero-domain1">almanya101.de</div>
    <h3>Genel Soru Gönder</h3>
    <p>Sorunuzu anonim olarak gönderin.</p>
  </div>

  <!-- Question Form -->
  <div class="card">
    <h4>Soru</h4>
    <form id="questionForm" class="stack-form" novalidate>
      <textarea id="questionInput" class="form-input textarea-input" maxlength="500" placeholder="Sorunuzu yazın..." required></textarea>
      <div class="char-meta"><span id="questionCharCount">0</span> / 500</div>

      <input id="questionWebsiteTrap" class="hp-field" type="text" name="website" autocomplete="off" tabindex="-1" />

      <button id="questionSubmitBtn" class="btn btn-primary" type="submit">Gönder</button>
      <div id="questionStatus" class="form-status" aria-live="polite"></div>
    </form>
  </div>
</div>
```

## API Endpoint

**POST `/api/vizeqa-question-submit`**

Request body:
```json
{
  "question": "Soru metni...",
  "website": ""  // Honeypot, boş olmalı
}
```

Response:
```json
{
  "ok": true,
  "item": {
    "id": 123,
    "question": "Soru metni...",
    "created_at": "2026-02-22T12:34:56.789Z"
  }
}
```

Validation:
- `question`: 3-500 karakter
- `website`: boş olmalı (spam koruma)

## Styling

Uses:
- `devuser/devuser.css` for base styles
- Custom styles from e2.html for form elements

## Flow

1. User opens vizeqa/qa.html
2. Types question in textarea
3. Clicks "Gönder"
4. Form submits to API
5. Success message shows
6. Admin queries database
7. Admin copies questions and answers via WhatsApp
