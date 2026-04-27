export type FounderSubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface FounderEventSlot {
  id: string;
  title: string | null;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLength);
}

export function sanitizePhone(value: unknown, maxLength = 32): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLength);
}

export function sanitizeUrl(value: unknown, maxLength = 240): string {
  if (typeof value !== 'string') return '';
  const raw = value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLength);
  if (!raw) return '';

  try {
    const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

export function sanitizeLinkedinUrl(value: unknown): string {
  const normalized = sanitizeUrl(value, 240);
  if (!normalized) return '';

  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();
    if (host === 'linkedin.com' || host === 'www.linkedin.com' || host.endsWith('.linkedin.com')) {
      return parsed.toString();
    }
  } catch {
    return '';
  }

  return '';
}

export function sanitizeUuidArray(value: unknown, maxItems = 20): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string' && isUuid(item))
    .map((item) => String(item).trim().toLowerCase())
    .slice(0, maxItems);
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '').trim());
}

export function normalizeFounderStatus(value: unknown): FounderSubmissionStatus {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'approved' || raw === 'rejected') return raw;
  return 'pending';
}

export function formatFounderSlotLabel(slot: Pick<FounderEventSlot, 'title' | 'starts_at' | 'ends_at'>): string {
  const start = new Date(slot.starts_at);
  const end = slot.ends_at ? new Date(slot.ends_at) : null;
  const datePart = Number.isNaN(start.getTime())
    ? slot.starts_at
    : start.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  const timePart = Number.isNaN(start.getTime())
    ? ''
    : start.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const endPart = end && !Number.isNaN(end.getTime())
    ? end.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '';
  const range = timePart ? `${timePart}${endPart ? ` - ${endPart}` : ''}` : '';
  const title = sanitizeText(slot.title ?? '', 120);

  if (title && range) return `${title} • ${datePart} • ${range}`;
  if (title) return `${title} • ${datePart}`;
  if (range) return `${datePart} • ${range}`;
  return datePart;
}
