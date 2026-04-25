import crypto from 'crypto';

const DEFAULT_KEY_HASH_ITERATIONS = 210000;

export function createPasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, DEFAULT_KEY_HASH_ITERATIONS, 32, 'sha256').toString('hex');
  return { salt, hash, iterations: DEFAULT_KEY_HASH_ITERATIONS };
}

export function verifyPasswordHash(password: string, salt: string, expectedHash: string, iterations: number) {
  if (!password || !salt || !expectedHash) return false;
  const safeIterations = Number.isFinite(iterations) && iterations > 1000 ? iterations : DEFAULT_KEY_HASH_ITERATIONS;
  const computedHash = crypto.pbkdf2Sync(password, salt, safeIterations, 32, 'sha256').toString('hex');
  const left = Buffer.from(computedHash, 'hex');
  const right = Buffer.from(expectedHash, 'hex');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

