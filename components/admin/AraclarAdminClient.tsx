'use client';

import { useMemo, useState } from 'react';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAdminGate } from '@/hooks/useAdminGate';
import { TOOL_CATALOG, getToolHref } from '@/lib/tools/catalog';
import { TOOL_QUESTIONNAIRE_REGISTRY } from '@/lib/tools/surveys';
import type { ToolCatalogItem } from '@/lib/tools/types';
import { cn } from '@/lib/utils/cn';

/**
 * Read-only operator overview of every interactive planning tool.
 *
 * The data is derived from two sources that should agree but historically have
 * not:
 *  - `TOOL_CATALOG` — the marketing/display catalog (title, description,
 *    category, and a hand-written `questionCount`).
 *  - `TOOL_QUESTIONNAIRE_REGISTRY` — the real questionnaire configs. Every
 *    registered config is validated to contain exactly 15 questions, so this is
 *    the authoritative question count.
 *
 * We show the real count and flag any tool whose catalog `questionCount`
 * disagrees, so an operator can spot stale display metadata at a glance.
 */

interface ToolRow {
  slug: string;
  title: string;
  description: string;
  category: ToolCatalogItem['category'];
  /** Hand-written count from the display catalog. */
  catalogQuestionCount: number;
  /** Authoritative count from the questionnaire registry (null if unregistered). */
  realQuestionCount: number | null;
  /** True when catalog and registry disagree. */
  mismatch: boolean;
}

const CATEGORY_TONE: Record<ToolCatalogItem['category'], SiteTone> = {
  'Rota ve Strateji': 'blue',
  'Kariyer ve Gelir': 'green',
  'Hazırlık ve Yerleşim': 'yellow',
  'Yaşam ve Destek': 'red',
};

function buildRows(): ToolRow[] {
  return TOOL_CATALOG.map((tool) => {
    const config = (TOOL_QUESTIONNAIRE_REGISTRY as Record<string, { questions: unknown[] } | undefined>)[
      tool.slug
    ];
    const realQuestionCount = config ? config.questions.length : null;

    return {
      slug: tool.slug,
      title: tool.title,
      description: tool.description,
      category: tool.category,
      catalogQuestionCount: tool.questionCount,
      realQuestionCount,
      mismatch: realQuestionCount !== null && realQuestionCount !== tool.questionCount,
    };
  });
}

export function AraclarAdminClient() {
  const gateStatus = useAdminGate();
  const [filter, setFilter] = useState('');

  const rows = useMemo(buildRows, []);

  const totals = useMemo(() => {
    const registered = rows.filter((row) => row.realQuestionCount !== null);
    const mismatches = rows.filter((row) => row.mismatch);
    const totalQuestions = registered.reduce((sum, row) => sum + (row.realQuestionCount ?? 0), 0);
    return {
      toolCount: rows.length,
      registeredCount: registered.length,
      mismatchCount: mismatches.length,
      totalQuestions,
    };
  }, [rows]);

  const query = filter.trim().toLowerCase();
  const visible = query
    ? rows.filter(
        (row) =>
          row.title.toLowerCase().includes(query) ||
          row.slug.toLowerCase().includes(query) ||
          row.category.toLowerCase().includes(query),
      )
    : rows;

  if (gateStatus !== 'authed') {
    return (
      <div className="bg-page text-ink">
        <div className="container py-20 text-center text-sm text-muted">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-page text-ink">
      <AdminPageHeader
        eyebrow="Araçlar"
        title="İnteraktif Araçlar"
        description="Sitedeki interaktif planlama araçlarının tam listesi: her aracın kategorisi, açıklaması ve gerçek soru sayısı. Soru sayısı, ankete kayıtlı asıl yapılandırmadan (questionnaire registry) okunur. Katalogdaki gösterim değeri farklıysa uyuşmazlık rozeti ile işaretlenir."
      />

      <section className="space-y-6 px-4 pt-8 sm:px-6 lg:px-9">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Toplam Araç" value={totals.toolCount} tone="blue" />
          <SummaryCard label="Ankete Kayıtlı" value={totals.registeredCount} tone="green" />
          <SummaryCard label="Toplam Soru" value={totals.totalQuestions} tone="yellow" />
          <SummaryCard
            label="Katalog Uyuşmazlığı"
            value={totals.mismatchCount}
            tone={totals.mismatchCount > 0 ? 'red' : 'muted'}
          />
        </div>

        <div className="max-w-md">
          <label className="block">
            <span className="sr-only">Araç ara</span>
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Araç ara (ör. maaş, şehir, vize)..."
              className={ADMIN_CONTROL_CLASS}
            />
          </label>
        </div>
      </section>

      <div className="space-y-4 px-4 py-8 sm:px-6 lg:px-9">
        {visible.length === 0 ? (
          <AdminEmptyState title={`“${filter}” için araç bulunamadı.`} />
        ) : (
          visible.map((row) => (
            <Card key={row.slug} variant="hoverable">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip tone={CATEGORY_TONE[row.category]} className="uppercase tracking-[0.14em]">
                      {row.category}
                    </Chip>
                    {row.mismatch ? (
                      <Chip tone="red">⚠ Katalog: {row.catalogQuestionCount} soru</Chip>
                    ) : null}
                  </div>

                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">{row.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{row.description}</p>
                  <p className="mt-3 font-mono text-xs text-muted">/{row.slug}</p>
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-3 md:w-44">
                  <div className="rounded-card border border-line bg-band px-4 py-3 text-center">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Soru sayısı</p>
                    <p className="mt-1 text-3xl font-extrabold text-ink">
                      {row.realQuestionCount ?? '—'}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      {row.realQuestionCount === null ? 'Ankete kayıtlı değil' : 'Gerçek (anket)'}
                    </p>
                  </div>
                  <Button href={getToolHref(row.slug)} external>
                    Araca git
                    <span aria-hidden="true">↗</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: SiteTone | 'muted' }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={cn('mt-2 text-3xl font-extrabold', tone === 'muted' ? 'text-muted' : TONE_STYLES[tone].text)}>
        {value}
      </p>
    </Card>
  );
}
