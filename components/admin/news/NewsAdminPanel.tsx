'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  NewsAdminShell,
  type NewsAdminTab,
  type NewsAdminTabItem,
} from '@/components/admin/news/NewsAdminShell';
import { NewsQueueAdminClient } from '@/components/admin/news/NewsQueueAdminClient';
import { NewsEditorAdminClient } from '@/components/admin/news/NewsEditorAdminClient';
import { NewsSourcesAdminClient } from '@/components/admin/news/NewsSourcesAdminClient';
import { NewsPipelineAdminClient } from '@/components/admin/news/NewsPipelineAdminClient';
import { NewsSettingsAdminClient } from '@/components/admin/news/NewsSettingsAdminClient';
import {
  clearAdminAuth,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';

const TABS: NewsAdminTabItem[] = [
  { id: 'kuyruk', label: 'Kuyruk' },
  { id: 'editor', label: 'Yeni Haber' },
  { id: 'kaynaklar', label: 'Kaynaklar' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'ayarlar', label: 'Ayarlar' },
];

const TAB_META: Record<NewsAdminTab, { title: string; description: string }> = {
  kuyruk: {
    title: 'Haber Yönetimi',
    description: 'İnceleme kuyruğunu, yayınlanan içerikleri ve editoryal aksiyonları tek operatörlü akışla yönetin.',
  },
  editor: {
    title: 'Haber Editörü',
    description: 'Başlığı, özeti, kaynak bilgilerini ve hero ayarlarını düzenleyin. Sağ panelde ham veri ve işlem geçmişi görünür.',
  },
  kaynaklar: {
    title: 'Kaynak Yönetimi',
    description: 'RSS, MRSS ve manuel kaynakları yönetin; test edin, öncelik verin ve tekil çalıştırın.',
  },
  pipeline: {
    title: 'Pipeline',
    description: 'Manuel tetikleme, son ingest çalışmaları ve kaynak bazlı operasyon durumu burada görünür.',
  },
  ayarlar: {
    title: 'Pipeline Ayarları',
    description: 'Kod değiştirmeden pipeline davranışını, retention sürelerini ve AI limitlerini güncelleyin.',
  },
};

function isNewsAdminTab(value: string | null): value is NewsAdminTab {
  return value === 'kuyruk' || value === 'editor' || value === 'kaynaklar' || value === 'pipeline' || value === 'ayarlar';
}

interface NewsAdminPanelProps {
  initialTab?: string;
  initialPostId?: string;
}

export function NewsAdminPanel({ initialTab, initialPostId }: NewsAdminPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<NewsAdminTab>(isNewsAdminTab(initialTab ?? null) ? (initialTab as NewsAdminTab) : 'kuyruk');
  const [editingPostId, setEditingPostId] = useState<string | null>(initialPostId ?? null);

  useEffect(() => {
    const current = loadAdminAuth();
    if (!current.password) {
      setAuthLoading(false);
      return;
    }

    verifyAdminKey(current.password)
      .then(() => setAuthed(true))
      .catch(() => clearAdminAuth())
      .finally(() => setAuthLoading(false));
  }, []);

  const syncUrl = useCallback(
    (tab: NewsAdminTab, postId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      if (tab === 'editor' && postId) {
        params.set('id', postId);
      } else {
        params.delete('id');
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const goToTab = useCallback(
    (tab: NewsAdminTab) => {
      setActiveTab(tab);
      // Switching to the editor tab from the nav starts a fresh "new post" form.
      const nextPostId = tab === 'editor' ? editingPostId : null;
      syncUrl(tab, nextPostId);
    },
    [editingPostId, syncUrl],
  );

  const openEditor = useCallback(
    (postId: string | null) => {
      setEditingPostId(postId);
      setActiveTab('editor');
      syncUrl('editor', postId);
    },
    [syncUrl],
  );

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setAuthError('');
    verifyAdminKey(authPassword)
      .then(() => {
        saveAdminAuth(authPassword);
        setAuthed(true);
      })
      .catch((error: unknown) => {
        setAuthError(error instanceof Error ? error.message : 'Giriş başarısız.');
      })
      .finally(() => setSubmitting(false));
  }

  function handleLogout() {
    clearAdminAuth();
    setAuthed(false);
    setActiveTab('kuyruk');
    setEditingPostId(null);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container py-20 text-center text-sm text-white/60">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd24a]">Haber Admin</div>
              <h1 className="mt-3 text-3xl font-bold">Haber Yönetimi</h1>
              <p className="mt-3 text-sm leading-7 text-white/68">
                İnceleme kuyruğu, editör, kaynaklar, pipeline ve ayarları tek panelden yönetin.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Şifre</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1] focus-visible:ring-2 focus-visible:ring-google-blue"
                  placeholder="••••••••"
                />
              </label>

              {authError ? (
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {authError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#01A1F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#139ce6] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const meta = TAB_META[activeTab];

  return (
    <NewsAdminShell
      title={meta.title}
      description={meta.description}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={goToTab}
      onLogout={handleLogout}
    >
      {activeTab === 'kuyruk' ? (
        <NewsQueueAdminClient onEdit={(id) => openEditor(id)} onCreateNew={() => openEditor(null)} />
      ) : null}
      {activeTab === 'editor' ? (
        <NewsEditorAdminClient
          key={editingPostId ?? 'new'}
          postId={editingPostId ?? undefined}
          onCreated={(id) => openEditor(id)}
        />
      ) : null}
      {activeTab === 'kaynaklar' ? <NewsSourcesAdminClient /> : null}
      {activeTab === 'pipeline' ? <NewsPipelineAdminClient /> : null}
      {activeTab === 'ayarlar' ? <NewsSettingsAdminClient /> : null}
    </NewsAdminShell>
  );
}
