import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import {
  buildStableNewsSlug,
  buildWhatsAppShareText,
  getNewsCategoryLabel,
  normalizeNewsCategory,
  normalizeNewsStatus,
  slugifyNewsTitle,
} from '@/lib/news/shared';
import type {
  NewsCategory,
  NewsIngestRunRecord,
  NewsPipelineSettingsRecord,
  NewsPostAdminRecord,
  NewsSourceRecord,
  NewsStatus,
} from '@/types/news';
import { CANONICAL_SITE_URL } from '@/lib/utils/constants';

export const NEWS_POST_SELECT = `
  id,
  raw_item_id,
  slug,
  title,
  category,
  summary,
  content,
  cover_image_url,
  cover_image_alt,
  cover_image_credit,
  source_name,
  source_url,
  source_published_at,
  status,
  is_featured,
  featured_rank,
  reading_minutes,
  whatsapp_share_text,
  relevance_score,
  relevance_reason,
  ai_model,
  ai_generated_fields,
  editor_notes,
  reviewed_at,
  reviewed_by,
  published_at,
  created_at,
  updated_at,
  show_in_carousel
`;

export const NEWS_SOURCE_SELECT = `
  id,
  name,
  source_type,
  feed_url,
  homepage_url,
  default_category,
  language_code,
  country_code,
  usage_mode,
  priority,
  is_active,
  fetch_limit,
  last_fetched_at,
  last_success_at,
  last_error,
  created_at,
  updated_at
`;

export const NEWS_RUN_SELECT = `
  id,
  trigger_type,
  status,
  started_at,
  finished_at,
  source_count,
  fetched_count,
  inserted_count,
  duplicate_count,
  error_count,
  log_json,
  created_at
`;

export const NEWS_SETTINGS_SELECT = `
  id,
  pipeline_enabled,
  ai_enabled,
  ai_daily_limit,
  max_items_per_source,
  raw_retention_days,
  ingest_run_retention_days,
  rejected_posts_retention_days,
  auto_create_pending_review,
  excluded_keywords,
  high_priority_keywords,
  created_at,
  updated_at
`;

type JsonRecord = Record<string, unknown>;

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function normalizeText(value: unknown, maxLength: number, fallback = ''): string {
  return String(value ?? fallback).trim().slice(0, maxLength);
}

function normalizeNullableText(value: unknown, maxLength: number): string | null {
  const safe = normalizeText(value, maxLength);
  return safe || null;
}

function normalizeOptionalUrl(value: unknown): string | null {
  const safe = normalizeText(value, 1000);
  if (!safe) return null;
  try {
    const parsed = new URL(safe);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function normalizeInteger(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  const safe = String(value || '').trim().toLowerCase();
  if (!safe) return fallback;
  if (['true', '1', 'yes', 'on'].includes(safe)) return true;
  if (['false', '0', 'no', 'off'].includes(safe)) return false;
  return fallback;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 100);
}

function normalizeJsonRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function normalizeIsoDate(value: unknown): string | null {
  const safe = normalizeText(value, 100);
  if (!safe) return null;
  const parsed = new Date(safe);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function normalizeCategoryFilter(value: unknown): NewsCategory | 'all' {
  const safe = String(value || '').trim();
  return !safe || safe === 'all' ? 'all' : normalizeNewsCategory(safe);
}

function normalizeStatusFilter(value: unknown): NewsStatus | 'all' {
  const safe = String(value || '').trim();
  return !safe || safe === 'all' ? 'all' : normalizeNewsStatus(safe);
}

function getActorIdentity(request: NextRequest): string {
  return normalizeText(request.headers.get('x-admin-email') || 'admin@almanya101.de', 120, 'admin@almanya101.de');
}

export function getNewsServiceClient(): SupabaseClient {
  const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY
  );

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Service not configured');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function recordEditorAction(params: {
  client: SupabaseClient;
  postId: string;
  actor: string;
  actionType: string;
  note?: string | null;
  metadata?: JsonRecord;
}) {
  const { client, postId, actor, actionType, note, metadata } = params;
  await client.from('news_editor_actions').insert([
    {
      post_id: postId,
      actor_user_id: actor,
      action_type: actionType,
      note: note || null,
      metadata: metadata || {},
    },
  ]);
}

function createDefaultWhatsappText(title: string, summary: string | null, slug: string): string {
  return buildWhatsAppShareText({
    title,
    summary,
    slug,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL,
  });
}

