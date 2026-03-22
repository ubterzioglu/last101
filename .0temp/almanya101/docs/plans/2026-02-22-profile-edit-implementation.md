# Profil Düzenleme Sistemi Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Devuser topluluğu üyelerinin kendi profillerini düzenleyebilecekleri bir sistem oluştur.

**Architecture:** Single-page profile edit form (profile-edit.html) + PATCH API endpoint (/api/devuser-update.js). Client-side validation + server-side strict validation with Supabase RLS.

**Tech Stack:** Next.js API routes, Supabase Auth, Vanilla JavaScript (ES6+), HTML5, CSS (devuserlist.css reuse)

---

### Task 1: List.html'e "Profil Düzenle" Butonu Ekle

**Files:**
- Modify: `devuser/list.html:46-56`

**Step 1: Add profile edit button HTML**

Account card içinde logoutBtn'un yanına butonu ekle:

```html
<div class="account-actions">
  <button type="button" class="btn btn-secondary" id="editProfileBtn">Profil Düzenle</button>
  <button type="button" class="btn btn-secondary" id="logoutBtn">Çıkış</button>
</div>
```

**Step 2: Add event listener**

JavaScript bölümünde editProfileBtn tanımla ve event listener ekle (satır 150 civarı):

```javascript
const editProfileBtn = document.getElementById('editProfileBtn');
editProfileBtn.addEventListener('click', () => {
  window.location.href = 'profile-edit.html';
});
```

**Step 3: Verify functionality**

Run: `npm run dev` ve list.html'ye git
Expected: "Profil Düzenle" butonu görünüyor, tıklayınca profile-edit.html'e gidiyor

**Step 4: Commit**

```bash
git add devuser/list.html
git commit -m "feat: add profile edit button to list.html"
```

---

### Task 2: API Endpoint - devuser-update.js Oluştur

**Files:**
- Create: `api/devuser-update.js`

**Step 1: Create skeleton file**

Create `api/devuser-update.js` with basic structure:

```javascript
import { getSupabaseUserFromRequest } from './_supabase-user.js';

const ALLOWED_ORIGINS = new Set([
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]);

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return null;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
}

function getSupabaseHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = normalizeOrigin(req.headers.origin || req.headers.referer || null);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Unauthorized origin' });
  }

  // Auth check and update logic here
  res.status(501).json({ error: 'Not implemented' });
}
```

**Step 2: Test skeleton**

Run: `npm run dev` ve `curl -X PATCH http://localhost:3000/api/devuser-update`
Expected: `{ error: 'Not implemented' }`

**Step 3: Commit**

```bash
git add api/devuser-update.js
git commit -m "feat: create devuser-update API skeleton"
```

---

### Task 3: Authentication ve User Lookup Ekleyin

**Files:**
- Modify: `api/devuser-update.js:31-43`

**Step 1: Add authentication check**

Skeleton'ı güncelle:

```javascript
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = normalizeOrigin(req.headers.origin || req.headers.referer || null);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Unauthorized origin' });
  }

  const auth = await getSupabaseUserFromRequest(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const headers = getSupabaseHeaders(SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Fetch current profile by user_id
    const url = new URL(`${SUPABASE_URL}/rest/v1/devuser`);
    url.searchParams.set('select', '*');
    url.searchParams.set('user_id', `eq.${auth.user.id}`);
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), { method: 'GET', headers });
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    const rows = await response.json().catch(() => []);
    if (!Array.isArray(rows) || !rows[0]) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const currentProfile = rows[0];

    // Verify ownership (extra security)
    if (currentProfile.user_id !== auth.user.id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    res.status(200).json({ success: true, message: 'Auth verified' });
  } catch (error) {
    console.error('devuser-update auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Step 2: Test authentication**

Run: Test with no auth token:
```
curl -X PATCH http://localhost:3000/api/devuser-update
```
Expected: `{ error: 'Unauthorized' }`

Run: Test with valid auth token (from browser devtools):
```
curl -X PATCH http://localhost:3000/api/devuser-update -H "Authorization: Bearer YOUR_TOKEN"
```
Expected: `{ success: true, message: 'Auth verified' }` veya `{ error: 'Profile not found' }`

**Step 3: Commit**

```bash
git add api/devuser-update.js
git commit -m "feat: add authentication and user lookup to devuser-update"
```

---

### Task 4: Validation Fonksiyonları Ekleyin

**Files:**
- Modify: `api/devuser-update.js`

**Step 1: Add validation helper functions**

Dosyanın sonuna, export default'dan önce ekle:

```javascript
// Validation constants
const ROL_OPTIONS = [
  'Software Developer', 'QA/Test', 'DevOps', 'Data/AI',
  'Product/Project', 'UI/UX', 'Öğrenci', 'Diğer'
];

const DENEYIM_OPTIONS = [
  '0-1 yıl', '1-3 yıl', '3-5 yıl', '5-10 yıl', '10+ yıl'
];

const ARAMA_DURUMU_OPTIONS = [
  'Hayır', 'Evet pasif (firsat olursa)', 'Evet, aktif', 'Sadece freelance bakıyorum'
];

const FREELANCE_OPTIONS = [
  'Hayır', 'Evet hafta içi akşamları', 'Evet hafta sonu',
  'Evet part-time düzenli', 'Evet full-time freelance'
];

const KATILMA_AMACI_OPTIONS = [
  'Networking', 'İş bulmak', 'İş arkadaşı bulmak',
  'Proje geliştirmek', 'Bilgi paylaşmak', 'Mentorluk almak', 'Mentorluk vermek'
];

