# 🍽️ Online Menu - Rivojlantirish Rejasi

## 📋 Loyiha Maqsadi

Restoran uchun to'liq avtomatlashtirilgan buyurtma boshqaruv tizimi:
- **Mijoz** - menuni ko'radi
- **Ofitsiant** - stol va taomlarni tanlaydi, tasdiqlaydi
- **Oshxona** - buyurtmalarni tayyorlaydi
- **Kassa** - to'lovni qabul qiladi

---

## 🎯 Asosiy O'zgarishlar

### 1. Database Strukturasi

#### 1.1. Yangi Jadval: `tables` (Stollar)
```php
- id
- restaurant_id (FK)
- number (stol raqami: "1", "2", "VIP-1")
- name (ixtiyoriy: "Oyna yonida", "Balkon")
- capacity (sig'im: 4, 6, 8)
- status (available, occupied, reserved, cleaning)
- is_active
- created_at, updated_at
```

#### 1.2. Yangi Jadval: `order_sessions` (Buyurtma Sessiyalari)
```php
- id
- table_id (FK)
- waiter_id (FK -> users, ofitsiant)
- status (active, closed, paid)
- started_at
- closed_at
- total_amount (barcha buyurtmalar jami)
- paid_amount
- created_at, updated_at
```

#### 1.3. `orders` jadvalini yangilash
```php
// Qo'shiladigan maydonlar:
- table_id (FK, nullable - delivery uchun)
- order_session_id (FK, nullable - qo'shimcha buyurtmalar uchun)
- waiter_id (FK -> users, ofitsiant)
- customer_name (mijoz ismi, nullable)
- status: 'pending' → 'confirmed' → 'preparing' → 'ready' → 'delivered' → 'paid'
- payment_status: 'unpaid', 'partial', 'paid'
- payment_method: 'cash', 'card', 'online', null
- paid_at (timestamp, nullable)
- ready_at (timestamp, nullable - oshxona tayyorlagan vaqt)
- delivered_at (timestamp, nullable)
- is_additional (boolean) - qo'shimcha buyurtma ekanligi
- parent_order_id (FK, nullable) - asosiy buyurtma
```

#### 1.4. Yangi Jadval: `payments` (To'lovlar)
```php
- id
- order_id (FK)
- order_session_id (FK, nullable)
- amount
- payment_method: 'cash', 'card', 'online'
- status: 'pending', 'completed', 'refunded'
- processed_by (FK -> users, kassa)
- notes
- created_at, updated_at
```

#### 1.5. `users` jadvalini yangilash
```php
// Qo'shiladigan maydonlar:
- role: 'admin', 'waiter', 'kitchen', 'cashier', 'user'
- employee_code (xodim kodi: "W001", "K001")
- is_active
```

---

### 2. Modellar

#### 2.1. Yangi Modellar
- `Table.php` - Stol modeli
- `OrderSession.php` - Buyurtma sessiyasi
- `Payment.php` - To'lov modeli

#### 2.2. Yangilangan Modellar
- `Order.php` - yangi relationshiplar va metodlar
- `User.php` - role helper metodlari

---

### 3. Buyurtma Jarayoni (Workflow)

#### 3.1. Yangi Buyurtma (Ofitsiant)
```
1. Ofitsiant stolni tanlaydi
2. Menu itemslarni tanlaydi
3. "Tasdiqlash" bosadi
4. Buyurtma yaratiladi (status: pending)
5. Xabar yuboriladi:
   - Oshxona dashboardga
   - Telegram botga (oshxona chat ID)
```

#### 3.2. Oshxona Qabul Qiladi
```
1. Oshxona dashboardda buyurtmani ko'radi
2. "Qabul qilish" bosadi
3. Status: pending → confirmed
4. Xabar yuboriladi:
   - Ofitsiantga (Telegram yoki dashboard)
```

#### 3.3. Tayyorlash
```
1. Oshxona "Tayyorlanmoqda" bosadi
2. Status: confirmed → preparing
3. Xabar yuboriladi:
   - Ofitsiantga
```

#### 3.4. Tayyor Bo'ldi
```
1. Oshxona "Tayyor" bosadi
2. Status: preparing → ready
3. ready_at timestamp saqlanadi
4. Xabar yuboriladi:
   - Ofitsiantga (Telegram + Dashboard)
```

#### 3.5. Yetkazib Berildi
```
1. Ofitsiant "Yetkazib berildi" bosadi
2. Status: ready → delivered
3. delivered_at timestamp saqlanadi
4. Xabar yuboriladi:
   - Kassaga (to'lov uchun)
```

#### 3.6. To'lov
```
1. Kassa to'lovni qabul qiladi
2. Payment yaratiladi
3. Order status: delivered → paid
4. OrderSession status: active → paid (agar barcha buyurtmalar to'langanda)
5. Table status: occupied → available
6. Xabar yuboriladi:
   - Ofitsiantga (buyurtma tugallandi)
```