function buildPostPayload(body: JsonRecord, existing?: Partial<NewsPostAdminRecord>) {
  const nextTitle = normalizeText(body.title, 200);
  if (!nextTitle) throw new Error('title is required');

  const slugInput = normalizeText(body.slug, 200);
  const slug = slugInput
    ? slugifyNewsTitle(slugInput) || buildStableNewsSlug(nextTitle, existing?.id || crypto.randomUUID())
    : existing?.slug || buildStableNewsSlug(nextTitle, existing?.id || crypto.randomUUID());

  const category = normalizeNewsCategory(body.category || existing?.category || 'almanya');
  const status = normalizeNewsStatus(body.status || existing?.status || 'draft');
  const publishedAtInput = normalizeIsoDate(body.published_at);
  const publishedAt =
    status === 'published'
      ? (publishedAtInput || existing?.published_at || new Date().toISOString())
      : (body.published_at === null ? null : (publishedAtInput || (status === 'draft' ? null : existing?.published_at || null)));

  const summary = normalizeNullableText(body.summary, 800);
  const payload = {
    slug,
    title: nextTitle,
    category,
    summary,
    content: normalizeNullableText(body.content, 200000),
    cover_image_url: normalizeOptionalUrl(body.cover_image_url ?? body.coverImageUrl ?? existing?.cover_image_url),
    cover_image_alt: normalizeNullableText(body.cover_image_alt ?? body.coverImageAlt ?? existing?.cover_image_alt ?? nextTitle, 220),
    cover_image_credit: normalizeNullableText(body.cover_image_credit ?? body.coverImageCredit ?? existing?.cover_image_credit, 220),
    source_name: normalizeNullableText(body.source_name ?? body.sourceName ?? existing?.source_name ?? 'Almanya101', 120),
    source_url: normalizeOptionalUrl(body.source_url ?? body.sourceUrl ?? existing?.source_url),
    source_published_at: normalizeIsoDate(body.source_published_at ?? body.sourcePublishedAt ?? existing?.source_published_at),
    status,
    is_featured: normalizeBoolean(body.is_featured ?? body.isFeatured ?? existing?.is_featured, Boolean(existing?.is_featured)),
    featured_rank: body.featured_rank === null || body.featuredRank === null
      ? null
      : normalizeInteger(body.featured_rank ?? body.featuredRank, 1, 999, existing?.featured_rank || 1),
    reading_minutes: normalizeInteger(body.reading_minutes ?? body.readingMinutes, 1, 60, existing?.reading_minutes || 3),
    whatsapp_share_text: normalizeNullableText(
      body.whatsapp_share_text ?? body.whatsappShareText ?? existing?.whatsapp_share_text,
      2000
    ) || createDefaultWhatsappText(nextTitle, summary, slug),
    relevance_score: body.relevance_score === null || body.relevanceScore === null
      ? null
      : normalizeInteger(body.relevance_score ?? body.relevanceScore, 0, 100, existing?.relevance_score ?? 0),
    relevance_reason: normalizeNullableText(body.relevance_reason ?? body.relevanceReason ?? existing?.relevance_reason, 500),
    ai_model: normalizeNullableText(body.ai_model ?? body.aiModel ?? existing?.ai_model, 120),
    ai_generated_fields: normalizeJsonRecord(body.ai_generated_fields ?? body.aiGeneratedFields ?? existing?.ai_generated_fields),
    editor_notes: normalizeNullableText(body.editor_notes ?? body.editorNotes ?? existing?.editor_notes, 4000),
    reviewed_at: status === 'published' || status === 'rejected' || status === 'archived'
      ? (existing?.reviewed_at || new Date().toISOString())
      : existing?.reviewed_at || null,
    reviewed_by: status === 'published' || status === 'rejected' || status === 'archived'
      ? normalizeNullableText(body.reviewed_by ?? body.reviewedBy ?? existing?.reviewed_by ?? 'admin@almanya101.de', 120)
      : existing?.reviewed_by || null,
    published_at: publishedAt,
    show_in_carousel: normalizeBoolean(body.show_in_carousel ?? body.showInCarousel ?? existing?.show_in_carousel, Boolean(existing?.show_in_carousel)),
    updated_at: new Date().toISOString(),
  };

  return payload;
}