function validateString(value, fieldName, minLength = 0, maxLength = 500) {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: null }; // Optional field
  }
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  if (value.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  if (value.length > maxLength) {
    return { valid: false, error: `${fieldName} must be at most ${maxLength} characters` };
  }
  return { valid: true, value: value.trim() };
}

function validateRequiredString(value, fieldName, minLength = 2, maxLength = 200) {
  if (value === undefined || value === null || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return validateString(value, fieldName, minLength, maxLength);
}

function validateBoolean(value, fieldName) {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }
  if (typeof value !== 'boolean') {
    return { valid: false, error: `${fieldName} must be true or false` };
  }
  return { valid: true, value };
}

function validateArray(value, fieldName, allowedValues = null) {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }
  if (!Array.isArray(value)) {
    return { valid: false, error: `${fieldName} must be an array` };
  }
  if (allowedValues) {
    for (const item of value) {
      if (!allowedValues.includes(item)) {
        return { valid: false, error: `Invalid value in ${fieldName}: ${item}` };
      }
    }
  }
  return { valid: true, value };
}

function validateEnum(value, fieldName, allowedValues) {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: null };
  }
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  if (!allowedValues.includes(value)) {
    return { valid: false, error: `Invalid ${fieldName}. Must be one of: ${allowedValues.join(', ')}` };
  }
  return { valid: true, value };
}

function validateUrl(value, fieldName) {
  if (!value || value === '') {
    return { valid: true, value: null };
  }
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: `${fieldName} must be a valid HTTP/HTTPS URL` };
    }
    return { valid: true, value: url.toString() };
  } catch {
    return { valid: false, error: `${fieldName} must be a valid URL` };
  }
}

function validatePhone(value, fieldName) {
  if (!value || value === '') {
    return { valid: true, value: null };
  }
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length < 8 || digits.length > 15) {
    return { valid: false, error: `${fieldName} must be between 8-15 digits` };
  }
  return { valid: true, value: value.replace(/\s/g, '') };
}
```

**Step 2: Test validation functions**

Temp test kodu ekle (sonra sil):

```javascript
// Test validation (REMOVE LATER)
console.log(validateRequiredString('', 'name')); // Should fail
console.log(validateRequiredString('ab', 'name')); // Should pass
console.log(validateUrl('https://example.com', 'url')); // Should pass
```

**Step 3: Commit**

```bash
git add api/devuser-update.js
git commit -m "feat: add validation helper functions to devuser-update"
```

---

### Task 5: Profile Update Request Validation Ekleyin

**Files:**
- Modify: `api/devuser-update.js`

**Step 1: Parse request body**

Auth check'dan sonra, user lookup'dan önce ekle:

```javascript
// Parse request body
let requestBody;
try {
  requestBody = req.body || {};
  if (typeof req.body === 'string') {
    requestBody = JSON.parse(req.body);
  }
} catch (error) {
  return res.status(400).json({ error: 'Invalid request body' });
}

// Validate request body
const fieldErrors = {};
const validatedData = {};

// Required fields
const nameResult = validateRequiredString(requestBody.ad_soyad, 'Ad Soyad');
if (!nameResult.valid) {
  fieldErrors.ad_soyad = nameResult.error;
} else {
  validatedData.ad_soyad = nameResult.value;
}

// Optional fields
const cityResult = validateString(requestBody.sehir, 'Şehir', 0, 100);
if (!cityResult.valid) fieldErrors.sehir = cityResult.error;
else validatedData.sehir = cityResult.value;

const linkedinResult = validateUrl(requestBody.linkedin_url, 'LinkedIn URL');
if (!linkedinResult.valid) fieldErrors.linkedin_url = linkedinResult.error;
else validatedData.linkedin_url = linkedinResult.value;

const whatsappResult = validatePhone(requestBody.whatsapp_tel, 'WhatsApp');
if (!whatsappResult.valid) fieldErrors.whatsapp_tel = whatsappResult.error;
else validatedData.whatsapp_tel = whatsappResult.value;

validatedData.almanya_yasam = validateBoolean(requestBody.almanya_yasam, 'Almanya\'da Yaşıyor').value;
validatedData.rol = validateEnum(requestBody.rol, 'Rol', ROL_OPTIONS).value;
validatedData.deneyim_seviye = validateEnum(requestBody.deneyim_seviye, 'Deneyim Seviyesi', DENEYIM_OPTIONS).value;
validatedData.is_arama_durumu = validateEnum(requestBody.is_arama_durumu, 'İş Arama Durumu', ARAMA_DURUMU_OPTIONS).value;
validatedData.freelance_aciklik = validateEnum(requestBody.freelance_aciklik, 'Freelance Açıklık', FREELANCE_OPTIONS).value;
validatedData.katilma_amaci = validateEnum(requestBody.katilma_amaci, 'Katılma Amacı', KATILMA_AMACI_OPTIONS).value;

const gucluAlanlarResult = validateArray(requestBody.guclu_alanlar, 'Güçlü Alanlar');
if (!gucluAlanlarResult.valid) fieldErrors.guclu_alanlar = gucluAlanlarResult.error;
else validatedData.guclu_alanlar = gucluAlanlarResult.value;

const progDilleriResult = validateArray(requestBody.programlama_dilleri, 'Programlama Dilleri');
if (!progDilleriResult.valid) fieldErrors.programlama_dilleri = progDilleriResult.error;
else validatedData.programlama_dilleri = progDilleriResult.value;

