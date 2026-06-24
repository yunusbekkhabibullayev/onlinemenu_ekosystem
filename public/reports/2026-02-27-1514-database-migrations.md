# Database Migrations - 2026-02-27 15:14

## 📋 Vazifa
Database strukturasini yangilash: yangi jadvallar va maydonlar qo'shish

## ✅ Bajarilgan ishlar

### 1. Yangi Migration Fayllari Yaratildi
- ✅ `2026_02_27_151436_create_tables_table.php` - Stollar jadvali
- ✅ `2026_02_27_151440_create_order_sessions_table.php` - Buyurtma sessiyalari
- ✅ `2026_02_27_151442_create_payments_table.php` - To'lovlar jadvali
- ✅ `2026_02_27_151444_add_table_fields_to_orders_table.php` - Orders jadvaliga yangi maydonlar
- ✅ `2026_02_27_151446_add_role_fields_to_users_table.php` - Users jadvaliga yangi maydonlar

### 2. Tables Jadvali (Stollar)
**Maydonlar:**
- `id` - Primary key
- `restaurant_id` - Foreign key (restaurants)
- `number` - Stol raqami (unique: restaurant_id + number)
- `name` - Stol nomi (nullable)
- `capacity` - Sig'im (default: 4)
- `status` - enum: 'available', 'occupied', 'reserved', 'cleaning'
- `is_active` - Faollik holati
- `timestamps`

### 3. Order Sessions Jadvali (Buyurtma Sessiyalari)
**Maydonlar:**
- `id` - Primary key
- `table_id` - Foreign key (tables)
- `waiter_id` - Foreign key (users, nullable)
- `status` - enum: 'active', 'closed', 'paid'
- `started_at` - Sessiya boshlangan vaqt
- `closed_at` - Sessiya yopilgan vaqt (nullable)
- `total_amount` - Barcha buyurtmalar jami
- `paid_amount` - To'langan summa
- `timestamps`

### 4. Payments Jadvali (To'lovlar)
**Maydonlar:**
- `id` - Primary key
- `order_id` - Foreign key (orders, nullable)
- `order_session_id` - Foreign key (order_sessions, nullable)
- `amount` - To'lov summasi
- `payment_method` - enum: 'cash', 'card', 'online'
- `status` - enum: 'pending', 'completed', 'refunded'
- `processed_by` - Foreign key (users, nullable) - Kassa xodimi
- `notes` - Qo'shimcha eslatmalar
- `timestamps`

### 5. Orders Jadvali Yangilanishi
**Qo'shilgan maydonlar:**
- `table_id` - Foreign key (tables, nullable) - Delivery uchun null bo'lishi mumkin
- `order_session_id` - Foreign key (order_sessions, nullable) - Qo'shimcha buyurtmalar uchun
- `waiter_id` - Foreign key (users, nullable) - Ofitsiant
- `customer_name` - Mijoz ismi (nullable)
- `status` - Yangilandi: 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'paid', 'cancelled'
- `payment_status` - enum: 'unpaid', 'partial', 'paid'
- `payment_method` - enum: 'cash', 'card', 'online' (nullable)
- `paid_at` - To'lov vaqti (nullable)
- `ready_at` - Tayyor bo'lgan vaqt (nullable)
- `delivered_at` - Yetkazib berilgan vaqt (nullable)
- `is_additional` - Qo'shimcha buyurtma ekanligi (boolean)
- `parent_order_id` - Asosiy buyurtma ID (nullable)

### 6. Users Jadvali Yangilanishi
**Qo'shilgan/O'zgartirilgan maydonlar:**
- `role` - Yangilandi: 'admin', 'waiter', 'kitchen', 'cashier', 'user'
- `employee_code` - Xodim kodi (nullable): "W001", "K001"
- `is_active` - Faollik holati (boolean)

## 🔍 Texnik Tafsilotlar

### Foreign Key Constraints
- Barcha foreign keylar `onDelete('cascade')` yoki `onDelete('set null')` bilan sozlangan
- Unique constraint: `tables` jadvalida `restaurant_id + number` kombinatsiyasi

### Enum Values
- **Table status:** available, occupied, reserved, cleaning
- **Order session status:** active, closed, paid
- **Payment status:** pending, completed, refunded
- **Payment method:** cash, card, online
- **Order status:** pending, confirmed, preparing, ready, delivered, paid, cancelled
- **Order payment status:** unpaid, partial, paid
- **User role:** admin, waiter, kitchen, cashier, user

## 📝 Eslatmalar
- Barcha migrationlar tayyor
- Keyingi qadam: Modellar yaratish
- Migrationlarni ishga tushirishdan oldin backup olish tavsiya etiladi

## ⏱️ Vaqt
**Boshlanish:** 15:14  
**Tugash:** 15:15  
**Davomiylik:** ~1 daqiqa