#### 3.7. Qo'shimcha Buyurtma
```
1. Ofitsiant bir xil stolga qo'shimcha buyurtma qiladi
2. order_session_id bir xil bo'ladi
3. is_additional = true
4. parent_order_id = birinchi buyurtma ID
5. Jarayon 3.1 dan boshlanadi
```

---

### 4. Controllerlar

#### 4.1. Yangi Controllerlar
- `TableController.php` - Stollar boshqaruvi
- `WaiterController.php` - Ofitsiant uchun
- `KitchenController.php` - Oshxona uchun
- `CashierController.php` - Kassa uchun
- `OrderSessionController.php` - Buyurtma sessiyalari

#### 4.2. Yangilangan Controllerlar
- `OrderController.php` - yangi workflow
- `Admin/OrderController.php` - yangi statuslar

---

### 5. Frontend (React Pages)

#### 5.1. Yangi Sahifalar
- `Waiter/TableSelection.tsx` - Stol tanlash
- `Waiter/OrderCreate.tsx` - Buyurtma yaratish
- `Waiter/ActiveOrders.tsx` - Faol buyurtmalar
- `Kitchen/Dashboard.tsx` - Oshxona dashboard
- `Kitchen/OrderQueue.tsx` - Buyurtmalar navbat
- `Cashier/Dashboard.tsx` - Kassa dashboard
- `Cashier/Payment.tsx` - To'lov qabul qilish

#### 5.2. Yangilangan Sahifalar
- `Menu.tsx` - stol tanlash qo'shish (ofitsiant uchun)
- `Admin/Orders/Index.tsx` - yangi statuslar
- `Admin/Orders/Show.tsx` - to'liq workflow

---

### 6. Routes

#### 6.1. Ofitsiant Routes
```php
Route::middleware(['auth', 'waiter'])->prefix('waiter')->name('waiter.')->group(function () {
    Route::get('/tables', [WaiterController::class, 'tables'])->name('tables');
    Route::get('/tables/{table}/order', [WaiterController::class, 'createOrder'])->name('order.create');
    Route::post('/orders', [WaiterController::class, 'storeOrder'])->name('order.store');
    Route::get('/orders/active', [WaiterController::class, 'activeOrders'])->name('orders.active');
    Route::put('/orders/{order}/delivered', [WaiterController::class, 'markDelivered'])->name('order.delivered');
});
```

#### 6.2. Oshxona Routes
```php
Route::middleware(['auth', 'kitchen'])->prefix('kitchen')->name('kitchen.')->group(function () {
    Route::get('/dashboard', [KitchenController::class, 'dashboard'])->name('dashboard');
    Route::get('/orders', [KitchenController::class, 'orders'])->name('orders');
    Route::put('/orders/{order}/confirm', [KitchenController::class, 'confirm'])->name('order.confirm');
    Route::put('/orders/{order}/preparing', [KitchenController::class, 'preparing'])->name('order.preparing');
    Route::put('/orders/{order}/ready', [KitchenController::class, 'ready'])->name('order.ready');
});
```

#### 6.3. Kassa Routes
```php
Route::middleware(['auth', 'cashier'])->prefix('cashier')->name('cashier.')->group(function () {
    Route::get('/dashboard', [CashierController::class, 'dashboard'])->name('dashboard');
    Route::get('/orders/pending-payment', [CashierController::class, 'pendingPayments'])->name('orders.pending');
    Route::post('/orders/{order}/payment', [CashierController::class, 'processPayment'])->name('payment.process');
    Route::get('/sessions/{session}/payment', [CashierController::class, 'sessionPayment'])->name('session.payment');
});
```

---

### 7. Middleware

#### 7.1. Yangi Middleware
- `WaiterMiddleware.php` - ofitsiant tekshiruvi
- `KitchenMiddleware.php` - oshxona tekshiruvi
- `CashierMiddleware.php` - kassa tekshiruvi

---

### 8. Telegram Integratsiyasi

#### 8.1. Yangi Xabar Turlari
- Oshxona uchun: yangi buyurtma, status o'zgarishlari
- Ofitsiant uchun: tayyor bo'ldi, to'lov qilindi
- Kassa uchun: to'lov kerak bo'lgan buyurtmalar

#### 8.2. Yangilangan Service
- `TelegramService.php` - yangi xabar formatlari

---

### 9. Real-time Updates

#### 9.1. WebSocket yoki Polling
- Dashboardlarda real-time yangilanishlar
- Laravel Echo + Pusher yoki Polling

---

### 10. Database Migrations

#### 10.1. Yangi Migrations
1. `create_tables_table.php`
2. `create_order_sessions_table.php`
3. `create_payments_table.php`
4. `add_table_fields_to_orders_table.php`
5. `add_role_fields_to_users_table.php`