const frameworkResult = validateArray(requestBody.framework_platformlar, 'Framework/Platformlar');
if (!frameworkResult.valid) fieldErrors.framework_platformlar = frameworkResult.error;
else validatedData.framework_platformlar = frameworkResult.value;

const devopsResult = validateArray(requestBody.devops_cloud, 'DevOps/Cloud');
if (!devopsResult.valid) fieldErrors.devops_cloud = devopsResult.error;
else validatedData.devops_cloud = devopsResult.value;

const ilgiResult = validateArray(requestBody.ilgi_konular, 'İlgi Konular');
if (!ilgiResult.valid) fieldErrors.ilgi_konular = ilgiResult.error;
else validatedData.ilgi_konular = ilgiResult.value;

const ogrenResult = validateArray(requestBody.ogrenmek_istenen, 'Öğrenmek İstenen');
if (!ogrenResult.valid) fieldErrors.ogrenmek_istenen = ogrenResult.error;
else validatedData.ogrenmek_istenen = ogrenResult.value;

const isbirligiResult = validateArray(requestBody.isbirligi_turu, 'İş Birliği Türü');
if (!isbirligiResult.valid) fieldErrors.isbirligi_turu = isbirligiResult.error;
else validatedData.isbirligi_turu = isbirligiResult.value;

// Boolean fields
validatedData.aktif_kod = validateBoolean(requestBody.aktif_kod, 'Aktif Kod').value;
validatedData.acik_kaynak = validateBoolean(requestBody.acik_kaynak, 'Açık Kaynak').value;
validatedData.kendi_proje = validateBoolean(requestBody.kendi_proje, 'Kendi Proje').value;
validatedData.gonullu_proje = validateBoolean(requestBody.gonullu_proje, 'Gönüllü Proje').value;
validatedData.profesyonel_destek_verebilir = validateBoolean(requestBody.profesyonel_destek_verebilir, 'Profesyonel Destek Verebilir').value;
validatedData.profesyonel_destek_almak = validateBoolean(requestBody.profesyonel_destek_almak, 'Profesyonel Destek Almak').value;
validatedData.aratilabilir = validateBoolean(requestBody.aratilabilir, 'Aranabilir').value;
validatedData.iletisim_izni = validateBoolean(requestBody.iletisim_izni, 'İletişim İzni').value;

// URL field
const projeLinkResult = validateUrl(requestBody.proje_link, 'Proje Link');
if (!projeLinkResult.valid) fieldErrors.proje_link = projeLinkResult.error;
else validatedData.proje_link = projeLinkResult.value;

// Check if there are validation errors
if (Object.keys(fieldErrors).length > 0) {
  return res.status(400).json({ error: 'Validation failed', field_errors: fieldErrors });
}
```

**Step 2: Test validation**

Run: Test with invalid data:
```
curl -X PATCH http://localhost:3000/api/devuser-update -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"ad_soyad":""}'
```
Expected: `{ error: 'Validation failed', field_errors: { ad_soyad: 'Ad Soyad is required' } }`

**Step 3: Commit**

```bash
git add api/devuser-update.js
git commit -m "feat: add request body validation to devuser-update"
```

---

### Task 6: Database Update Logic Ekleyin

**Files:**
- Modify: `api/devuser-update.js`

**Step 1: Add Supabase update function**

Validation'dan sonra, database update logic'i ekle:

```javascript
// Update profile in Supabase
const updateUrl = new URL(`${SUPABASE_URL}/rest/v1/devuser`);
updateUrl.searchParams.set('id', `eq.${currentProfile.id}`);
updateUrl.searchParams.set('select', '*');

const updateResponse = await fetch(updateUrl.toString(), {
  method: 'PATCH',
  headers: {
    ...headers,
    Prefer: 'return=representation',
  },
  body: JSON.stringify(validatedData),
});

if (!updateResponse.ok) {
  console.error('Supabase update failed:', updateResponse.status);
  return res.status(500).json({ error: 'Failed to update profile' });
}

const updatedRows = await updateResponse.json().catch(() => []);
if (!Array.isArray(updatedRows) || !updatedRows[0]) {
  return res.status(500).json({ error: 'Failed to retrieve updated profile' });
}

// Strip sensitive fields before returning
const { login_pin_hash, login_pin_salt, ...safeData } = updatedRows[0];

return res.status(200).json({
  success: true,
  data: safeData,
});
```

**Step 2: Test full update flow**

Run: Test with valid data:
```
curl -X PATCH http://localhost:3000/api/devuser-update -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"ad_soyad":"Test User","sehir":"Berlin"}'
```
Expected: `{ success: true, data: { ... } }`

**Step 3: Commit**

```bash
git add api/devuser-update.js
git commit -m "feat: add database update logic to devuser-update"
```

---

### Task 7: profile-edit.html Sayfasını Oluştur

**Files:**
- Create: `devuser/profile-edit.html`

**Step 1: Create HTML skeleton**

Create `devuser/profile-edit.html` with basic structure:

```html
<!doctype html>
<html lang="tr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/png" href="../img/icons/headericon.png" />
  <title>Profil Düzenle - almanya101</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="devuserlist.css" />
</head>

