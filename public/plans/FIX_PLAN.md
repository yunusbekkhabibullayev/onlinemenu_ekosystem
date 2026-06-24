# Online Menu — Kamchiliklar Tuzatish Rejasi

**Sana:** 01.03.2026  
**Holat:** Jarayonda  
**Jami kamchiliklar:** 5 ta

---

## Kamchilik #1 — Real-vaqt yangilanish (Polling)

### Muammo
Oshxona (`/kitchen/dashboard`) va Ofitsiant (`/waiter/orders/active`) panellari
sahifani qo'lda yangilashni talab qiladi. Yangi buyurtma kelsa xodimlar
bilmaydi — bu restoran uchun kritik muammo.

### Yechim
**Auto-polling** — har 15 soniyada Inertia `router.reload()` chaqirish.
WebSocket emas, chunki sodda va server sozlamasi talab qilmaydi.

### O'zgaradigan fayllar
| Fayl | Amal |
|------|------|
| `resources/js/Pages/Kitchen/Dashboard.tsx` | `useEffect` + `setInterval` polling qo'shish |
| `resources/js/Pages/Waiter/ActiveOrders.tsx` | `useEffect` + `setInterval` polling qo'shish |
| `resources/js/Pages/Waiter/Tables.tsx` | `useEffect` + `setInterval` polling qo'shish |

### Kod misoli
```tsx
// Har 15 soniyada yangilash
useEffect(() => {
    const interval = setInterval(() => {
        router.reload({ only: ['pendingOrders', 'confirmedOrders', 'preparingOrders', 'readyOrders'] });
    }, 15000);
    return () => clearInterval(interval);
}, []);
```

### Qo'shimcha
- Yangi buyurtma kelsa `sonner` toast bilan xabar berish
- Buyurtmalar soni o'zgarsa `document.title` ni yangilash (masalan: `(3) Oshxona`)
- Foydalanuvchi sahifada faol bo'lmaganda (`document.hidden`) polling to'xtatish

---

## Kamchilik #2 — Daromad hisoblash xatosi

### Muammo
`Admin/DashboardController.php` da `totalRevenue` faqat `delivered` statusli
buyurtmalarni sanaydi. `paid` statusli buyurtmalar e'tiborga olinmaydi — bu
aslida to'langan buyurtmalar. Natijada admin panel noto'g'ri summa ko'rsatadi.

### Yechim
`whereIn('status', ['delivered', 'paid'])` qilib to'g'irlash.
Bundan tashqari `todayRevenue` (bugungi daromad) statistikasini ham qo'shish.

### O'zgaradigan fayllar
| Fayl | Amal |
|------|------|
| `app/Http/Controllers/Admin/DashboardController.php` | `totalRevenue` va `todayRevenue` ni tuzatish |

### Joriy kod (noto'g'ri)
```php
'totalRevenue' => Order::where('status', 'delivered')
    ->sum(\DB::raw('total_amount + delivery_price')),
```

### To'g'rilangan kod
```php
'totalRevenue' => Order::whereIn('status', ['delivered', 'paid'])
    ->sum(DB::raw('total_amount + delivery_price')),

'todayRevenue' => Order::whereIn('status', ['delivered', 'paid'])
    ->whereDate('created_at', $today)
    ->sum(DB::raw('total_amount + delivery_price')),
```

---

## Kamchilik #3 — Route parametr muvofiqsizligi

### Muammo
`WaiterController::storeOrder` metodi imzosi:
```php
public function storeOrder(Request $request, Table $table)
```
Lekin route:
```php
Route::post('/orders', [WaiterController::class, 'storeOrder']);
```
Route'da `{table}` parametri yo'q — Laravel `Table $table` ni route'dan
olishga urinadi, topa olmaydi va xato chiqadi.

### Yechim
Route'ni `POST /tables/{table}/orders` ga o'zgartirish YOKI
`storeOrder` metodidan `Table $table` ni olib, uni `request()->input('table_id')`
orqali olish.

**Tanlangan yechim:** Route'ni to'g'irlash — bu mantiqan to'g'riroq.

### O'zgaradigan fayllar
| Fayl | Amal |
|------|------|
| `routes/web.php` | Waiter order.store route'ni `POST /tables/{table}/orders` ga o'zgartirish |
| `resources/js/Pages/Waiter/OrderCreate.tsx` | Form action URL ni yangilash |

### Joriy route (noto'g'ri)
```php
Route::post('/orders', [WaiterController::class, 'storeOrder'])->name('order.store');
```

