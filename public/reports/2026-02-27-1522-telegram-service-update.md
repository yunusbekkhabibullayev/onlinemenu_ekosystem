# TelegramService Yangilash - 2026-02-27 15:22

## 📋 Vazifa
TelegramService va TelegramWebhookController'ni yangi workflow uchun yangilash

## ✅ Bajarilgan ishlar

### 1. TelegramService Yangilanishi

#### formatOrderMessage() Yangilandi
**Qo'shilgan ma'lumotlar:**
- Stol ma'lumotlari (agar mavjud bo'lsa)
- Mijoz ismi (agar mavjud bo'lsa)
- Ofitsiant ma'lumotlari
- Qo'shimcha buyurtma ko'rsatkichi
- Eslatmalar (agar mavjud bo'lsa)

**Xabar formati:**
```
🆕 Yangi buyurtma #ORD-XXXXX

📅 27.02.2026 15:20

🪑 Stol: #5 (Oyna yonida)
👤 Mijoz: Ali Valiyev
👨‍💼 Ofitsiant: John Doe
➕ Qo'shimcha buyurtma

🍽 Buyurtmalar:
• Taom nomi (2x) - 50 000 UZS
...

💰 Jami: 100 000 UZS

📝 Eslatma: Tezroq tayyorlang

🏪 Restaurant Name
```

#### getKeyboardForStatus() Yangilandi
**Yangi statuslar:**
- `pending` → "✅ Qabul qilish" / "❌ Bekor qilish"
- `confirmed` → "👨‍🍳 Tayyorlashni boshlash"
- `preparing` → "✅ Tayyor"
- `ready` → Tugmalar yo'q (ofitsiant dashboarddan belgilaydi)

#### formatStatusUpdateMessage() Yangilandi
**Yangi statuslar:**
- `ready` - "✅ Tayyor"
- `paid` - "💳 To'langan"

**Qo'shilgan ma'lumotlar:**
- Stol ma'lumotlari (agar mavjud bo'lsa)
- Telefon faqat delivery buyurtmalar uchun

**Status o'zgarish xabarlari:**
- `confirmed` → "Buyurtma qabul qilindi! Tayyorlash boshlandi."
- `preparing` → "Buyurtma tayyorlanmoqda. Biroz kuting!"
- `ready` → "⚠️ Buyurtma tayyor! Ofitsiantga xabar yuborildi."
- `delivered` → "Buyurtma yetkazildi. To'lovni kutamiz."
- `paid` → "✅ Buyurtma to'liq to'langan. Rahmat!"

### 2. TelegramWebhookController Yangilanishi

#### Callback Query Handler Yangilandi
**Yangi callback pattern:**
- `order_ready_{orderId}` qo'shildi

**Status Map Yangilandi:**
```php
'confirm' => 'confirmed',
'cancel' => 'cancelled',
'preparing' => 'preparing',
'ready' => 'ready',  // YANGI
'delivered' => 'delivered',
```

**Valid Transitions Yangilandi:**
```php
'pending' => ['confirmed', 'cancelled'],
'confirmed' => ['preparing', 'cancelled'],
'preparing' => ['ready', 'cancelled'],  // YANGI
'ready' => ['delivered', 'cancelled'],  // YANGI
'delivered' => ['paid'],  // YANGI
'paid' => [],
'cancelled' => [],
```

**Status Labels Yangilandi:**
- `ready` → "✅ Tayyor"
- `paid` → "💳 To'langan"

## 🔍 Texnik Tafsilotlar

### Xabar Formatlari
- Stol buyurtmalari uchun alohida format
- Delivery buyurtmalari uchun telefon ko'rsatiladi
- Qo'shimcha buyurtmalar alohida belgilanadi

### Status Workflow
1. `pending` - Kutilmoqda
2. `confirmed` - Qabul qilindi
3. `preparing` - Tayyorlanmoqda
4. `ready` - Tayyor ⚠️
5. `delivered` - Yetkazildi
6. `paid` - To'langan ✅

### Telegram Bot Funksiyalari
- Oshxona uchun: yangi buyurtmalar, status o'zgarishlari
- Ofitsiant uchun: tayyor bo'lgan buyurtmalar haqida xabar
- Kassa uchun: to'lov kerak bo'lgan buyurtmalar (keyinchalik qo'shiladi)

## 📝 Eslatmalar
- Barcha yangi statuslar qo'llab-quvvatlanadi
- Xabar formatlari yangilandi
- Keyingi qadam: Frontend sahifalar yaratish

## ⏱️ Vaqt
**Boshlanish:** 15:21  
**Tugash:** 15:22  
**Davomiylik:** ~1 daqiqa
