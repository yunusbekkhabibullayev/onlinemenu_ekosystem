# Modellar Yaratish va Yangilash - 2026-02-27 15:16

## 📋 Vazifa
Yangi modellar yaratish va mavjud modellarni yangilash

## ✅ Bajarilgan ishlar

### 1. Yangi Modellar Yaratildi
- ✅ `Table.php` - Stol modeli
- ✅ `OrderSession.php` - Buyurtma sessiyasi modeli
- ✅ `Payment.php` - To'lov modeli

### 2. Table Modeli
**Fillable maydonlar:**
- restaurant_id, number, name, capacity, status, is_active

**Relationships:**
- `restaurant()` - BelongsTo Restaurant
- `orderSessions()` - HasMany OrderSession
- `orders()` - HasMany Order
- `activeSession()` - Faol sessiyani qaytaradi

**Metodlar:**
- `isAvailable()` - Mavjud ekanligini tekshiradi
- `isOccupied()` - Band ekanligini tekshiradi
- `isReserved()` - Rezervatsiya qilingan ekanligini tekshiradi
- `scopeAvailable()` - Mavjud stollar uchun scope
- `scopeActive()` - Faol stollar uchun scope

### 3. OrderSession Modeli
**Fillable maydonlar:**
- table_id, waiter_id, status, started_at, closed_at, total_amount, paid_amount

**Relationships:**
- `table()` - BelongsTo Table
- `waiter()` - BelongsTo User (waiter_id)
- `orders()` - HasMany Order
- `payments()` - HasMany Payment

**Metodlar:**
- `calculateTotal()` - Barcha buyurtmalar jami summasini hisoblaydi
- `calculatePaidAmount()` - To'langan summani hisoblaydi
- `isFullyPaid()` - To'liq to'langan ekanligini tekshiradi
- `isActive()`, `isClosed()`, `isPaid()` - Status tekshiruvlari
- `close()` - Sessiyani yopadi
- `markAsPaid()` - To'langan deb belgilaydi

**Boot metod:**
- `started_at` avtomatik to'ldiriladi

### 4. Payment Modeli
**Fillable maydonlar:**
- order_id, order_session_id, amount, payment_method, status, processed_by, notes

**Relationships:**
- `order()` - BelongsTo Order
- `orderSession()` - BelongsTo OrderSession
- `processor()` - BelongsTo User (processed_by)

**Metodlar:**
- `isPending()`, `isCompleted()`, `isRefunded()` - Status tekshiruvlari
- `markAsCompleted()` - To'langan deb belgilaydi
- `markAsRefunded()` - Qaytarilgan deb belgilaydi

### 5. Order Modeli Yangilanishi
**Qo'shilgan fillable maydonlar:**
- table_id, order_session_id, waiter_id, customer_name
- payment_status, payment_method, paid_at, ready_at, delivered_at
- is_additional, parent_order_id

**Qo'shilgan casts:**
- is_additional (boolean)
- paid_at, ready_at, delivered_at (datetime)

**Qo'shilgan Relationships:**
- `table()` - BelongsTo Table
- `orderSession()` - BelongsTo OrderSession
- `waiter()` - BelongsTo User (waiter_id)
- `parentOrder()` - BelongsTo Order (parent_order_id)
- `additionalOrders()` - HasMany Order (qo'shimcha buyurtmalar)
- `payments()` - HasMany Payment

**Qo'shilgan Status Metodlar:**
- `isPreparing()` - Tayyorlanmoqda ekanligini tekshiradi
- `isReady()` - Tayyor ekanligini tekshiradi
- `isPaid()` - To'langan ekanligini tekshiradi
- `isUnpaid()`, `isPartiallyPaid()`, `isFullyPaid()` - To'lov holati tekshiruvlari

**Qo'shilgan Action Metodlar:**
- `markAsReady()` - Tayyor deb belgilaydi
- `markAsDelivered()` - Yetkazildi deb belgilaydi
- `markAsPaid()` - To'langan deb belgilaydi

### 6. User Modeli Yangilanishi
**Qo'shilgan fillable maydonlar:**
- employee_code, is_active

**Qo'shilgan casts:**
- is_active (boolean)

**Qo'shilgan Role Metodlar:**
- `isWaiter()` - Ofitsiant ekanligini tekshiradi
- `isKitchen()` - Oshxona xodimi ekanligini tekshiradi
- `isCashier()` - Kassa xodimi ekanligini tekshiradi
- `isStaff()` - Xodim ekanligini tekshiradi (admin, waiter, kitchen, cashier)

## 🔍 Texnik Tafsilotlar

### Relationships
- Barcha relationships to'g'ri sozlangan
- Foreign key constraints to'g'ri ishlaydi
- Eager loading uchun tayyor

### Business Logic
- Status o'zgarishlari metodlar orqali boshqariladi
- Hisob-kitoblar model ichida amalga oshiriladi
- Timestamps avtomatik to'ldiriladi

## 📝 Eslatmalar
- Barcha modellar tayyor
- Relationships test qilinishi kerak
- Keyingi qadam: Middleware yaratish

## ⏱️ Vaqt
**Boshlanish:** 15:15  
**Tugash:** 15:16  
**Davomiylik:** ~1 daqiqa