---

## 📅 Amalga Oshirish Tartibi

### Bosqich 1: Database va Modellar (1-2 kun)
- [ ] Migrations yaratish
- [ ] Modellar yaratish
- [ ] Relationshiplar sozlash
- [ ] Seederlar (test ma'lumotlar)

### Bosqich 2: Backend Logic (2-3 kun)
- [ ] Controllerlar yaratish
- [ ] Middleware yaratish
- [ ] Routes sozlash
- [ ] Validation va Business Logic

### Bosqich 3: Telegram Integratsiya (1 kun)
- [ ] Yangi xabar formatlari
- [ ] Role-based xabarlar
- [ ] Testing

### Bosqich 4: Frontend - Ofitsiant (2-3 kun)
- [ ] Stol tanlash sahifasi
- [ ] Buyurtma yaratish
- [ ] Faol buyurtmalar
- [ ] Real-time updates

### Bosqich 5: Frontend - Oshxona (2 kun)
- [ ] Dashboard
- [ ] Buyurtmalar navbat
- [ ] Status o'zgartirish
- [ ] Real-time updates

### Bosqich 6: Frontend - Kassa (2 kun)
- [ ] Dashboard
- [ ] To'lov qabul qilish
- [ ] Buyurtma sessiyalari
- [ ] Hisobotlar

### Bosqich 7: Testing va Debugging (2-3 kun)
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Performance optimization

### Bosqich 8: Documentation (1 kun)
- [ ] User manual
- [ ] API documentation
- [ ] Deployment guide

---

## 🔄 Buyurtma Status Oqimi

```
pending (Kutilmoqda)
    ↓ [Oshxona qabul qiladi]
confirmed (Tasdiqlangan)
    ↓ [Oshxona boshlaydi]
preparing (Tayyorlanmoqda)
    ↓ [Oshxona tayyorlaydi]
ready (Tayyor)
    ↓ [Ofitsiant olib ketadi]
delivered (Yetkazildi)
    ↓ [Kassa to'lov qabul qiladi]
paid (To'langan) ✅
```

---

## 📊 Asosiy Xususiyatlar

### Ofitsiant
- ✅ Stol tanlash
- ✅ Buyurtma yaratish
- ✅ Faol buyurtmalarni ko'rish
- ✅ Qo'shimcha buyurtma qilish
- ✅ "Yetkazildi" belgilash
- ✅ Real-time bildirishnomalar

### Oshxona
- ✅ Yangi buyurtmalarni ko'rish
- ✅ Buyurtmani qabul qilish
- ✅ Tayyorlash jarayonini boshqarish
- ✅ "Tayyor" belgilash
- ✅ Buyurtmalar navbat
- ✅ Real-time yangilanishlar

### Kassa
- ✅ To'lov kerak bo'lgan buyurtmalar
- ✅ To'lov qabul qilish
- ✅ Buyurtma sessiyalari
- ✅ Hisobotlar
- ✅ To'lov tarixi

### Admin
- ✅ Barcha buyurtmalarni ko'rish
- ✅ Stollar boshqaruvi
- ✅ Xodimlar boshqaruvi
- ✅ Statistika
- ✅ Sozlamalar

---

## 🎨 UI/UX Dizayn

### Ranglar (Statuslar)
- `pending` - Sariq 🟡
- `confirmed` - Ko'k 🔵
- `preparing` - Binafsha 🟣
- `ready` - Yashil 🟢
- `delivered` - To'q yashil 🟢
- `paid` - Kulrang ⚪

### Real-time Indicators
- Yangi buyurtma - yonib-o'chib turadi
- Urgent - qizil rang
- Time tracking - vaqt ko'rsatkichlari

---

## 🔐 Xavfsizlik

- Role-based access control
- CSRF protection
- Input validation
- SQL injection prevention
- XSS protection

---

## 📱 Mobile Responsive

Barcha sahifalar mobil qurilmalarda ham ishlashi kerak.

---

## 🚀 Keyingi Qadamlar (Future)

- [ ] Mijozlar uchun mobil app
- [ ] Online to'lov integratsiyasi
- [ ] Loyiha tizimi
- [ ] Inventory management
- [ ] Analytics va reporting
- [ ] Multi-restaurant support
- [ ] QR code menu
- [ ] Customer loyalty program

---

## 📝 Eslatmalar

- Barcha vaqtlar UTC saqlanadi, frontend'da local time ko'rsatiladi
- Real-time updates uchun polling yoki WebSocket ishlatiladi
- Telegram xabarlari barcha bosqichlarda yuboriladi
- Buyurtma sessiyalari bir stol uchun bitta bo'ladi
- Qo'shimcha buyurtmalar bir xil sessiyaga qo'shiladi
