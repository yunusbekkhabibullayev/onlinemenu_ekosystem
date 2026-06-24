# 🍽️ Online Menu - Restaurant Ordering System

Restoran uchun online menu va buyurtma boshqaruv tizimi. Laravel 12 + React (Inertia.js) + TypeScript + Telegram Bot integratsiyasi.

## 🚀 Texnologiyalar

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Database:** SQLite
- **Integratsiyalar:** Telegram Bot API, Telegram Mini App

## 📋 Talablar

- PHP 8.2+
- Node.js 18+ (v24.13.0 tavsiya etiladi)
- npm 11+ (v11.6.2 tavsiya etiladi)
- Composer

## ⚙️ O'rnatish

### 1. Dependencies o'rnatish

```bash
# PHP dependencies
composer install

# Node.js dependencies
npm install --legacy-peer-deps
```

### 2. Environment sozlash

`.env` faylini yarating va quyidagilarni to'ldiring:

```env
APP_NAME="Online Menu"
APP_URL=http://localhost:8000

TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_IDS=chat_id1,chat_id2

DB_CONNECTION=sqlite
```

### 3. Database

```bash
php artisan migrate
php artisan db:seed  # ixtiyoriy
```

### 4. Build

```bash
npm run build
```

### 5. Ishga tushirish

```bash
# Development
php artisan serve
npm run dev

# Yoki bir vaqtning o'zida
composer run dev
```

## 🔧 PowerShell Execution Policy Muammosi

Agar PowerShell'da `npm install` ishlamasa, quyidagi yechimlardan birini tanlang:

### Yechim 1: Execution Policy o'zgartirish (Tavsiya etiladi)

PowerShell'ni **Administrator** sifatida oching va quyidagilarni bajaring:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Yoki `fix-powershell.ps1` scriptini ishga tushiring (Administrator huquqlari bilan).

### Yechim 2: CMD orqali ishlatish

PowerShell o'rniga **CMD** yoki **Git Bash** ishlating:

```bash
npm install --legacy-peer-deps
```

### Yechim 3: npm scriptlarini to'g'ridan-to'g'ri ishlatish

```bash
# CMD orqali
cmd /c npm install --legacy-peer-deps
cmd /c npm run build
cmd /c npm run dev
```

## 📱 Telegram Bot Sozlash

1. [@BotFather](https://t.me/botfather) orqali bot yarating
2. Bot token'ni oling
3. `.env` fayliga qo'shing: `TELEGRAM_BOT_TOKEN=your_token`
4. Webhook o'rnatish: Admin panel → Settings → Set Webhook

## 🎯 Asosiy Funksiyalar

- ✅ Online menu ko'rish va qidirish
- ✅ Savatga qo'shish va buyurtma berish
- ✅ Telegram orqali buyurtma boshqarish
- ✅ Admin panel (Dashboard, Kategoriyalar, Taomlar, Buyurtmalar)
- ✅ Telegram Mini App authentication
- ✅ Real-time buyurtma status o'zgarishlari

## 📖 Qo'shimcha Ma'lumot

Loyiha haqida batafsil ma'lumot uchun kod ichidagi commentlarni ko'ring.

---

