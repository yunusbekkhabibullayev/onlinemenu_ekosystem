# Controllerlar Yaratish - 2026-02-27 15:20

## 📋 Vazifa
Barcha controllerlarni yaratish va to'ldirish

## ✅ Bajarilgan ishlar

### 1. Yangi Controllerlar Yaratildi
- ✅ `TableController.php` - Stollar boshqaruvi (Admin)
- ✅ `WaiterController.php` - Ofitsiant funksiyalari
- ✅ `KitchenController.php` - Oshxona funksiyalari
- ✅ `CashierController.php` - Kassa funksiyalari

### 2. TableController
**Metodlar:**
- `index()` - Barcha stollarni ko'rsatadi
- `store()` - Yangi stol yaratadi
- `update()` - Stol ma'lumotlarini yangilaydi
- `destroy()` - Stolni o'chiradi (faol sessiya tekshiruvi bilan)

**Xususiyatlar:**
- Restaurant ID avtomatik olinadi
- Faol sessiya bor stollarni o'chirishga ruxsat bermaydi
- Validation qo'shilgan

### 3. WaiterController
**Metodlar:**
- `tables()` - Barcha stollarni ko'rsatadi (faol sessiyalar bilan)
- `createOrder(Table $table)` - Buyurtma yaratish sahifasi
- `storeOrder(Request $request, Table $table)` - Buyurtma yaratadi
- `activeOrders()` - Faol buyurtmalarni ko'rsatadi
- `markDelivered(Order $order)` - Buyurtmani yetkazildi deb belgilaydi

**Buyurtma Yaratish Jarayoni:**
1. Faol sessiya tekshiriladi yoki yangi sessiya yaratiladi
2. Stol statusi "occupied" ga o'zgartiriladi
3. Buyurtma yaratiladi (pending status)
4. Order items yaratiladi
5. Sessiya total_amount yangilanadi
6. Telegram orqali oshxonaga xabar yuboriladi

**Qo'shimcha Buyurtmalar:**
- `is_additional` flag orqali qo'shimcha buyurtma qo'shiladi
- Bir xil sessiyaga qo'shiladi
- Parent order ID saqlanadi

### 4. KitchenController
**Metodlar:**
- `dashboard()` - Oshxona dashboard (barcha statuslar)
- `orders()` - Barcha buyurtmalar navbat
- `confirm(Order $order)` - Buyurtmani qabul qiladi (pending → confirmed)
- `preparing(Order $order)` - Tayyorlashni boshlaydi (confirmed → preparing)
- `ready(Order $order)` - Tayyor deb belgilaydi (preparing → ready)

**Dashboard Ko'rsatkichlari:**
- Pending orders (kutilayotgan)
- Confirmed orders (tasdiqlangan)
- Preparing orders (tayyorlanayotgan)
- Ready orders (tayyor)

**Xabarlar:**
- Har bir status o'zgarishida ofitsiantga Telegram xabar yuboriladi

### 5. CashierController
**Metodlar:**
- `dashboard()` - Kassa dashboard
- `pendingPayments()` - To'lov kutilayotgan buyurtmalar
- `processPayment(Order $order)` - Bitta buyurtma uchun to'lov
- `sessionPayment(OrderSession $session)` - Butun sessiya uchun to'lov

**To'lov Jarayoni:**
1. Buyurtma delivered statusda bo'lishi kerak
2. Payment yaratiladi
3. Order payment_status yangilanadi (partial/paid)
4. OrderSession paid_amount yangilanadi
5. Agar barcha buyurtmalar to'langan bo'lsa:
   - Sessiya "paid" ga o'zgartiriladi
   - Stol "available" ga o'zgartiriladi

**To'lov Turlari:**
- cash (naqd)
- card (karta)
- online (onlayn)

## 🔍 Texnik Tafsilotlar

### Database Transactions
- Barcha muhim operatsiyalar transaction ichida
- Xatolik bo'lsa rollback qilinadi

### Telegram Integratsiyasi
- Yangi buyurtmalar oshxonaga yuboriladi
- Status o'zgarishlari ofitsiantga yuboriladi
- Xatoliklar logga yoziladi, lekin jarayon to'xtamaydi

### Validation
- Barcha inputlar validate qilinadi
- Xatoliklar foydalanuvchiga ko'rsatiladi

### Business Logic
- Stol statusi avtomatik boshqariladi
- Sessiya total_amount avtomatik hisoblanadi
- Payment status avtomatik yangilanadi

## 📝 Eslatmalar
- Barcha controllerlar tayyor
- Keyingi qadam: Routes sozlash
- Frontend sahifalar keyinroq yaratiladi

## ⏱️ Vaqt
**Boshlanish:** 15:17  
**Tugash:** 15:20  
**Davomiylik:** ~3 daqiqa
