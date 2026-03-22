'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDevUserClient } from '@/lib/supabase/devuser';

interface EventItem {
  id?: string | number;
  type: string;
  date: string;
  title: string;
  text: string;
  areas?: string[];
  memberOnly?: boolean;
}

function parseDate(value: string): Date {
  return new Date(value + 'T00:00:00');
}

function toTRDate(value: string): string {
  return parseDate(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isPast(value: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDate(value) < today;
}

const ITEMS: EventItem[] = [];

export function GelismelerClient() {
  const [items] = useState<EventItem[]>(ITEMS);
  const [isMember, setIsMember] = useState(false);
  const [memberLabel, setMemberLabel] = useState<string>('kontrol ediliyor');
  const [areaFilter, setAreaFilter] = useState('all');
  const [search, setSearch] = useState('');

  const allAreas = Array.from(
    new Set(items.flatMap((item) => item.areas ?? []))
  ).sort((a, b) => a.localeCompare(b, 'tr'));

  const filtered = items.filter((item) => {
    if (areaFilter !== 'all' && !(item.areas ?? []).includes(areaFilter)) return false;
    if (!search) return true;
    const bag = [item.title, item.text, item.type, ...(item.areas ?? [])]
      .join(' ')
      .toLowerCase();
    return bag.includes(search.toLowerCase().trim());
  });

  const upcoming = filtered
    .filter((item) => !isPast(item.date))
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());

  const past = filtered
    .filter((item) => isPast(item.date))
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

  const checkMember = useCallback(async () => {
    try {
      const client = await getDevUserClient();
      if (!client) {
        setMemberLabel('pasif');
        return;
      }
      const { data } = await client.auth.getSession();
      const active = Boolean(data?.session?.user);
      setIsMember(active);
      setMemberLabel(active ? 'aktif' : 'pasif');
    } catch {
      setMemberLabel('pasif');
    }
  }, []);

  useEffect(() => {
    checkMember();
  }, [checkMember]);

  return (
    <>
      <style>{`
        .gel-member-badge {
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 999px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.04);
          font-size: 13px;
          color: rgba(255,255,255,0.68);
          display: inline-block;
          margin-bottom: 14px;
        }

        .gel-member-badge strong {
          color: #FBBC05;
        }

        .gel-hero {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 18px;
          position: relative;
          overflow: hidden;
        }

        .gel-hero::before {
          content: '';
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(135deg, #4285F4 0%, #EA4335 45%, #FBBC05 100%);
        }

        .gel-hero h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(22px, 4.4vw, 38px);
          line-height: 1.08;
          margin-bottom: 10px;
          letter-spacing: -0.4px;
          color: #fff;
        }

        .gel-hero p {
          color: rgba(255,255,255,0.68);
          line-height: 1.65;
          max-width: 84ch;
          font-size: 14px;
        }

        .gel-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 18px;
        }

        .gel-control {
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          padding: 10px 12px;
        }

        .gel-control label {
          display: block;
          font-size: 12px;
          color: rgba(255,255,255,0.68);
          margin-bottom: 8px;
        }

        .gel-control select,
        .gel-control input {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.25);
          color: #fff;
          border-radius: 10px;
          padding: 10px;
          outline: none;
          font-size: 14px;
        }

        .gel-control select:focus,
        .gel-control input:focus {
          border-color: #4285F4;
        }

        .gel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .gel-column {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 22px;
          padding: 18px;
          min-height: 320px;
        }

        .gel-column h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 21px;
          margin-bottom: 14px;
          letter-spacing: -0.3px;
          color: #fff;
        }

        .gel-list {
          display: grid;
          gap: 12px;
        }

        .gel-item {
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 14px;
          background: rgba(255,255,255,0.02);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .gel-item:hover {
          transform: translateY(-2px);
          border-color: rgba(66,133,244,0.45);
        }

        .gel-item.locked {
          border-style: dashed;
          opacity: 0.9;
        }

        .gel-item-top {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
          align-items: center;
        }

        .gel-badge {
          font-size: 11px;
          border-radius: 999px;
          padding: 4px 9px;
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.68);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .gel-badge-etkinlik { color: #4285F4; border-color: rgba(66,133,244,0.45); }
        .gel-badge-duyuru   { color: #FBBC05; border-color: rgba(251,188,5,0.45); }
        .gel-badge-haber    { color: #34A853; border-color: rgba(52,168,83,0.45); }
        .gel-badge-gelisme  { color: #EA4335; border-color: rgba(234,67,53,0.45); }

        .gel-date {
          font-size: 12px;
          color: rgba(255,255,255,0.68);
          margin-left: auto;
        }

        .gel-item h3 {
          font-size: 17px;
          margin-bottom: 8px;
          line-height: 1.3;
          color: #fff;
        }

        .gel-item p {
          color: rgba(255,255,255,0.68);
          font-size: 14px;
          line-height: 1.55;
        }

        .gel-tags {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .gel-tag {
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.68);
        }

        .gel-empty {
          border: 1px dashed rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 16px;
          color: rgba(255,255,255,0.68);
          text-align: center;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .gel-controls,
          .gel-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="gel-member-badge">
        Üye modu: <strong>{memberLabel}</strong>
      </div>

      <section className="gel-hero">
        <h1>Etkinlik Takvimi / Duyurular / Haberler / Gelişmeler</h1>
        <p>
          Gelecek etkinlikleri ve geçmiş etkinlik kayıtlarını tek ekrandan takip et.
          WhatsApp mesaj birikimi olmadan hangi oturum ne zaman, hangi alanda yapıldı hızlıca gör.
          Üyelere özel geçmiş kayıtlar sadece giriş yapan kullanıcılara açılır.
        </p>
        <div className="gel-controls">
          <div className="gel-control">
            <label htmlFor="areaFilter">Alan filtresi</label>
            <select
              id="areaFilter"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              <option value="all">Tüm alanlar</option>
              {allAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          <div className="gel-control">
            <label htmlFor="searchInput">Başlık veya açıklama ara</label>
            <input
              id="searchInput"
              type="text"
              placeholder="örnek: backend, workshop, duyuru"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="gel-grid">
        <article className="gel-column">
          <h2>Gelecek Etkinlikler</h2>
          <div className="gel-list">
            {upcoming.length === 0 ? (
              <div className="gel-empty">Şu an gösterilecek kayıt yok.</div>
            ) : (
              upcoming.map((item, i) => (
                <EventCard key={item.id ?? i} item={item} isPastCol={false} isMember={isMember} />
              ))
            )}
          </div>
        </article>

        <article className="gel-column">
          <h2>Geçmiş Etkinlikler</h2>
          <div className="gel-list">
            {past.length === 0 ? (
              <div className="gel-empty">Şu an gösterilecek kayıt yok.</div>
            ) : (
              past.map((item, i) => (
                <EventCard key={item.id ?? i} item={item} isPastCol={true} isMember={isMember} />
              ))
            )}
          </div>
        </article>
      </section>
    </>
  );
}

function badgeClass(type: string): string {
  const map: Record<string, string> = {
    etkinlik: 'gel-badge-etkinlik',
    duyuru: 'gel-badge-duyuru',
    haber: 'gel-badge-haber',
    gelisme: 'gel-badge-gelisme',
  };
  return `gel-badge ${map[type] ?? ''}`.trim();
}

function EventCard({
  item,
  isPastCol,
  isMember,
}: {
  item: EventItem;
  isPastCol: boolean;
  isMember: boolean;
}) {
  if (isPastCol && item.memberOnly && !isMember) {
    return (
      <article className="gel-item locked">
        <div className="gel-item-top">
          <span className={badgeClass(item.type)}>{item.type}</span>
          <span className="gel-date">{toTRDate(item.date)}</span>
        </div>
        <h3>Üyelere özel geçmiş kayıt</h3>
        <p>Bu kayıt sadece giriş yapmış üye hesaplarında görünür.</p>
        <div className="gel-tags">
          <span className="gel-tag">Kilitleme aktif</span>
        </div>
      </article>
    );
  }

  return (
    <article className="gel-item">
      <div className="gel-item-top">
        <span className={badgeClass(item.type)}>{item.type}</span>
        <span className="gel-date">{toTRDate(item.date)}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <div className="gel-tags">
        {(item.areas ?? []).map((area) => (
          <span key={area} className="gel-tag">{area}</span>
        ))}
        {item.memberOnly && <span className="gel-tag">Üyelere özel</span>}
      </div>
    </article>
  );
}
