# Yig'iladigan Sidebar - 2026-02-27 15:51

## 📋 Vazifa
Sidebar'ni yig'iladigan qilib, faqat iconlar bilan ko'rsatish va hover paytida tooltip ko'rsatish

## ✅ Bajarilgan ishlar

### 1. Tooltip Komponenti Yaratildi
**Fayl:** `resources/js/Components/ui/tooltip.tsx`

**Funksiyalar:**
- Radix UI tooltip primitives
- Animatsiyalar
- Responsive positioning

### 2. Sidebar Yig'iladigan Qilindi
**Fayl:** `resources/js/Layouts/MenuLayout.tsx`

**Yangi Funksiyalar:**
- ✅ Sidebar yig'ilgan/kengaytirilgan state
- ✅ Yig'ilgan holatda faqat iconlar ko'rsatiladi
- ✅ Hover paytida tooltip ko'rsatiladi
- ✅ Toggle button (ChevronLeft/ChevronRight)
- ✅ Smooth transition animatsiyalar

### 3. O'zgarishlar

#### State Management
```tsx
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
```

#### Width O'zgarishi
- **Yig'ilgan:** `w-20` (80px)
- **Kengaytirilgan:** `w-64` (256px)

#### Layout O'zgarishi
- **Yig'ilgan:** Faqat iconlar, markazlashtirilgan
- **Kengaytirilgan:** Icon + text, to'liq ma'lumotlar

#### Tooltip Integration
- Barcha nav items uchun tooltip
- Search button uchun tooltip
- Toggle button uchun tooltip
- Tooltip o'ng tomonda ko'rsatiladi

### 4. UI Elementlar

#### Logo Section
- Yig'ilgan: Faqat icon
- Kengaytirilgan: Icon + "Restaurant" text

#### Search Button
- Yig'ilgan: Faqat icon, tooltip bilan
- Kengaytirilgan: Icon + text

#### Navigation Items
- Yig'ilgan: Faqat icon, tooltip bilan
- Kengaytirilgan: Icon + label
- Badge ko'rsatiladi (agar bor bo'lsa)

#### Footer
- Yig'ilgan: Toggle button (ChevronRight)
- Kengaytirilgan: Copyright + Toggle button (ChevronLeft)

### 5. Animatsiyalar
- Smooth width transition (300ms)
- Hover effects
- Tooltip fade-in/zoom-in

## 🔍 Texnik Tafsilotlar

### Tooltip Provider
- Barcha tooltip'lar uchun global provider
- Delay va positioning sozlangan

### Responsive
- Desktop: Yig'iladigan sidebar
- Mobile/Tablet: Bottom navigation (o'zgarmadi)

### Accessibility
- Keyboard navigation
- ARIA attributes
- Focus management

## 📝 Eslatmalar
- Sidebar default holatda yig'ilgan
- Hover paytida tooltip avtomatik ko'rsatiladi
- Toggle button footer'da
- Smooth transitions

## ⏱️ Vaqt
**Boshlanish:** 15:48  
**Tugash:** 15:51  
**Davomiylik:** ~3 daqiqa
