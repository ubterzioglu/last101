export type NewsCategory = 'almanya' | 'turkiye' | 'avrupa' | 'dunya' | 'duyuru';

export type NewsStatus =
  | 'pending_review'
  | 'draft'
  | 'published'
  | 'rejected'
  | 'archived';

export interface NewsListItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: NewsCategory;
  categoryLabel: string;
  publishedAt: string;
  publishedLabel: string;
  sourceName: string;
  sourceUrl?: string;
  sourcePublishedAt?: string | null;
  sourcePublishedLabel?: string;
  readingMinutes: number;
  whatsappShareText: string;
}

export interface PublicNewsArticle extends NewsListItem {
  content: string | null;
  coverImageCredit?: string;
  relevanceScore?: number | null;
  relevanceReason?: string | null;
}

export interface PublicNewsListResponse {
  items: NewsListItem[];
  nextCursor: string | null;
}

export interface NewsPostAdminRecord {
  id: string;
  raw_item_id: string | null;
  slug: string;
  title: string;
  category: NewsCategory;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_credit: string | null;
  source_name: string | null;
  source_url: string | null;
  source_published_at: string | null;
  status: NewsStatus;
  is_featured: boolean;
  featured_rank: number | null;
  reading_minutes: number;
  whatsapp_share_text: string | null;
  relevance_score: number | null;
  relevance_reason: string | null;
  ai_model: string | null;
  ai_generated_fields: Record<string, unknown> | null;
  editor_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  show_in_carousel: boolean | null;
}

export interface NewsSourceRecord {
  id: string;
  name: string;
  source_type: 'rss' | 'mrss' | 'api' | 'manual';
  feed_url: string | null;
  homepage_url: string | null;
  default_category: NewsCategory;
  language_code: string | null;
  country_code: string | null;
  usage_mode: 'signal_only' | 'short_excerpt_allowed' | 'licensed' | 'manual_only';
  priority: number;
  is_active: boolean;
  fetch_limit: number;
  last_fetched_at: string | null;
  last_success_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsIngestRunRecord {
  id: string;
  trigger_type: 'cron' | 'manual' | 'retry' | 'source_test';
  status: 'running' | 'success' | 'partial' | 'failed';
  started_at: string;
  finished_at: string | null;
  source_count: number;
  fetched_count: number;
  inserted_count: number;
  duplicate_count: number;
  error_count: number;
  log_json: Record<string, unknown>;
  created_at: string;
}

export interface NewsPipelineSettingsRecord {
  id: true;
  pipeline_enabled: boolean;
  ai_enabled: boolean;
  ai_daily_limit: number;
  max_items_per_source: number;
  raw_retention_days: number;
  ingest_run_retention_days: number;
  rejected_posts_retention_days: number;
  auto_create_pending_review: boolean;
  excluded_keywords: string[];
  high_priority_keywords: string[];
  created_at: string;
  updated_at: string;
}
