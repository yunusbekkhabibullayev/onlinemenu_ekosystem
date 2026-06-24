# Online Menu — Dizayn Unifikatsiya Rejasi

**Sana:** 01.03.2026  
**Maqsad:** Barcha sahifalarni bir xil dizayn tizimiga moslashtirish  
**Holat:** Jarayonda

---

## 1. Muammo Tahlili

Loyihada 5 ta asosiy muammo aniqlandi:

### 1.1 Semantik Token Buzilishlari (eng keng tarqalgan)
| Noto'g'ri | To'g'ri |
|-----------|---------|
| `text-gray-900` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `bg-white` | `bg-card` |
| `bg-gray-100` | `bg-muted` |
| `bg-gray-50` | `bg-secondary` |
| `border-gray-200` | `border-border` |

### 1.2 Hardcoded Status Ranglari
Kitchen, Cashier, Waiter sahifalarida:
- Pending: `bg-yellow-50 border-yellow-300 text-yellow-800`
- Confirmed: `bg-blue-50 border-blue-300 text-blue-800`
- Preparing: `bg-purple-50 border-purple-300 text-purple-800`
- Ready: `bg-green-50 border-green-300 text-green-800`

### 1.3 Layout Sidebar Nomuvofiqligi
| Layout | Hozir | Kerak |
|--------|-------|-------|
| AdminLayout | `bg-gray-900` | ✅ Qoldirish |
| WaiterLayout | `bg-orange-600` | → `bg-gray-900` |
| KitchenLayout | `bg-purple-600` | → `bg-gray-900` |
| CashierLayout | `bg-emerald-600` | → `bg-gray-900` |

### 1.4 Yo'q Tailwind Tokenlar
- `shadow-card` — ishlatilgan, lekin config'da yo'q
- `shadow-elevated` — ishlatilgan, lekin config'da yo'q
- `accent` — Button komponenti ishlatadi, config'da yo'q
- `ring` — Button komponenti ishlatadi, config'da yo'q
- `animate-fade-in`, `animate-scale-in` — ishlatilgan, config'da yo'q

### 1.5 Forma Elementlar Nomuvofiqligi
| Noto'g'ri | To'g'ri |
|-----------|---------|
| Raw `<select className="...">` | shadcn `<Select>` |
| Raw `<input type="checkbox">` | shadcn `<Switch>` |
| `bg-orange-500` (pagination) | `bg-primary` |
| `bg-emerald-600` (button) | `bg-primary` |
| `bg-blue-600`, `bg-purple-600` (kitchen buttons) | `bg-primary` |

---

## 2. Dizayn Tizimi

### 2.1 Rang Tokenlari
```js
// tailwind.config.js da belgilangan
primary: '#f97316'          // Asosiy brand rangi
background: '#fffbf5'       // Public sahifalar foni
card: '#ffffff'             // Karta fonlari
foreground: '#1c1917'       // Asosiy matn
muted: '#f5f5f4'            // O'chiq fon
muted-foreground: '#78716c' // O'chiq matn
border: '#e7e5e4'           // Chegara rangi
```

### 2.2 Status Rang Tizimi
Barcha statuslar uchun bir xil yondashuv:
- Border-l-4 (chap chegara rangi) + `bg-card` (oq fon)
- `StatusBadge` komponenti badge uchun

| Status | Border rangi | Icon rangi |
|--------|-------------|-----------|
| pending | `border-l-amber-400` | `text-amber-500` |
| confirmed | `border-l-blue-500` | `text-blue-500` |
| preparing | `border-l-violet-500` | `text-violet-500` |
| ready | `border-l-green-500` | `text-green-500` |
| delivered | `border-l-emerald-500` | `text-emerald-500` |
| paid | `border-l-gray-400` | `text-gray-400` |
| cancelled | `border-l-red-500` | `text-red-500` |

### 2.3 Tugmalar
- Asosiy amal: `<Button>` (default = primary orange)
- Ikkinchi darajali: `<Button variant="outline">`
- Xavfli amal: `<Button variant="destructive">`
- Ochiq: `<Button variant="ghost">`

