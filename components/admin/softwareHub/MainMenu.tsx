import { Card } from '@/components/ui/Card';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';
import type { MainMenuProps } from './types';

type BadgeKind = 'pending' | 'draft' | 'always';

interface MenuItem {
  section: string;
  icon: string;
  title: string;
  desc: string;
  tone: SiteTone;
  badge: { key: string; kind: BadgeKind; suffix: string };
}

const MENU_ITEMS: readonly MenuItem[] = [
  { section: 'devuser', icon: '👤', title: 'Yeni Üye Onayla', desc: 'Developer topluluğuna katılan yeni üyeleri incele ve onayla.', tone: 'blue', badge: { key: 'devuser', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'tournament', icon: '🎲', title: 'Tavla Katılımcısı Onayla', desc: 'Tavla turnuvasına kayıt olan katılımcıları yönet ve playoff tablosunu düzenle.', tone: 'yellow', badge: { key: 'tavla', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'hackathon', icon: '💻', title: 'Vibecoding Onayla', desc: "Vibecoding Tournament'a kayıt olan takımları yönet ve onayla.", tone: 'green', badge: { key: 'vct', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'promote', icon: '📢', title: 'Promote Onayla', desc: 'Promote Your Product kayıtlarını yönet ve onayla.', tone: 'red', badge: { key: 'promote', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'cvopt', icon: '📄', title: 'CV Opt Onayla', desc: 'CV + LinkedIn iyileştirme başvurularını incele, sırayı yönet ve onayla.', tone: 'green', badge: { key: 'cvopt', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'typing', icon: '⌨️', title: 'Typing Onayla', desc: 'Klavye Hız Yarışması katılımcılarını yönet ve playoff tablosunu düzenle.', tone: 'blue', badge: { key: 'typing', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'discussion', icon: '💬', title: 'Discussion Onayla', desc: 'Yeni tartışma konusu başvurularını incele, onayla veya beklemeye al.', tone: 'yellow', badge: { key: 'discussion', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'news', icon: '📰', title: 'News Yönetimi', desc: 'Haberleri listele, kategori/durum güncelle ve gereksiz haberleri sil.', tone: 'blue', badge: { key: 'news', kind: 'draft', suffix: 'taslak' } },
  { section: 'founders', icon: '🚀', title: 'Founder Başvuruları', desc: 'Founder kayıtlarını incele, onayla ve survey linkini paylaş.', tone: 'yellow', badge: { key: 'founders', kind: 'pending', suffix: 'onay bekliyor' } },
  { section: 'founderSurvey', icon: '🗓️', title: 'Founder Event Survey', desc: 'Tarih slotlarını yönet ve founder oylarını canlı takip et.', tone: 'blue', badge: { key: 'founderSurvey', kind: 'always', suffix: 'oy kaydı' } },
  { section: 'meeting', icon: '📅', title: 'Toplantı Anketi Sonuçları', desc: 'Tanışma toplantısı için katılımcı listesi ve tarih oyları.', tone: 'green', badge: { key: 'meeting', kind: 'always', suffix: 'katılımcı' } },
];

export default function MainMenu({ badges, pendingDevUsers, showSection }: MainMenuProps) {
  const badgeCount = (item: MenuItem): number | string | null => {
    const { key, kind } = item.badge;
    if (key === 'devuser') return pendingDevUsers > 0 ? pendingDevUsers : null;
    if (kind === 'always') return badges[key] ?? 0;
    return Number(badges[key]) > 0 ? badges[key] : null;
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {MENU_ITEMS.map((item) => {
        const count = badgeCount(item);
        return (
          <Card
            key={item.section}
            variant="hoverable"
            noPadding
            className={cn('h-full', TONE_STYLES[item.tone].border)}
          >
            <button
              type="button"
              onClick={() => showSection(item.section)}
              className="flex h-full min-h-[44px] w-full flex-col items-center rounded-card p-5 text-center sm:p-6"
            >
              <span aria-hidden="true" className="mb-3 text-4xl">{item.icon}</span>
              <span className="mb-2 text-base font-bold text-ink">{item.title}</span>
              <span className="text-sm text-muted">{item.desc}</span>
              {count !== null && (
                <span
                  className={cn(
                    'mt-3 inline-block rounded-full border px-3.5 py-1.5 text-xs font-semibold',
                    TONE_STYLES.red.tint,
                    TONE_STYLES.red.border,
                    TONE_STYLES.red.text,
                  )}
                >
                  {count} {item.badge.suffix}
                </span>
              )}
            </button>
          </Card>
        );
      })}
    </div>
  );
}