export async function listAdminPosts(params: {
  request: NextRequest;
  client?: SupabaseClient;
}) {
  const client = params.client || getNewsServiceClient();
  const searchParams = params.request.nextUrl.searchParams;
  const status = normalizeStatusFilter(searchParams.get('status'));
  const category = normalizeCategoryFilter(searchParams.get('category'));
  const q = normalizeText(searchParams.get('q'), 120);
  const limit = normalizeInteger(searchParams.get('limit'), 1, 200, 50);
  const source = normalizeText(searchParams.get('source'), 120);
  const featured = searchParams.get('featured');

  let query = client
    .from('news_posts')
    .select(NEWS_POST_SELECT)
    .order('is_featured', { ascending: false })
    .order('featured_rank', { ascending: true, nullsFirst: false })
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status !== 'all') query = query.eq('status', status);
  if (category !== 'all') query = query.eq('category', category);
  if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
  if (source) query = query.ilike('source_name', `%${source}%`);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (featured === 'false') query = query.eq('is_featured', false);

  const countByStatus = (target: NewsStatus | 'all') => {
    let countQuery = client.from('news_posts').select('id', { count: 'exact', head: true });
    if (category !== 'all') countQuery = countQuery.eq('category', category);
    if (target !== 'all') countQuery = countQuery.eq('status', target);
    return countQuery;
  };

  const [{ data, error }, total, pending, draft, published, rejected, archived] = await Promise.all([
    query,
    countByStatus('all'),
    countByStatus('pending_review'),
    countByStatus('draft'),
    countByStatus('published'),
    countByStatus('rejected'),
    countByStatus('archived'),
  ]);

  if (error) throw error;

  return {
    items: (data || []) as NewsPostAdminRecord[],
    stats: {
      total: Number(total.count || 0),
      pending_review: Number(pending.count || 0),
      draft: Number(draft.count || 0),
      published: Number(published.count || 0),
      rejected: Number(rejected.count || 0),
      archived: Number(archived.count || 0),
    },
  };
}