<body>
  <div class="container1" id="loadingState">
    <div class="card hero-card1">
      <div class="hero-domain1">almanya101.de</div>
      <h3>Profil Düzenle</h3>
      <p>Yükleniyor...</p>
    </div>
  </div>

  <div class="container1" id="mainContent" style="display:none;">
    <div class="card hero-card1">
      <div class="hero-domain1">almanya101.de</div>
      <h3>Profil Düzenle</h3>
      <p>Bilgilerinizi güncelleyin.</p>
    </div>

    <div class="card">
      <p class="status-message" id="statusMessage"></p>
      <div class="actions">
        <button type="button" class="btn btn-primary" id="saveBtn">Kaydet</button>
        <button type="button" class="btn btn-secondary" id="cancelBtn">İptal</button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="supabase-config.js"></script>
  <script type="module">
    // JavaScript will be added in next task
  </script>
</body>

</html>
```

**Step 2: Test skeleton**

Run: `npm run dev` ve profile-edit.html'ye git
Expected: "Yükleniyor..." mesajı görünüyor

**Step 3: Commit**

```bash
git add devuser/profile-edit.html
git commit -m "feat: create profile-edit.html skeleton"
```

---

### Task 8: Profile Form Alanları Ekleyin (Kişisel Bilgiler)

**Files:**
- Modify: `devuser/profile-edit.html`

**Step 1: Add personal info form section**

mainContent div'ine, statusMessage'dan önce ekle:

```html
<!-- Kişisel Bilgiler -->
<div class="card">
  <h4>Kişisel Bilgiler</h4>

  <div class="form-group">
    <label for="ad_soyad">Ad Soyad *</label>
    <input type="text" id="ad_soyad" name="ad_soyad" required autocomplete="name" />
  </div>

  <div class="form-group">
    <label for="sehir">Şehir</label>
    <input type="text" id="sehir" name="sehir" autocomplete="address-level2" />
  </div>

  <div class="form-group">
    <label for="linkedin_url">LinkedIn URL</label>
    <input type="url" id="linkedin_url" name="linkedin_url" autocomplete="url" placeholder="https://linkedin.com/in/..." />
  </div>

  <div class="form-group">
    <label for="whatsapp_tel">WhatsApp Telefon</label>
    <input type="tel" id="whatsapp_tel" name="whatsapp_tel" autocomplete="tel" placeholder="+49123456789" />
  </div>

  <div class="form-group checkbox-group">
    <label class="checkbox-label">
      <input type="checkbox" id="almanya_yasam" name="almanya_yasam" />
      <span>Almanya'da yaşıyorum</span>
    </label>
  </div>
</div>
```

**Step 2: Add CSS for form groups**

Devuserlist.css'e ekle (veya inline style olarak):

```css
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="tel"],
.form-group input[type="email"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #F65314;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.checkbox-group {
  padding: 8px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 400;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.status-message {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  display: none;
}

.status-message.success {
  background: rgba(52, 211, 153, 0.2);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.3);
  display: block;
}

.status-message.error {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
  display: block;
}

.form-group input.error {
  border-color: #f87171;
}

.error-text {
  color: #f87171;
  font-size: 12px;
  margin-top: 4px;
  display: none;
}