### 2.4 Layout Shablon
Barcha admin/staff layoutlar:
```
┌─────────────────────────────────────────┐
│  Sidebar (bg-gray-900, w-64)            │
│  ┌──────────────────────────────────┐   │
│  │ Logo + App name                  │   │
│  │ Role badge (rang farqi shu yerda)│   │
│  │                                  │   │
│  │ Nav items (icon + label)         │   │
│  │   Active: bg-primary text-white  │   │
│  │   Hover:  bg-gray-800 text-white │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Main Area                              │
│  ┌─────────────────────────────────┐    │
│  │ Topbar (bg-white h-16)          │    │
│  │   Title + User dropdown         │    │
│  ├─────────────────────────────────┤    │
│  │ Content (bg-gray-50 p-6)        │    │
│  │   Page content here             │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Rol farqi faqat sidebar badge da:**
- Admin: `bg-primary/20 text-primary` — "Admin"
- Waiter: `bg-blue-500/20 text-blue-400` — "Ofitsiant"
- Kitchen: `bg-violet-500/20 text-violet-400` — "Oshxona"
- Cashier: `bg-emerald-500/20 text-emerald-400` — "Kassa"

---

## 3. O'zgaradigan Fayllar

| # | Fayl | O'zgarish turi |
|---|------|----------------|
| 1 | `tailwind.config.js` | Token qo'shish |
| 2 | `Layouts/WaiterLayout.tsx` | Sidebar → dark, rol badge |
| 3 | `Layouts/KitchenLayout.tsx` | Sidebar → dark, rol badge |
| 4 | `Layouts/CashierLayout.tsx` | Sidebar → dark, rol badge |
| 5 | `Layouts/MenuLayout.tsx` | Footer token tuzatish |
| 6 | `Pages/Kitchen/Dashboard.tsx` | To'liq overhaul |
| 7 | `Pages/Cashier/Dashboard.tsx` | Status card tuzatish |
| 8 | `Pages/Cashier/PendingPayments.tsx` | Button + select tuzatish |
| 9 | `Pages/Waiter/Tables.tsx` | Status rang tuzatish |
| 10 | `Pages/Waiter/ActiveOrders.tsx` | Status rang tuzatish |
| 11 | `Pages/Waiter/OrderCreate.tsx` | Minor token tuzatish |
| 12 | `Pages/Admin/Foods/Edit.tsx` | Layout → max-w-2xl, title prop |
| 13 | `Pages/Admin/Staff/Index.tsx` | Title prop, badge ranglari |
| 14 | `Pages/Admin/Tables/Index.tsx` | Title prop, raw select → shadcn |
| 15 | `Pages/Admin/Restaurant/Index.tsx` | Title prop tuzatish |
| 16 | `Pages/Admin/Settings/Index.tsx` | Title prop, rang tuzatish |
| 17 | `Pages/Admin/Orders/Index.tsx` | `bg-orange-500` → `bg-primary` |
| 18 | `Pages/Admin/Orders/Show.tsx` | `bg-blue-50` → semantic |
| 19 | `Pages/Home.tsx` | Token tuzatish |
| 20 | `Pages/Menu.tsx` | `bg-white` → `bg-card` |
| 21 | `Pages/Account.tsx` | Token tuzatish |

---

## 4. Amalga Oshirish Tartibi

### Bosqich 1: Poydevor (10 daqiqa)
- [ ] `tailwind.config.js` — tokenlar qo'shish

### Bosqich 2: Layoutlar (20 daqiqa)
- [ ] WaiterLayout, KitchenLayout, CashierLayout → dark sidebar

### Bosqich 3: Staff sahifalar (40 daqiqa)
- [ ] Kitchen/Dashboard.tsx
- [ ] Cashier/Dashboard.tsx + PendingPayments.tsx
- [ ] Waiter/Tables.tsx + ActiveOrders.tsx + OrderCreate.tsx

### Bosqich 4: Admin sahifalar (30 daqiqa)
- [ ] Foods/Edit, Staff/Index, Tables/Index, Restaurant, Settings, Orders

### Bosqich 5: Public sahifalar (20 daqiqa)
- [ ] Home.tsx, Menu.tsx, Account.tsx

**Jami taxminiy vaqt:** ~2 soat
