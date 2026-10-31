# Admin UI Kiti

/admin panelinin ortak bileşenleri. Hepsi açık temadadır (bg-page, bg-white, border-line, brand-*). Yeni admin ekranlarında koyu tema sınıfı (bg-black, white/NN, backdrop-blur, google-*) kullanılmaz.

## Hangi durumda hangisi

| İhtiyaç | Bileşen |
|---|---|
| Sayfa başlığı | `AdminPageHeader` |
| Özet sayı kartı | `AdminStatCard` |
| Form alanı (etiket + girdi) | `AdminField`, ortak girdi sınıfı için `ADMIN_CONTROL_CLASS` |
| Liste / tablo | `AdminTable`, `AdminThead`, `AdminTh`, `AdminTr`, `AdminTd` |
| Arama ve filtre satırı | `AdminFilterBar` |
| Durum rozeti | `AdminStatusBadge` (`statusTone` ile ton eşlemesi) |
| Boş liste | `AdminEmptyState` |
| Onay / form penceresi | `AdminModal` |
| Sekmeler | `AdminTabs` |
| Butonlar | `components/ui/Button` (ayrı admin butonu yok) |

## Butonlar

`Button` varyantları: birincil eylem `primary`, yan eylem `secondary` veya `outline`, sessiz eylem `ghost`. Tehlikeli eylemler (silme, sıfırlama, reddetme) için `variant="danger"`, onaylama için `variant="success"` kullanılır. Dokunma hedefi en az 44px olmalıdır.

## Örnekler

```tsx
<AdminFilterBar title="Filtreler">
  <input className={ADMIN_CONTROL_CLASS} placeholder="Ara" />
</AdminFilterBar>

<AdminTable caption="Üye listesi">
  <AdminThead>
    <AdminTr><AdminTh>Ad</AdminTh><AdminTh>Durum</AdminTh></AdminTr>
  </AdminThead>
  <tbody>
    <AdminTr>
      <AdminTd>Ayşe</AdminTd>
      <AdminTd><AdminStatusBadge status="pending" label="Bekliyor" /></AdminTd>
    </AdminTr>
  </tbody>
</AdminTable>

<AdminModal open={open} onClose={close} title="Silinsin mi?" footer={<Button variant="danger">Sil</Button>}>
  Bu işlem geri alınamaz.
</AdminModal>
```

`AdminModal` Escape ile kapanır, odağı içeride tutur ve kapanınca odağı tetikleyiciye geri verir. Açık değilken hiçbir şey çizmez.

## Dönüşüm tablosu (özet)

| Eski | Yeni |
|---|---|
| `bg-black text-white` | `bg-page text-ink` |
| `bg-white/[0.03..0.08]` + `border-white/10` | `bg-white border border-line` (kart) veya `bg-band` (panel, filtre) |
| `text-white/45..72` | `text-muted` |
| `google-blue` | `brand-700` (zemin, link), `brand-600` (vurgu) |
| `google-red/green/yellow/orange` | `TONE_STYLES.red/green/yellow/orange` (`@/components/site/tones`) |
| `rounded-2xl` / `rounded-xl` | `rounded-card` / `rounded-btn` |
| `backdrop-blur`, `bg-gradient-*`, `blur-3xl`, glow, `hover:-translate-y` | kaldır |
| özel focus ring, `ring-offset-black` | kaldır (genel brand outline yeterli) |
| hata / başarı / uyarı kutusu | `TONE_STYLES.red` / `green` / `yellow` (tint, border, text) |