.form-group input.error + .error-text {
  display: block;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.actions .btn {
  flex: 1;
  max-width: 200px;
}
```

**Step 3: Test form layout**

Run: Form alanlarının doğru göründüğünü kontrol et
Expected: Label'lar ve input'lar düzgün hizalanmış

**Step 4: Commit**

```bash
git add devuser/profile-edit.html devuser/devuserlist.css
git commit -m "feat: add personal info form section to profile-edit.html"
```

---

### Task 9: Profile Form Alanları Ekleyin (Tüm Bölümler)

**Files:**
- Modify: `devuser/profile-edit.html`

**Step 1: Add profile info section**

Kişisel Bilgiler'dan sonra ekle:

```html
<!-- Profil Bilgileri -->
<div class="card">
  <h4>Profil Bilgileri</h4>

  <div class="form-group">
    <label for="rol">Rol</label>
    <select id="rol" name="rol">
      <option value="">Seçiniz</option>
      <option value="Software Developer">Software Developer</option>
      <option value="QA/Test">QA/Test</option>
      <option value="DevOps">DevOps</option>
      <option value="Data/AI">Data/AI</option>
      <option value="Product/Project">Product/Project</option>
      <option value="UI/UX">UI/UX</option>
      <option value="Öğrenci">Öğrenci</option>
      <option value="Diğer">Diğer</option>
    </select>
  </div>

  <div class="form-group">
    <label for="deneyim_seviye">Deneyim Seviyesi</label>
    <select id="deneyim_seviye" name="deneyim_seviye">
      <option value="">Seçiniz</option>
      <option value="0-1 yıl">0-1 yıl</option>
      <option value="1-3 yıl">1-3 yıl</option>
      <option value="3-5 yıl">3-5 yıl</option>
      <option value="5-10 yıl">5-10 yıl</option>
      <option value="10+ yıl">10+ yıl</option>
    </select>
  </div>

  <div class="form-group">
    <label>Güçlü Alanlar</label>
    <div class="checkbox-group-container">
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Backend" /> Backend</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Frontend" /> Frontend</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Mobile" /> Mobile</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="QA/Manual Testing" /> QA/Manual Testing</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Test Automation" /> Test Automation</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="DevOps/CI-CD" /> DevOps/CI-CD</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Data/BI" /> Data/BI</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="AI/ML" /> AI/ML</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Cloud" /> Cloud</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Security" /> Security</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Product/Project" /> Product/Project</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="UI/UX" /> UI/UX</label>
      <label class="checkbox-label"><input type="checkbox" name="guclu_alanlar" value="Diğer" /> Diğer</label>
    </div>
  </div>

  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="aktif_kod" name="aktif_kod" /> Aktif kod yazıyorum</label>
  </div>
  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="acik_kaynak" name="acik_kaynak" /> Açık kaynak projelerde çalışıyorum</label>
  </div>
  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="kendi_proje" name="kendi_proje" /> Kendi projem var</label>
  </div>

  <div class="form-group">
    <label for="proje_link">Proje Link</label>
    <input type="url" id="proje_link" name="proje_link" autocomplete="url" placeholder="https://..." />
  </div>
</div>
```

**Step 2: Add tech stack section**

```html
<!-- Teknoloji Stack -->
<div class="card">
  <h4>Teknoloji Stack</h4>

  <div class="form-group">
    <label>Programlama Dilleri</label>
    <div class="checkbox-group-container">
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="JavaScript" /> JavaScript</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="TypeScript" /> TypeScript</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="Python" /> Python</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="Java" /> Java</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="C#" /> C#</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="Go" /> Go</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="PHP" /> PHP</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="C/C++" /> C/C++</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="Kotlin" /> Kotlin</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="Swift" /> Swift</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="SQL" /> SQL</label>
      <label class="checkbox-label"><input type="checkbox" name="programlama_dilleri" value="Diğer" /> Diğer</label>
    </div>
  </div>

  <div class="form-group">
    <label>Framework/Platformlar</label>
    <div class="checkbox-group-container">
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="React" /> React</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="Angular" /> Angular</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="Vue" /> Vue</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="Node.js" /> Node.js</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value=".NET" /> .NET</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="Spring" /> Spring</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="Django" /> Django</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="FastAPI" /> FastAPI</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="Flutter" /> Flutter</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="React Native" /> React Native</label>
      <label class="checkbox-label"><input type="checkbox" name="framework_platformlar" value="Diğer" /> Diğer</label>
    </div>
  </div>

  <div class="form-group">
    <label>DevOps/Cloud</label>
    <div class="checkbox-group-container">
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="Docker" /> Docker</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="Kubernetes" /> Kubernetes</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="AWS" /> AWS</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="Azure" /> Azure</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="GCP" /> GCP</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="Terraform" /> Terraform</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="GitHub Actions" /> GitHub Actions</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="GitLab CI" /> GitLab CI</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="Jenkins" /> Jenkins</label>
      <label class="checkbox-label"><input type="checkbox" name="devops_cloud" value="Diğer" /> Diğer</label>
    </div>
  </div>
</div>
```

**Step 3: Add remaining sections**

```html
<!-- İlgi Alanları -->
<div class="card">
  <h4>İlgi Alanları</h4>

  <div class="form-group">
    <label>İlgi Konular</label>
    <div class="checkbox-group-container">
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="AI araçları/LLM uygulamaları" /> AI araçları/LLM uygulamaları</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Startup/ürün geliştirme" /> Startup/ürün geliştirme</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Freelance/danışmanlık" /> Freelance/danışmanlık</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Remote çalışma" /> Remote çalışma</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Almanya'da kariyer & iş piyasası" /> Almanya'da kariyer & iş piyasası</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Networking/event/meetup" /> Networking/event/meetup</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Side project/hackathon" /> Side project/hackathon</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Open-source" /> Open-source</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Sertifika/eğitim" /> Sertifika/eğitim</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Teknik yazı/içerik üretimi" /> Teknik yazı/içerik üretimi</label>
      <label class="checkbox-label"><input type="checkbox" name="ilgi_konular" value="Diğer" /> Diğer</label>
    </div>
  </div>

  <div class="form-group">
    <label>Öğrenmek İstenen</label>
    <div class="checkbox-group-container">
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Backend" /> Backend</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Frontend" /> Frontend</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Mobile" /> Mobile</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Test Automation" /> Test Automation</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="DevOps" /> DevOps</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Cloud" /> Cloud</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="AI/ML" /> AI/ML</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Data Engineering/Analytics" /> Data Engineering/Analytics</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Security" /> Security</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="System Design/Architecture" /> System Design/Architecture</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Performance/Scalability" /> Performance/Scalability</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="UI/UX" /> UI/UX</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Product/Agile" /> Product/Agile</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Interview prep/CV" /> Interview prep/CV</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Almanya kariyer/iş arama" /> Almanya kariyer/iş arama</label>
      <label class="checkbox-label"><input type="checkbox" name="ogrenmek_istenen" value="Diğer" /> Diğer</label>
    </div>
  </div>
</div>

<!-- İş Durumu -->
<div class="card">
  <h4>İş Durumu</h4>

  <div class="form-group">
    <label for="is_arama_durumu">İş Arama Durumu</label>
    <select id="is_arama_durumu" name="is_arama_durumu">
      <option value="">Seçiniz</option>
      <option value="Hayır">Hayır</option>
      <option value="Evet pasif (firsat olursa)">Evet pasif (fırsat olursa)</option>
      <option value="Evet, aktif">Evet, aktif</option>
      <option value="Sadece freelance bakıyorum">Sadece freelance bakıyorum</option>
    </select>
  </div>

  <div class="form-group">
    <label for="freelance_aciklik">Freelance Açıklık</label>
    <select id="freelance_aciklik" name="freelance_aciklik">
      <option value="">Seçiniz</option>
      <option value="Hayır">Hayır</option>
      <option value="Evet hafta içi akşamları">Evet hafta içi akşamları</option>
      <option value="Evet hafta sonu">Evet hafta sonu</option>
      <option value="Evet part-time düzenli">Evet part-time düzenli</option>
      <option value="Evet full-time freelance">Evet full-time freelance</option>
    </select>
  </div>

  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="gonullu_proje" name="gonullu_proje" /> Gönüllü projelere katılabilirim</label>
  </div>
</div>

<!-- İş Birliği -->
<div class="card">
  <h4>İş Birliği</h4>

  <div class="form-group">
    <label for="katilma_amaci">Katılma Amacı</label>
    <select id="katilma_amaci" name="katilma_amaci">
      <option value="">Seçiniz</option>
      <option value="Networking">Networking</option>
      <option value="İş bulmak">İş bulmak</option>
      <option value="İş arkadaşı bulmak">İş arkadaşı bulmak</option>
      <option value="Proje geliştirmek">Proje geliştirmek</option>
      <option value="Bilgi paylaşmak">Bilgi paylaşmak</option>
      <option value="Mentorluk almak">Mentorluk almak</option>
      <option value="Mentorluk vermek">Mentorluk vermek</option>
    </select>
  </div>

  <div class="form-group">
    <label>İş Birliği Türleri</label>
    <div class="checkbox-group-container">
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Side project (haftada 2-5 saat)" /> Side project (haftada 2-5 saat)</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Side project (haftada 5-10 saat)" /> Side project (haftada 5-10 saat)</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Startup kurmak (ciddi)" /> Startup kurmak (ciddi)</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="MVP çıkarma ekibi (tasarım+dev+test)" /> MVP çıkarma ekibi (tasarım+dev+test)</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Freelance ekip kurmak (ücretli)" /> Freelance ekip kurmak (ücretli)</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Açık kaynak proje" /> Açık kaynak proje</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Study group (system design, leetcode vb.)" /> Study group (system design, leetcode vb.)</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Mentorluk/koçluk" /> Mentorluk/koçluk</label>
      <label class="checkbox-label"><input type="checkbox" name="isbirligi_turu" value="Sadece tanışma & network" /> Sadece tanışma & network</label>
    </div>
  </div>

  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="profesyonel_destek_verebilir" name="profesyonel_destek_verebilir" /> Profesyonel destek verebilirim</label>
  </div>
  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="profesyonel_destek_almak" name="profesyonel_destek_almak" /> Profesyonel destek almak istiyorum</label>
  </div>
</div>

<!-- Görünürlük -->
<div class="card">
  <h4>Görünürlük</h4>

  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="aratilabilir" name="aratilabilir" /> Aranabilir (diğer üyeler profilimi görebilir)</label>
  </div>
  <div class="form-group checkbox-group">
    <label class="checkbox-label"><input type="checkbox" id="iletisim_izni" name="iletisim_izni" /> İletişim bilgilerimi paylaş</label>
  </div>
</div>
```

**Step 4: Add checkbox group container CSS**

```css
.checkbox-group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.checkbox-group-container .checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 640px) {
  .checkbox-group-container {
    flex-direction: column;
    gap: 8px;
  }

  .checkbox-group-container .checkbox-label {
    display: flex;
  }

  .actions {
    flex-direction: column;
  }

  .actions .btn {
    max-width: 100%;
  }
}
```

**Step 5: Test all form sections**

Run: Tüm form bölümlerinin doğru göründüğünü kontrol et
Expected: Tüm checkbox'lar, input'lar ve select'ler düzgün hizalanmış

**Step 6: Commit**

```bash
git add devuser/profile-edit.html devuser/devuserlist.css
git commit -m "feat: add all form sections to profile-edit.html"
```

---

### Task 10: JavaScript - Form Population Ekleyin

**Files:**
- Modify: `devuser/profile-edit.html`

**Step 1: Add JavaScript skeleton**

Script tag'i içini güncelle:

```javascript
<script type="module">
  const loadingState = document.getElementById('loadingState');
  const mainContent = document.getElementById('mainContent');
  const statusMessage = document.getElementById('statusMessage');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  let supabaseClient = null;

  function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    const cfg = window.ALMANYA101_SUPABASE || {};
    if (!window.supabase || !cfg.url || !cfg.anonKey) {
      throw new Error('Supabase config eksik.');
    }

    supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return supabaseClient;
  }

  async function getSessionToken() {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.getSession();
    if (error || !data.session) return null;
    return data.session.access_token;
  }

  function populateForm(profileData) {
    // Text inputs
    const textFields = ['ad_soyad', 'sehir', 'linkedin_url', 'whatsapp_tel', 'proje_link'];
    textFields.forEach(field => {
      const input = document.getElementById(field);
      if (input && profileData[field] !== undefined && profileData[field] !== null) {
        input.value = profileData[field];
      }
    });

    // Select fields
    const selectFields = ['rol', 'deneyim_seviye', 'is_arama_durumu', 'freelance_aciklik', 'katilma_amaci'];
    selectFields.forEach(field => {
      const select = document.getElementById(field);
      if (select && profileData[field]) {
        select.value = profileData[field];
      }
    });

    // Checkboxes (single)
    const booleanFields = ['almanya_yasam', 'aktif_kod', 'acik_kaynak', 'kendi_proje',
                          'gonullu_proje', 'profesyonel_destek_verebilir',
                          'profesyonel_destek_almak', 'aratilabilir', 'iletisim_izni'];
    booleanFields.forEach(field => {
      const checkbox = document.getElementById(field);
      if (checkbox && profileData[field] === true) {
        checkbox.checked = true;
      }
    });

    // Checkbox groups (arrays)
    const arrayFields = [
      { name: 'guclu_alanlar', field: 'guclu_alanlar' },
      { name: 'programlama_dilleri', field: 'programlama_dilleri' },
      { name: 'framework_platformlar', field: 'framework_platformlar' },
      { name: 'devops_cloud', field: 'devops_cloud' },
      { name: 'ilgi_konular', field: 'ilgi_konular' },
      { name: 'ogrenmek_istenen', field: 'ogrenmek_istenen' },
      { name: 'isbirligi_turu', field: 'isbirligi_turu' }
    ];

    arrayFields.forEach(({ name, field }) => {
      const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
      if (Array.isArray(profileData[field])) {
        checkboxes.forEach(checkbox => {
          checkbox.checked = profileData[field].includes(checkbox.value);
        });
      }
    });
  }

  async function loadProfile() {
    try {
      const token = await getSessionToken();
      if (!token) {
        window.location.href = 'list.html';
        return;
      }

      const response = await fetch('/api/devuser-me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Profil yüklenemedi');
      }

      const result = await response.json();
      if (!result.data) {
        throw new Error('Profil bulunamadı');
      }

      populateForm(result.data);

      loadingState.style.display = 'none';
      mainContent.style.display = 'block';
    } catch (error) {
      console.error('Profile load failed:', error);
      window.location.href = 'list.html';
    }
  }

  // Cancel button
  cancelBtn.addEventListener('click', () => {
    window.location.href = 'list.html';
  });

  // Initialize
  loadProfile();
