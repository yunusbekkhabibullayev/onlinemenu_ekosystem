# Hostingga joylash bo'yicha qo'llanma

## Menu ma'lumotlari chiqmasa

Hostingda menu bo'sh ko'rinsa, quyidagi qadamlarni bajaring:

### 1. Cache tozalash
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### 2. Migration va Seeder
```bash
php artisan migrate --force
php artisan db:seed --force
```

### 3. Storage link
```bash
php artisan storage:link
```

### 4. Environment (.env)
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL` — to'g'ri hosting URL (masalan: `https://sizning-domen.uz`)
- `DB_*` — hosting ma'lumotlar bazasi parametrlari

### 5. Asset build (lokalda qiling)
Hostingda Node.js bo‘lmasa, **lokal mashinada** build qiling va `public/build/` papkasini hostingga yuklang:
```bash
npm ci
npm run build
```
`public/build/` ichidagi barcha fayllar (JS, CSS, manifest.json) hostingda ishlaydi — serverda Node.js talab qilinmaydi.

### 6. Restoran faol ekanligini tekshirish
Admin panelda: **Sozlamalar → Restoran** — "Faol" belgilangan bo'lishi kerak.

---

## Deploy tartibi
1. **Lokalda:** `npm run build` — assetlarni build qiling
2. **Hostingga:** loyiha fayllarini yuklang (shu jumladan `public/build/`)
3. **Hostingda (SSH yoki panel):**
```bash
php artisan migrate --force
php artisan db:seed --force
php artisan cache:clear
php artisan storage:link
```
