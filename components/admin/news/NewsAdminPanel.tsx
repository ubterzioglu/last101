'use client';

import { useCallback, useState } from 'react';
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
import { clearAdminAuth } from '@/lib/admin/clientAuth';
import { useAdminGate } from '@/hooks/useAdminGate';

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

  const gateStatus = useAdminGate();

  const [activeTab, setActiveTab] = useState<NewsAdminTab>(isNewsAdminTab(initialTab ?? null) ? (initialTab as NewsAdminTab) : 'kuyruk');
  const [editingPostId, setEditingPostId] = useState<string | null>(initialPostId ?? null);

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

  function handleLogout() {
    clearAdminAuth();
    setActiveTab('kuyruk');
    setEditingPostId(null);
    router.replace('/admin');
  }

  if (gateStatus !== 'authed') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container py-20 text-center text-sm text-white/60">Admin oturumu doğrulanıyor...</div>
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
