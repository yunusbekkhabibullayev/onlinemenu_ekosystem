# Layout Unifikatsiya — 2-bosqich Hisoboti

**Sana:** 01.03.2026  
**Holat:** ✅ Muvaffaqiyatli bajarildi  
**Linter xatolari:** 0

---

## Bajarilgan Ishlar

### 1. MenuLayout — Top Header Qo'shildi ✅

**Muammo:** Til tanlash va foydalanuvchi profili uchun alohida joy yo'q edi. Har bir sahifa o'z headerini ko'rsatardi.

**Yechim:** MenuLayout ga barcha ekranlar uchun yagona `h-14` sticky top header qo'shildi:

**Left tomoni (mobil):**
- Qidiruv tugmasi → GlobalSearch modalni ochadi

**O'ng tomoni (barcha ekranlar):**
- 🌐 Til dropdown — O'zbekcha / Русский tanlash
- 👤 Foydalanuvchi dropdown:
  - Agar kirgan bo'lsa: ism + avatar, dropdown ichida: Panel, Profil, Chiqish
  - Agar kirmagan bo'lsa: "Profil" tugmasi → `/account` ga yo'naltiradi

### 2. Eski Mobil Qidiruv Paneli Olib Tashlandi ✅

Avvalgi struktura:
```tsx
// MenuLayout da (faqat mobile):
<div className="lg:hidden sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
    <button onClick={() => setIsSearchOpen(true)}>...</button>
</div>
```

Yangi struktura:
- Bu panel olib tashlandi
- Qidiruv tugmasi yangi top headerga ko'chirildi (mobile uchun)
- Desktop uchun esa sidebar da qidiruv tugmasi saqlab qolindi

### 3. Cart.tsx — Ikki Footer Muammosi Hal Qilindi ✅

**Muammo:** Screenshot da footer ikki marta ko'rinardi:
1. Cart.tsx `items.length === 0` shartida o'z footerini chizardi (207-219 qatorlar)
2. Asosiy return blokida ham footer bor edi (370-381 qatorlar)
3. MenuLayout ham footer chizardi → **Jami 3 ta footer!**

**Yechim:** Cart.tsx dagi ikkala inline footer olib tashlandi. MenuLayout footeri yagona footer bo'lib qoldi.

### 4. Account.tsx — Dublikat Header Olib Tashlandi ✅

Avvalgi holat:
```tsx
{/* Mobile Header */}
<header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border">
    <h1>Profil</h1>
</header>
{/* Desktop Header */}
<header className="hidden lg:block sticky top-0 z-40 bg-card border-b border-border">
    <h1>Profil</h1>
</header>
```

Yangi holat: Bu headerlar olib tashlandi. MenuLayout top header kontekstni ko'rsatadi.

### 5. Account.tsx — Til Tanlash Olib Tashlandi ✅

Account sahifasida til tanlash sectioni bor edi. Bu endi MenuLayout top header da joylashgan. Dublikat olib tashlandi.

### 6. Menu.tsx — Sticky Pozitsiyalar Yangilandi ✅

MenuLayout top header (56px) qo'shilganligi sababli barcha sticky elementlar pastga siljitildi:

| Element | Oldin | Keyin |
|---------|-------|-------|
| Mobile header | `top-0` | `top-14` (56px) |
| Mobile category bar | `top-16` (64px) | `top-[112px]` (56+56) |
| Desktop header | `top-0` | `top-14` (56px) |
| Desktop sidebar top | `top-[73px]` | `top-[129px]` (56+73) |
| Desktop sidebar xl top | `top-[89px]` | `top-[145px]` (56+89) |
| Desktop sidebar height | `h-[calc(100vh-73px)]` | `h-[calc(100vh-129px)]` |
| Desktop sidebar xl height | `h-[calc(100vh-89px)]` | `h-[calc(100vh-145px)]` |

### 7. Cart.tsx — Header Pozitsiyasi Yangilandi ✅

```tsx
// Oldin:
<header className="sticky top-0 z-40 ...">

// Keyin:
<header className="sticky top-14 z-30 ...">
```

---

## Yangi Layout Strukturasi

```
┌─────────────────────────────────────────────────────┐
│  Desktop Sidebar (w-20 collapsed / w-64 expanded)   │
│  [Logo] [Search] [Nav items] [Collapse toggle]      │
├─────────────────────────────────────────────────────┤
│  Content Area (lg:pl-20 / lg:pl-64)                 │
│  ┌───────────────────────────────────────────────┐  │
│  │  TOP HEADER h-14 (sticky, z-40)               │  │
│  │  [🔍 Qidirish (mobile)] ... [🌐 Til] [👤 User] │  │
│  ├───────────────────────────────────────────────┤  │
│  │  Page content (children)                      │  │
│  │  (Page-specific headers at sticky top-14)    │  │
│  ├───────────────────────────────────────────────┤  │
│  │  FOOTER (border-t, bg-card)                   │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  Mobile Bottom Nav (fixed bottom, h-[4.5rem])        │
└─────────────────────────────────────────────────────┘
```

---

## O'zgartirilgan Fayllar (5 ta)

| # | Fayl | O'zgarish |
|---|------|-----------|
| 1 | `Layouts/MenuLayout.tsx` | Top header qo'shildi, mobil search paneli olib tashlandi |
| 2 | `Pages/Menu.tsx` | Barcha sticky pozitsiyalar yangilandi |
| 3 | `Pages/Account.tsx` | Ikki header va til section olib tashlandi |
| 4 | `Pages/Cart.tsx` | Ikkita inline footer olib tashlandi, header `top-14` |
| 5 | *(Home.tsx)* | O'zgarmadi — alohida header yo'q |
