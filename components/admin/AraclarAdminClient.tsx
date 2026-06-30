'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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

const CATEGORY_ACCENT: Record<ToolCatalogItem['category'], string> = {
  'Rota ve Strateji': 'border-google-blue/40 bg-google-blue/10 text-google-blue',
  'Kariyer ve Gelir': 'border-google-green/40 bg-google-green/10 text-google-green',
  'Hazırlık ve Yerleşim': 'border-google-yellow/40 bg-google-yellow/10 text-google-yellow',
  'Yaşam ve Destek': 'border-google-red/40 bg-google-red/10 text-google-red',
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
      <div className="min-h-screen bg-black text-white">
        <div className="container py-20 text-center text-sm text-white/60">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-blue/10 via-transparent to-google-green/10" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-google-blue/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative py-12">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-blue">Araçlar</div>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">İnteraktif Araçlar</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Sitedeki interaktif planlama araçlarının tam listesi: her aracın kategorisi, açıklaması ve{' '}
            <strong className="text-white">gerçek soru sayısı</strong>. Soru sayısı, ankete kayıtlı asıl yapılandırmadan
            (questionnaire registry) okunur. Katalogdaki gösterim değeri farklıysa{' '}
            <strong className="text-white">uyuşmazlık rozeti</strong> ile işaretlenir.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Toplam Araç" value={totals.toolCount} accent="text-google-blue" />
            <SummaryCard label="Ankete Kayıtlı" value={totals.registeredCount} accent="text-google-green" />
            <SummaryCard label="Toplam Soru" value={totals.totalQuestions} accent="text-google-yellow" />
            <SummaryCard
              label="Katalog Uyuşmazlığı"
              value={totals.mismatchCount}
              accent={totals.mismatchCount > 0 ? 'text-google-red' : 'text-white/70'}
            />
          </div>

          <div className="mt-6 max-w-md">
            <label className="block">
              <span className="sr-only">Araç ara</span>
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Araç ara (ör. maaş, şehir, vize)..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="container space-y-4 py-10">
        {visible.length === 0 ? (
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/55">
            “{filter}” için araç bulunamadı.
          </div>
        ) : (
          visible.map((row) => (
            <article
              key={row.slug}
              className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]',
                        CATEGORY_ACCENT[row.category],
                      )}
                    >
                      {row.category}
                    </span>
                    {row.mismatch ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-google-red/40 bg-google-red/10 px-3 py-1 text-xs font-semibold text-red-200">
                        ⚠ Katalog: {row.catalogQuestionCount} soru
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-white">{row.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/68">{row.description}</p>
                  <p className="mt-3 font-mono text-xs text-white/40">/{row.slug}</p>
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-3 md:w-44">
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-center">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Soru sayısı</p>
                    <p className="mt-1 text-3xl font-black text-white">
                      {row.realQuestionCount ?? '—'}
                    </p>
                    <p className="mt-1 text-[11px] text-white/40">
                      {row.realQuestionCount === null ? 'Ankete kayıtlı değil' : 'Gerçek (anket)'}
                    </p>
                  </div>
                  <Link
                    href={getToolHref(row.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    Araca git
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/45">{label}</p>
      <p className={cn('mt-2 text-3xl font-black', accent)}>{value}</p>
    </div>
  );
}
