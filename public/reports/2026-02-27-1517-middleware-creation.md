# Middleware Yaratish - 2026-02-27 15:17

## 📋 Vazifa
Role-based access control uchun middlewarelar yaratish

## ✅ Bajarilgan ishlar

### 1. Yangi Middlewarelar Yaratildi
- ✅ `WaiterMiddleware.php` - Ofitsiant uchun
- ✅ `KitchenMiddleware.php` - Oshxona uchun
- ✅ `CashierMiddleware.php` - Kassa uchun

### 2. WaiterMiddleware
**Funksiyasi:**
- Faqat `waiter` yoki `admin` rolli foydalanuvchilarga ruxsat beradi
- JSON so'rovlar uchun 403 xato qaytaradi
- Web so'rovlar uchun home sahifasiga redirect qiladi

**Kod:**
```php
if (!$user || (!$user->isWaiter() && !$user->isAdmin())) {
    // Access denied
}
```

### 3. KitchenMiddleware
**Funksiyasi:**
- Faqat `kitchen` yoki `admin` rolli foydalanuvchilarga ruxsat beradi
- JSON so'rovlar uchun 403 xato qaytaradi
- Web so'rovlar uchun home sahifasiga redirect qiladi

**Kod:**
```php
if (!$user || (!$user->isKitchen() && !$user->isAdmin())) {
    // Access denied
}
```

### 4. CashierMiddleware
**Funksiyasi:**
- Faqat `cashier` yoki `admin` rolli foydalanuvchilarga ruxsat beradi
- JSON so'rovlar uchun 403 xato qaytaradi
- Web so'rovlar uchun home sahifasiga redirect qiladi

**Kod:**
```php
if (!$user || (!$user->isCashier() && !$user->isAdmin())) {
    // Access denied
}
```

### 5. Bootstrap App.php Yangilanishi
**Qo'shilgan aliaslar:**
- `'waiter' => WaiterMiddleware::class`
- `'kitchen' => KitchenMiddleware::class`
- `'cashier' => CashierMiddleware::class`

**Ishlatish:**
```php
Route::middleware(['auth', 'waiter'])->group(function () {
    // Waiter routes
});

Route::middleware(['auth', 'kitchen'])->group(function () {
    // Kitchen routes
});

Route::middleware(['auth', 'cashier'])->group(function () {
    // Cashier routes
});
```

## 🔍 Texnik Tafsilotlar

### Access Control Logic
- Barcha middlewarelar admin rolini ham qo'llab-quvvatlaydi
- JSON va Web so'rovlar uchun alohida javoblar
- Xavfsizlik: foydalanuvchi tekshiruvi, role tekshiruvi

### Middleware Chain
1. Authentication middleware (auth)
2. Role middleware (waiter/kitchen/cashier)
3. Controller

## 📝 Eslatmalar
- Barcha middlewarelar tayyor
- Admin har doim kirish huquqiga ega
- Keyingi qadam: Controllerlar yaratish

## ⏱️ Vaqt
**Boshlanish:** 15:16  
**Tugash:** 15:17  
**Davomiylik:** ~1 daqiqa