### To'g'rilangan route
```php
Route::post('/tables/{table}/orders', [WaiterController::class, 'storeOrder'])->name('order.store');
```

---

## Kamchilik #4 — Pagination (Sahifalash)

### Muammo
`Admin/OrderController::index()` barcha buyurtmalarni bir sahifada yuklaydi:
```php
$orders = Order::with('items.foodItem')->latest()->get(); // BARCHASI
```
100+ buyurtma bo'lsa sahifa sekin ochiladi va xotira ko'p ketadi.

### Yechim
Laravel `paginate()` + Inertia pagination + Frontend pagination komponent.

### O'zgaradigan fayllar
| Fayl | Amal |
|------|------|
| `app/Http/Controllers/Admin/OrderController.php` | `get()` → `paginate(20)` |
| `resources/js/Pages/Admin/Orders/Index.tsx` | Pagination komponent qo'shish |
| `app/Http/Controllers/KitchenController.php` | `orders()` metodiga pagination |
| `resources/js/Pages/Kitchen/Orders.tsx` | Pagination komponent qo'shish |

### Kod misoli (Controller)
```php
$orders = Order::with('items.foodItem')
    ->latest()
    ->paginate(20);
```

### Kod misoli (Frontend)
```tsx
// Pagination links
{orders.links && (
    <div className="flex justify-center gap-2 mt-4">
        {orders.links.map((link, i) => (
            <Link
                key={i}
                href={link.url ?? '#'}
                className={cn(
                    'px-3 py-1 rounded border text-sm',
                    link.active ? 'bg-orange-500 text-white' : 'bg-white hover:bg-gray-50'
                )}
                dangerouslySetInnerHTML={{ __html: link.label }}
            />
        ))}
    </div>
)}
```

---

## Kamchilik #5 — QR Kod Generatsiyasi

### Muammo
Restoran stollar uchun QR kod yo'q. Mijoz stolga o'tirganda
Telegram Mini App'ni ochish uchun QR kodni skanerlashi kerak.
Hozirda bu funksiya umuman mavjud emas.

### Yechim
`simplesoftwareio/simple-qrcode` paketi orqali har bir stol uchun
QR kod generatsiya qilish. QR kod — stol uchun Telegram bot URL'ni kodlashtiradi.

### O'zgaradigan fayllar
| Fayl | Amal |
|------|------|
| `composer.json` | `simplesoftwareio/simple-qrcode` paketi qo'shish |
| `app/Http/Controllers/TableController.php` | `qrcode()` metodi qo'shish |
| `routes/web.php` | QR kod route qo'shish |
| `resources/js/Pages/Admin/Tables/Index.tsx` | QR yuklab olish tugmasi qo'shish |

### QR URL formati
```
https://t.me/{BOT_USERNAME}?start=table_{TABLE_ID}
```

### Yangi route
```php
Route::get('/tables/{table}/qrcode', [TableController::class, 'qrcode'])
    ->name('tables.qrcode');
```

### Controller metodi
```php
public function qrcode(Table $table): Response
{
    $botUsername = config('services.telegram.bot_username');
    $url = "https://t.me/{$botUsername}?start=table_{$table->id}";
    $qrCode = QrCode::format('png')->size(300)->generate($url);
    
    return response($qrCode)
        ->header('Content-Type', 'image/png')
        ->header('Content-Disposition', "attachment; filename=\"stol-{$table->number}-qr.png\"");
}
```

---

## Amalga Oshirish Tartibi

| # | Kamchilik | Murakkablik | Holat |
|---|-----------|-------------|-------|
| 1 | Daromad hisoblash xatosi | Oson | ✅ Bajarildi |
| 2 | Route parametr muvofiqsizligi | Oson | ✅ Bajarildi |
| 3 | Real-vaqt yangilanish (Polling) | O'rta | ✅ Bajarildi |
| 4 | Pagination | O'rta | ✅ Bajarildi |
| 5 | QR Kod | O'rta | ✅ Bajarildi |

**Barcha 5 ta kamchilik tuzatildi — 01.03.2026**

**Jami taxminiy vaqt:** ~2 soat

---

## Eslatmalar

- Har bir tuzatishdan keyin `php artisan cache:clear` ishga tushirish
- Route o'zgartirilganda `php artisan route:cache` ni tozalash
- QR kod uchun `composer require simplesoftwareio/simple-qrcode` kerak
- Polling 15 soniya — ko'proq bo'lsa kech, kamroq bo'lsa server yuklanadi