</script>
```

**Step 2: Test form population**

Run: profile-edit.html'ye git
Expected: Mevcut profil verileri formda görüntüleniyor

**Step 3: Commit**

```bash
git add devuser/profile-edit.html
git commit -m "feat: add form population logic to profile-edit.html"
```

---

### Task 11: JavaScript - Form Validation Ekleyin

**Files:**
- Modify: `devuser/profile-edit.html`

**Step 1: Add validation functions**

Script tag'ine, populateForm'dan sonra ekle:

```javascript
function validateForm() {
  const fieldErrors = {};

  // Required field: ad_soyad
  const adSoyad = document.getElementById('ad_soyad').value.trim();
  if (!adSoyad || adSoyad.length < 2) {
    fieldErrors.ad_soyad = 'Ad Soyad en az 2 karakter olmalı';
  }

  // URL validation
  const linkedinUrl = document.getElementById('linkedin_url').value.trim();
  if (linkedinUrl) {
    try {
      new URL(linkedinUrl);
      if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
        fieldErrors.linkedin_url = 'Geçerli bir URL girin';
      }
    } catch {
      fieldErrors.linkedin_url = 'Geçerli bir URL girin';
    }
  }

  const projeLink = document.getElementById('proje_link').value.trim();
  if (projeLink) {
    try {
      new URL(projeLink);
      if (!projeLink.startsWith('http://') && !projeLink.startsWith('https://')) {
        fieldErrors.proje_link = 'Geçerli bir URL girin';
      }
    } catch {
      fieldErrors.proje_link = 'Geçerli bir URL girin';
    }
  }

  // Phone validation
  const whatsappTel = document.getElementById('whatsapp_tel').value.trim();
  if (whatsappTel) {
    const digits = whatsappTel.replace(/[^0-9]/g, '');
    if (digits.length < 8 || digits.length > 15) {
      fieldErrors.whatsapp_tel = 'Telefon 8-15 haneli olmalı';
    }
  }

  // Clear previous errors
  document.querySelectorAll('.form-group input.error, .form-group select.error').forEach(el => {
    el.classList.remove('error');
  });
  document.querySelectorAll('.error-text').forEach(el => {
    el.remove();
  });

  // Show new errors
  Object.entries(fieldErrors).forEach(([field, error]) => {
    const input = document.getElementById(field);
    if (input) {
      input.classList.add('error');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-text';
      errorDiv.textContent = error;
      input.parentNode.appendChild(errorDiv);
    }
  });

  return Object.keys(fieldErrors).length === 0;
}
```

**Step 2: Test validation**

Run: Boş ad_soyad ile kaydetmeye çalış
Expected: "Ad Soyad en az 2 karakter olmalı" hatası gösteriliyor

**Step 3: Commit**

```bash
git add devuser/profile-edit.html
git commit -m "feat: add client-side form validation to profile-edit.html"
```

---

### Task 12: JavaScript - Form Submission Ekleyin

**Files:**
- Modify: `devuser/profile-edit.html`

**Step 1: Add form serialization and submission**

ValidateForm'dan sonra ekle:

```javascript
function serializeForm() {
  const formData = {
    ad_soyad: document.getElementById('ad_soyad').value.trim(),
    sehir: document.getElementById('sehir').value.trim(),
    linkedin_url: document.getElementById('linkedin_url').value.trim(),
    whatsapp_tel: document.getElementById('whatsapp_tel').value.trim(),
    rol: document.getElementById('rol').value,
    deneyim_seviye: document.getElementById('deneyim_seviye').value,
    is_arama_durumu: document.getElementById('is_arama_durumu').value,
    freelance_aciklik: document.getElementById('freelance_aciklik').value,
    katilma_amaci: document.getElementById('katilma_amaci').value,
    proje_link: document.getElementById('proje_link').value.trim(),
    almanya_yasam: document.getElementById('almanya_yasam').checked,
    aktif_kod: document.getElementById('aktif_kod').checked,
    acik_kaynak: document.getElementById('acik_kaynak').checked,
    kendi_proje: document.getElementById('kendi_proje').checked,
    gonullu_proje: document.getElementById('gonullu_proje').checked,
    profesyonel_destek_verebilir: document.getElementById('profesyonel_destek_verebilir').checked,
    profesional_destek_almak: document.getElementById('profesyonel_destek_almak').checked,
    aratilabilir: document.getElementById('aratilabilir').checked,
    iletisim_izni: document.getElementById('iletisim_izni').checked,
  };

  // Checkbox groups
  const arrayFields = ['guclu_alanlar', 'programlama_dilleri', 'framework_platformlar',
                      'devops_cloud', 'ilgi_konular', 'ogrenmek_istenen', 'isbirligi_turu'];

  arrayFields.forEach(field => {
    const checkboxes = document.querySelectorAll(`input[name="${field}"]:checked`);
    formData[field] = Array.from(checkboxes).map(cb => cb.value);
  });

  return formData;
}

