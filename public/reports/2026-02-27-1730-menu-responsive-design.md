# Menu Sahifasini Responsive Dizayn Qilish

**Sana:** 2026-02-27  
**Vaqt:** 17:30  
**Status:** ✅ Tugallandi

## Maqsad

Menu sahifasini barcha ekran o'lchamlari uchun responsive qilish va zamonaviy dizayn bilan jihozlash.

## O'zgarishlar

### 1. Header (Sarlavha)

#### Mobile/Tablet
- **Oq fon** (`bg-white`) va yengil soya (`shadow-sm`)
- Logo va restaurant nomi ko'rsatiladi
- Balandlik: `h-16` (64px)

#### Desktop
- **Oq fon** va yengil soya
- Logo, sarlavha va qidiruv paneli bir qatorda
- Responsive padding: `px-6 xl:px-8`, `py-5 xl:py-6`
- Qidiruv paneli: `max-w-md xl:max-w-lg`

### 2. Category Navigation (Kategoriya Navigatsiyasi)

#### Mobile/Tablet
- Horizontal scroll qo'shildi
- Chip dizayn: `rounded-full`
- Active state: `bg-primary text-white`
- Inactive state: `bg-gray-100 text-gray-700`
- Icon qo'shildi: `UtensilsCrossed`

#### Desktop
- Sidebar'da vertical navigation
- Responsive kenglik: `w-[280px] xl:w-[320px]`
- Sticky positioning: `sticky top-[73px] xl:top-[89px]`
- Icon va count ko'rsatiladi

### 3. Food Cards (Taom Kartochkalari)

#### Layout
- **Mobile:** 1 ustun (`grid-cols-1`)
- **Tablet+:** 2 ustun (`lg:grid-cols-2`)
- **XL+:** 3 ustun (`xl:grid-cols-3`)

#### Card Dizayn
- Oq fon: `bg-white`
- Yengil soya: `shadow-sm hover:shadow-md`
- Border: `border border-gray-100`
- Rounded: `rounded-2xl`

#### Image
- **Mobile:** To'liq kenglik
- **Tablet+:** Fixed o'lcham: `w-24 h-24` → `w-28 h-28` → `w-32 h-32` → `w-[140px] h-[140px]`
- Placeholder: `UtensilsCrossed` icon

#### Content
- **Title:** `text-lg sm:text-xl lg:text-xl`
- **Description:** `text-sm sm:text-base`, `line-clamp-2`
- **Price:** `text-lg sm:text-xl lg:text-xl`
- **Button:** Responsive padding va o'lcham

### 4. Search Bar (Qidiruv Paneli)

#### Mobile
- To'liq kenglik
- Rounded: `rounded-xl`
- Background: `bg-gray-50` → `focus:bg-white`
- Padding: `py-3`

#### Desktop
- Max width: `max-w-md xl:max-w-lg`
- Rounded: `rounded-2xl`
- Background: `bg-gray-50` → `focus:bg-white`
- Padding: `py-3 xl:py-3.5`

### 5. Spacing va Padding

#### Mobile
- Container padding: `px-4 py-4`
- Gap: `gap-4`
- Space between sections: `space-y-6`

#### Tablet
- Container padding: `px-6 py-6`
- Gap: `gap-5`
- Space between sections: `space-y-8`

#### Desktop
- Container padding: `px-6 xl:px-8 py-6 xl:py-8`
- Gap: `gap-6`
- Space between sections: `space-y-10 xl:space-y-12`

### 6. Typography

#### Headings
- Category title: `text-xl sm:text-2xl lg:text-3xl`
- Food name: `text-lg sm:text-xl lg:text-xl`
- Description: `text-sm sm:text-base`

#### Colors
- Text: `text-gray-900` (asosiy), `text-gray-600` (description), `text-gray-500` (muted)
- Primary: `text-primary` (narx)
- Background: `bg-white`, `bg-gray-50`, `bg-gray-100`

### 7. Interactive Elements

#### Buttons
- **Order button:**
  - Padding: `px-4 sm:px-5 lg:px-6 xl:px-8`
  - Rounded: `rounded-full`
  - Hover: `hover:bg-primary/90`, `hover:scale-105`
  - Active: `active:scale-95`

#### Quantity Controls
- Background: `bg-gray-50`
- Button size: `w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10`
- Shadow: `shadow-sm`

### 8. Empty State

- Icon container: `w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28`
- Background: `bg-gray-100`
- Text colors: `text-gray-700`, `text-gray-500`

## Responsive Breakpoints

- **Mobile:** `< 640px` (sm)
- **Tablet:** `640px - 1024px` (sm - lg)
- **Desktop:** `1024px - 1280px` (lg - xl)
- **Large Desktop:** `> 1280px` (xl+)

## CSS Classes Qo'shildi

```css
/* Responsive grid */
grid-cols-1 lg:grid-cols-2 xl:grid-cols-3

/* Responsive spacing */
space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12

/* Responsive padding */
px-4 sm:px-6 lg:px-6 xl:px-8
py-4 sm:py-6 lg:py-6 xl:py-8

/* Responsive text */
text-lg sm:text-xl lg:text-xl
text-sm sm:text-base

/* Responsive image */
w-full sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-[140px] xl:h-[140px]
```

## Natijalar

✅ Barcha ekran o'lchamlari uchun responsive dizayn  
✅ Zamonaviy va chiroyli UI  
✅ Yaxshi UX (hover effects, transitions)  
✅ To'g'ri typography va spacing  
✅ Build muvaffaqiyatli o'tdi  
✅ Linter xatolari yo'q

## Test Qilish

Quyidagi ekran o'lchamlari uchun test qiling:

1. **Mobile (375px, 414px):**
   - 1 ustun layout
   - Horizontal scroll kategoriyalar
   - Bottom navigation

2. **Tablet (768px, 1024px):**
   - 2 ustun layout
   - Sidebar navigation
   - Yaxshi spacing

3. **Desktop (1280px, 1920px):**
   - 3 ustun layout (xl+)
   - To'liq sidebar
   - Katta qidiruv paneli

## Keyingi Qadamlar

- [ ] Browser'da test qilish
- [ ] Turli xil ekran o'lchamlari uchun tekshirish
- [ ] Performance optimizatsiyasi (lazy loading)
- [ ] Accessibility yaxshilash
