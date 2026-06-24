# Xodimlar Moduli Yaratish - 2026-02-27 16:49

## 📋 Vazifa
Admin qismida xodimlar modulini qo'shish (waiter, kitchen, cashier) va CRUD amallarini bajarish

## ✅ Bajarilgan ishlar

### 1. Backend

#### StaffController Yaratildi
**Fayl:** `app/Http/Controllers/Admin/StaffController.php`

**Funksiyalar:**
- ✅ `index()` - Xodimlar ro'yxati (waiter, kitchen, cashier)
- ✅ `create()` - Yangi xodim yaratish formasi
- ✅ `store()` - Yangi xodim yaratish
- ✅ `edit()` - Xodimni tahrirlash formasi
- ✅ `update()` - Xodimni yangilash
- ✅ `destroy()` - Xodimni o'chirish

**Xususiyatlar:**
- Faqat waiter, kitchen, cashier rollaridagi foydalanuvchilar ko'rsatiladi
- Admin foydalanuvchilarni tahrirlash/o'chirish mumkin emas
- Employee code avtomatik yaratiladi (W001, K001, C001)
- Parol hashing
- Validation

#### Routes Qo'shildi
**Fayl:** `routes/web.php`

```php
Route::resource('staff', StaffController::class)->except(['show']);
```

**Route'lar:**
- `GET /admin/staff` - Index
- `GET /admin/staff/create` - Create
- `POST /admin/staff` - Store
- `GET /admin/staff/{staff}/edit` - Edit
- `PUT /admin/staff/{staff}` - Update
- `DELETE /admin/staff/{staff}` - Destroy

### 2. Frontend

#### AdminLayout Yangilandi
**Fayl:** `resources/js/Layouts/AdminLayout.tsx`

**Qo'shilgan:**
- `Users` icon import qilindi
- Navigation'ga "Xodimlar" item qo'shildi

#### Index Sahifasi
**Fayl:** `resources/js/Pages/Admin/Staff/Index.tsx`

**Funksiyalar:**
- ✅ Xodimlar ro'yxati (table format)
- ✅ Role bo'yicha guruhlash (waiter, kitchen, cashier)
- ✅ Statistika kartalar (har bir rol uchun)
- ✅ CRUD amallar (Edit, Delete)
- ✅ Role badge'lar (rangli)
- ✅ Status badge'lar (Faol/Nofaol)

**UI Elementlar:**
- Stats cards (3 ta: Ofitsiantlar, Oshxona, Kassa)
- Table view
- Edit button
- Delete dialog
- Create button

#### Create Sahifasi
**Fayl:** `resources/js/Pages/Admin/Staff/Create.tsx`

**Form Fields:**
- ✅ Ism (required)
- ✅ Email (required, unique)
- ✅ Rol (waiter, kitchen, cashier)
- ✅ Xodim kodi (optional, avtomatik yaratiladi)
- ✅ Parol (required, min 8)
- ✅ Parolni tasdiqlash (required)
- ✅ Faol/Nofaol switch

#### Edit Sahifasi
**Fayl:** `resources/js/Pages/Admin/Staff/Edit.tsx`

**Form Fields:**
- ✅ Ism (required)
- ✅ Email (required, unique)
- ✅ Rol (waiter, kitchen, cashier)
- ✅ Xodim kodi (optional)
- ✅ Yangi parol (optional)
- ✅ Yangi parolni tasdiqlash (conditional)
- ✅ Faol/Nofaol switch

**Xususiyatlar:**
- Parol ixtiyoriy (faqat o'zgartirish uchun)
- Parol tasdiqlash faqat parol kiritilganda ko'rsatiladi

### 3. UI Komponentlar

#### Select Komponenti Yaratildi
**Fayl:** `resources/js/Components/ui/select.tsx`

**Funksiyalar:**
- Radix UI Select primitives
- Dropdown menu
- Animatsiyalar
- Oq fon (bg-white)

## 🔍 Texnik Tafsilotlar

### Role Mapping
- **waiter** → "Ofitsiant" (blue badge)
- **kitchen** → "Oshxona" (orange badge)
- **cashier** → "Kassa" (green badge)

### Employee Code Format
- **Waiter:** W001, W002, ...
- **Kitchen:** K001, K002, ...
- **Cashier:** C001, C002, ...

### Validation Rules
- Name: required, string, max:255
- Email: required, email, unique
- Password: required (create), optional (update), min:8, confirmed
- Role: required, in:waiter,kitchen,cashier
- Employee Code: optional, unique

## 📝 Eslatmalar
- Faqat waiter, kitchen, cashier rollaridagi foydalanuvchilar ko'rsatiladi
- Admin foydalanuvchilarni tahrirlash/o'chirish mumkin emas
- Employee code avtomatik yaratiladi
- Parol hashing ishlatiladi
- Toast notifications (Sonner)

## ⏱️ Vaqt
**Boshlanish:** 16:35  
**Tugash:** 16:49  
**Davomiylik:** ~14 daqiqa
