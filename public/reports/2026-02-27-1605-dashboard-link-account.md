# Profil Sahifasiga Dashboard Link Qo'shish - 2026-02-27 16:05

## 📋 Vazifa
Profil sahifasiga role'ga qarab dashboard'ga link qo'shish. Faqat admin va restoran hodimlari uchun ko'rsatiladi.

## ✅ Bajarilgan ishlar

### 1. Dashboard Link Funksiyasi
**Fayl:** `resources/js/Pages/Account.tsx`

**Yangi Funksiyalar:**
- `getDashboardLink()` - User role'ga qarab dashboard linkini qaytaradi
- Role'ga qarab linklar:
  - `admin` → `/admin`
  - `waiter` → `/waiter/tables`
  - `kitchen` → `/kitchen/dashboard`
  - `cashier` → `/cashier/dashboard`
  - `user` → `null` (ko'rsatilmaydi)

### 2. UI O'zgarishlari

#### Icon Import
- `LayoutDashboard` icon qo'shildi

#### Link Ko'rsatish
- Faqat admin va restoran hodimlari uchun ko'rsatiladi
- Oddiy foydalanuvchilar (`user` role) uchun ko'rsatilmaydi
- Tooltip title role'ga qarab o'zgaradi:
  - Admin: "Admin Panel"
  - Waiter: "Ofitsiant Panel"
  - Kitchen: "Oshxona Panel"
  - Cashier: "Kassa Panel"

### 3. Kod O'zgarishlari

#### Oldin
```tsx
{user.role === 'admin' && (
    <Link href="/admin">
        <Settings />
    </Link>
)}
```

#### Hozir
```tsx
{hasDashboardAccess && (
    <Link href={dashboardLink}>
        <LayoutDashboard />
    </Link>
)}
```

### 4. Funksiyalar

#### getDashboardLink()
- User role'ni tekshiradi
- Tegishli dashboard linkini qaytaradi
- Oddiy foydalanuvchilar uchun `null` qaytaradi

#### hasDashboardAccess
- Dashboard link mavjudligini tekshiradi
- Faqat admin va restoran hodimlari uchun `true`

## 🔍 Texnik Tafsilotlar

### Role Mapping
- **admin** → `/admin` (Admin Dashboard)
- **waiter** → `/waiter/tables` (Waiter Tables)
- **kitchen** → `/kitchen/dashboard` (Kitchen Dashboard)
- **cashier** → `/cashier/dashboard` (Cashier Dashboard)
- **user** → Link ko'rsatilmaydi

### UI Elementlar
- Icon: `LayoutDashboard` (lucide-react)
- Styling: Primary button style
- Position: User info card'da, Settings o'rniga
- Tooltip: Role'ga qarab o'zgaradi

## 📝 Eslatmalar
- Faqat admin va restoran hodimlari uchun ko'rsatiladi
- Oddiy foydalanuvchilar uchun link ko'rsatilmaydi
- Tooltip title role'ga qarab o'zgaradi
- Settings icon o'rniga LayoutDashboard icon ishlatiladi

## ⏱️ Vaqt
**Boshlanish:** 16:03  
**Tugash:** 16:05  
**Davomiylik:** ~2 daqiqa