export async function getAdminPostDetail(id: string, client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const { data: post, error } = await serviceClient
    .from('news_posts')
    .select(NEWS_POST_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!post) return null;

  const [rawResult, actionsResult] = await Promise.all([
    post.raw_item_id
      ? serviceClient
          .from('news_raw_items')
          .select('id, source_id, ingest_run_id, canonical_url, original_title, original_description, original_image_url, original_published_at, unique_hash, is_duplicate, duplicate_reason, possible_duplicate, raw_payload, fetched_at, created_at')
          .eq('id', post.raw_item_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    serviceClient
      .from('news_editor_actions')
      .select('id, actor_user_id, action_type, note, metadata, created_at')
      .eq('post_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (rawResult.error) throw rawResult.error;
  if (actionsResult.error) throw actionsResult.error;

  return {
    post: post as NewsPostAdminRecord,
    rawItem: rawResult.data,
    actions: actionsResult.data || [],
  };
}

export async function createAdminPost(request: NextRequest, body: JsonRecord, client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const actor = getActorIdentity(request);
  const newId = crypto.randomUUID();
  const payload = buildPostPayload(body, { id: newId, slug: '' } as Partial<NewsPostAdminRecord>);
  const insertPayload = {
    id: newId,
    ...payload,
    reviewed_by: payload.reviewed_by || actor,
  };

  const { data, error } = await serviceClient
    .from('news_posts')
    .insert([insertPayload])
    .select(NEWS_POST_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Record not created');

  await recordEditorAction({
    client: serviceClient,
    postId: data.id,
    actor,
    actionType: 'create',
    metadata: {
      status: data.status,
      category: data.category,
    },
  });

  return data as NewsPostAdminRecord;
}

export async function updateAdminPost(request: NextRequest, id: string, body: JsonRecord, client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const actor = getActorIdentity(request);
  const existing = await getAdminPostDetail(id, serviceClient);
  if (!existing) return null;

  const payload = buildPostPayload(body, existing.post);
  const { data, error } = await serviceClient
    .from('news_posts')
    .update(payload)
    .eq('id', id)
    .select(NEWS_POST_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  await recordEditorAction({
    client: serviceClient,
    postId: id,
    actor,
    actionType: 'update',
    metadata: {
      status: data.status,
      category: data.category,
      slug: data.slug,
    },
  });

  return data as NewsPostAdminRecord;
}

export async function setAdminPostStatus(
  request: NextRequest,
  id: string,
  status: NewsStatus,
  note?: string | null,
  client?: SupabaseClient
) {
  const serviceClient = client || getNewsServiceClient();
  const actor = getActorIdentity(request);
  const current = await getAdminPostDetail(id, serviceClient);
  if (!current) return null;

  const updatePayload: Partial<NewsPostAdminRecord> & JsonRecord = {
    status,
    reviewed_at: new Date().toISOString(),
    reviewed_by: actor,
    updated_at: new Date().toISOString(),
  };

  if (status === 'published') {
    updatePayload.published_at = current.post.published_at || new Date().toISOString();
  } else if (status !== 'archived') {
    updatePayload.published_at = null;
  }

  const { data, error } = await serviceClient
    .from('news_posts')
    .update(updatePayload)
    .eq('id', id)
    .select(NEWS_POST_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const actionType = status === 'published' ? 'publish' : status === 'rejected' ? 'reject' : 'archive';
  await recordEditorAction({
    client: serviceClient,
    postId: id,
    actor,
    actionType,
    note,
    metadata: { status },
  });

  return data as NewsPostAdminRecord;
}

export async function setAdminPostFeatured(
  request: NextRequest,
  id: string,
  params: { isFeatured: boolean; featuredRank?: number | null },
  client?: SupabaseClient
) {
  const serviceClient = client || getNewsServiceClient();
  const actor = getActorIdentity(request);
  const payload = {
    is_featured: params.isFeatured,
    featured_rank: params.isFeatured ? normalizeInteger(params.featuredRank, 1, 999, 1) : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await serviceClient
    .from('news_posts')
    .update(payload)
    .eq('id', id)
    .select(NEWS_POST_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  await recordEditorAction({
    client: serviceClient,
    postId: id,
    actor,
    actionType: 'feature',
    metadata: payload,
  });

  return data as NewsPostAdminRecord;
}

export async function deleteAdminPost(request: NextRequest, id: string, client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const actor = getActorIdentity(request);
  await recordEditorAction({
    client: serviceClient,
    postId: id,
    actor,
    actionType: 'archive',
    note: 'Deleted from admin API',
  });

  const { error } = await serviceClient.from('news_posts').delete().eq('id', id);
  if (error) throw error;
}

export async function listNewsSources(client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const { data, error } = await serviceClient
    .from('news_sources')
    .select(NEWS_SOURCE_SELECT)
    .order('is_active', { ascending: false })
    .order('priority', { ascending: false })
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []) as NewsSourceRecord[];
}

export async function createNewsSource(body: JsonRecord, client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const payload = {
    name: normalizeText(body.name, 120),
    source_type: ['rss', 'mrss', 'api', 'manual'].includes(String(body.source_type || body.sourceType))
      ? String(body.source_type || body.sourceType)
      : 'rss',
    feed_url: normalizeOptionalUrl(body.feed_url ?? body.feedUrl),
    homepage_url: normalizeOptionalUrl(body.homepage_url ?? body.homepageUrl),
    default_category: normalizeNewsCategory(body.default_category ?? body.defaultCategory),
    language_code: normalizeNullableText(body.language_code ?? body.languageCode, 12),
    country_code: normalizeNullableText(body.country_code ?? body.countryCode, 12),
    usage_mode: ['signal_only', 'short_excerpt_allowed', 'licensed', 'manual_only'].includes(String(body.usage_mode || body.usageMode))
      ? String(body.usage_mode || body.usageMode)
      : 'signal_only',
    priority: normalizeInteger(body.priority, 0, 100, 50),
    is_active: normalizeBoolean(body.is_active ?? body.isActive, true),
    fetch_limit: normalizeInteger(body.fetch_limit ?? body.fetchLimit, 1, 50, 10),
    updated_at: new Date().toISOString(),
  };

  if (!payload.name) throw new Error('name is required');

  const { data, error } = await serviceClient
    .from('news_sources')
    .insert([payload])
    .select(NEWS_SOURCE_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Source not created');
  return data as NewsSourceRecord;
}

export async function updateNewsSource(id: string, body: JsonRecord, client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const payload = {
    name: normalizeText(body.name, 120),
    source_type: ['rss', 'mrss', 'api', 'manual'].includes(String(body.source_type || body.sourceType))
      ? String(body.source_type || body.sourceType)
      : 'rss',
    feed_url: normalizeOptionalUrl(body.feed_url ?? body.feedUrl),
    homepage_url: normalizeOptionalUrl(body.homepage_url ?? body.homepageUrl),
    default_category: normalizeNewsCategory(body.default_category ?? body.defaultCategory),
    language_code: normalizeNullableText(body.language_code ?? body.languageCode, 12),
    country_code: normalizeNullableText(body.country_code ?? body.countryCode, 12),
    usage_mode: ['signal_only', 'short_excerpt_allowed', 'licensed', 'manual_only'].includes(String(body.usage_mode || body.usageMode))
      ? String(body.usage_mode || body.usageMode)
      : 'signal_only',
    priority: normalizeInteger(body.priority, 0, 100, 50),
    is_active: normalizeBoolean(body.is_active ?? body.isActive, true),
    fetch_limit: normalizeInteger(body.fetch_limit ?? body.fetchLimit, 1, 50, 10),
    last_error: normalizeNullableText(body.last_error ?? body.lastError, 2000),
    updated_at: new Date().toISOString(),
  };

  if (!payload.name) throw new Error('name is required');

  const { data, error } = await serviceClient
    .from('news_sources')
    .update(payload)
    .eq('id', id)
    .select(NEWS_SOURCE_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return data as NewsSourceRecord;
}

export async function listNewsPipelineRuns(client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const { data, error } = await serviceClient
    .from('news_ingest_runs')
    .select(NEWS_RUN_SELECT)
    .order('started_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []) as NewsIngestRunRecord[];
}

export async function getNewsPipelineSettings(client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const { data, error } = await serviceClient
    .from('news_pipeline_settings')
    .select(NEWS_SETTINGS_SELECT)
    .eq('id', true)
    .maybeSingle();
  if (error) throw error;
  return data as NewsPipelineSettingsRecord | null;
}

export async function updateNewsPipelineSettings(body: JsonRecord, client?: SupabaseClient) {
  const serviceClient = client || getNewsServiceClient();
  const payload = {
    pipeline_enabled: normalizeBoolean(body.pipeline_enabled ?? body.pipelineEnabled, true),
    ai_enabled: normalizeBoolean(body.ai_enabled ?? body.aiEnabled, false),
    ai_daily_limit: normalizeInteger(body.ai_daily_limit ?? body.aiDailyLimit, 0, 500, 10),
    max_items_per_source: normalizeInteger(body.max_items_per_source ?? body.maxItemsPerSource, 1, 50, 10),
    raw_retention_days: normalizeInteger(body.raw_retention_days ?? body.rawRetentionDays, 1, 365, 30),
    ingest_run_retention_days: normalizeInteger(body.ingest_run_retention_days ?? body.ingestRunRetentionDays, 1, 365, 90),
    rejected_posts_retention_days: normalizeInteger(body.rejected_posts_retention_days ?? body.rejectedPostsRetentionDays, 1, 3650, 180),
    auto_create_pending_review: normalizeBoolean(body.auto_create_pending_review ?? body.autoCreatePendingReview, true),
    excluded_keywords: normalizeStringArray(body.excluded_keywords ?? body.excludedKeywords),
    high_priority_keywords: normalizeStringArray(body.high_priority_keywords ?? body.highPriorityKeywords),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await serviceClient
    .from('news_pipeline_settings')
    .upsert([{ id: true, ...payload }], { onConflict: 'id' })
    .select(NEWS_SETTINGS_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Settings not updated');
  return data as NewsPipelineSettingsRecord;
}

export async function uploadNewsCoverFile(params: {
  fileName: string;
  file: ArrayBuffer;
  contentType: string;
  slug: string;
  client?: SupabaseClient;
}) {
  const serviceClient = params.client || getNewsServiceClient();
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const extension = params.fileName.includes('.') ? params.fileName.split('.').pop() || 'webp' : 'webp';
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '') || 'webp';
  const path = `news/${year}/${month}/${params.slug}-${Date.now()}.${safeExtension}`;

  const { error } = await serviceClient.storage
    .from('news')
    .upload(path, params.file, {
      contentType: params.contentType || 'image/webp',
      upsert: false,
    });

  if (error) throw error;

  const { data } = serviceClient.storage.from('news').getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export function mapAdminPostToLegacy(item: NewsPostAdminRecord) {
  const category = getNewsCategoryLabel(item.category);
  const status = item.status === 'published' ? 'published' : 'draft';
  return {
    ...item,
    category,
    status,
  };
}
