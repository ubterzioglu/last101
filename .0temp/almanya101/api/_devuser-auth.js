import crypto from 'crypto';

const TOKEN_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function toBase64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}

function getAuthSecret() {
  return process.env.DEVUSER_AUTH_SECRET || '';
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

export function isValidPin(pin) {
  if (typeof pin !== 'string') return false;
  return /^\d{6}$/.test(pin.trim());
}

export function createPinHash(pin) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(pin, salt, 120000, 32, 'sha256').toString('hex');
  return { salt, hash };
}

export function verifyPin(pin, salt, expectedHash) {
  if (!isValidPin(pin)) return false;
  if (!salt || !expectedHash) return false;

  const computed = crypto.pbkdf2Sync(pin.trim(), salt, 120000, 32, 'sha256').toString('hex');
  const left = Buffer.from(computed, 'hex');
  const right = Buffer.from(expectedHash, 'hex');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function createSessionToken({ email, userId }) {
  const secret = getAuthSecret();
  if (!secret) return null;

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    email,
    userId,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const payloadPart = toBase64Url(JSON.stringify(payload));
  const signature = sign(payloadPart, secret);
  return `${payloadPart}.${signature}`;
}

export function verifySessionToken(token) {
  if (typeof token !== 'string') return null;
  const secret = getAuthSecret();
  if (!secret) return null;

  const trimmed = token.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 2) return null;

  const [payloadPart, signature] = parts;
  const expectedSignature = sign(payloadPart, secret);
  if (signature !== expectedSignature) return null;

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(payloadPart).toString('utf8'));
  } catch {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;
  if (!payload.exp || Number(payload.exp) < Math.floor(Date.now() / 1000)) return null;
  if (!payload.email || !isValidEmail(payload.email)) return null;
  if (!payload.userId || typeof payload.userId !== 'string') return null;

  return payload;
}