async function saveProfile() {
  if (!validateForm()) {
    return;
  }

  statusMessage.className = 'status-message';
  statusMessage.textContent = '';
  statusMessage.style.display = 'none';

  saveBtn.disabled = true;
  saveBtn.textContent = 'Güncelleniyor...';

  try {
    const token = await getSessionToken();
    if (!token) {
      showStatus('Oturum süresi doldu. Lütfen tekrar giriş yapın.', 'error');
      setTimeout(() => window.location.href = 'list.html', 2000);
      return;
    }

    const formData = serializeForm();

    const response = await fetch('/api/devuser-update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.field_errors) {
        // Show field errors
        Object.entries(result.field_errors).forEach(([field, error]) => {
          const input = document.getElementById(field);
          if (input) {
            input.classList.add('error');
            let errorDiv = input.parentNode.querySelector('.error-text');
            if (!errorDiv) {
              errorDiv = document.createElement('div');
              errorDiv.className = 'error-text';
              input.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = error;
          }
        });
        showStatus('Lütfen hataları düzeltin.', 'error');
      } else {
        showStatus(result.error || 'Güncelleme başarısız.', 'error');
      }
      return;
    }

    showStatus('Profil başarıyla güncellendi!', 'success');
    setTimeout(() => window.location.href = 'list.html', 1500);
  } catch (error) {
    console.error('Save failed:', error);
    showStatus('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Kaydet';
  }
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = 'block';
}

// Save button
saveBtn.addEventListener('click', saveProfile);
```

Not: profesyonel_destek_almak'da typo var, düzelt:
```javascript
profesyonel_destek_almak: document.getElementById('profesyonel_destek_almak').checked,
```

**Step 2: Test form submission**

Run: Formu doldur ve kaydet
Expected: Başarı mesajı gösteriliyor, list.html'e yönlendiriliyor

**Step 3: Commit**

```bash
git add devuser/profile-edit.html
git commit -m "feat: add form submission logic to profile-edit.html"
```

---

### Task 13: Entegre Test ve Düzeltmeler

**Files:**
- Test: Manual testing

**Step 1: Test complete flow**

1. list.html'ye git ve giriş yap
2. "Profil Düzenle" butonuna tıkla
3. Form dolu geliyor mu kontrol et
4. Bazı alanları değiştir
5. Kaydet
6. list.html'ye yönlendiriliyor mu kontrol et
7. Listeyi kontrol et, değişiklikler görünüyor mu

**Step 2: Test error cases**

1. Boş ad_soyad ile kaydetmeye çalış → Hata
2. Geçersiz URL ile kaydet → Hata
3. Geçersiz telefon ile kaydet → Hata
4. Oturum olmadan profile-edit.html'e git → list.html'e yönlendir

**Step 3: Fix any bugs**

Run: Herhangi bir bug varsa düzelt

**Step 4: Test on mobile**

Run: Mobil cihazda veya devtools mobile emulation'da test et
Expected: Tüm alanlar erişilebilir, butonlar çalışıyor

**Step 5: Commit any fixes**

```bash
git add .
git commit -m "fix: resolve bugs found during testing"
```

---

### Task 14: Final Cleanup ve Documentation

**Files:**
- Modify: Git commit

**Step 1: Remove debug code**

Eğer varsa debug kodlarını temizle (console.log, temp test functions vb.)

**Step 2: Verify all files**

Check:
- list.html has "Profil Düzenle" button ✓
- api/devuser-update.js has all validation ✓
- profile-edit.html has all form sections ✓
- profile-edit.html has working JavaScript ✓
- devuserlist.css has necessary styles ✓

**Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete profile editing system

- Add 'Profil Düzenle' button to list.html
- Create /api/devuser-update PATCH endpoint with validation
- Create profile-edit.html with full form
- Implement client-side validation and form submission
- Support mobile responsive design
- Security: RLS + auth checks + CORS"
```

---

### Task 15: Push to Production

**Files:**
- None

**Step 1: Push to GitHub**

```bash
git push origin main
```

**Step 2: Verify deployment**

Run: production site'ye git ve test et
Expected: Tüm özellikler çalışıyor

---

## Summary

Bu implementation plan şu dosyaları oluşturur/modifiye eder:

**New files:**
- `api/devuser-update.js` - PATCH endpoint
- `devuser/profile-edit.html` - Profile edit page

**Modified files:**
- `devuser/list.html` - Add "Profil Düzenle" button
- `devuser/devuserlist.css` - Add form styling

**Features:**
- Full profile editing with all devuser fields
- Client-side and server-side validation
- Authentication via Supabase JWT
- RLS security
- Mobile responsive design
- Error handling and user feedback
