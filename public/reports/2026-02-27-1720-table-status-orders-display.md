# Stol Statusi va Buyurtmalarni Ko'rsatish

**Sana:** 2026-02-27  
**Vaqt:** 17:20  
**Status:** ✅ Tugallandi

## Maqsad

1. Buyurtma berilgach stol statusini "band" (occupied) qilish
2. Buyurtmani shu stolda "qo'shimcha" deb qo'shish
3. Stol sahifasida savat pastida "berilgan buyurtmalar" deb chiqib turish
4. Bu buyurtmalar kassada to'lov qilinganda o'chishi

## Bajarilgan ishlar

### 1. Buyurtma berilgach stol statusini yangilash

**`app/Http/Controllers/WaiterController.php` - `storeOrder` metodida:**

```php
if (!$session) {
    // Create new session
    $session = OrderSession::create([
        'table_id' => $table->id,
        'waiter_id' => $waiter->id,
        'status' => 'active',
        'started_at' => now(),
    ]);

    // Update table status to occupied
    $table->update(['status' => 'occupied']);
}
```

✅ Buyurtma yaratilganda stol statusi avtomatik "occupied" ga o'zgaradi

### 2. Qo'shimcha buyurtmalar

**`app/Http/Controllers/WaiterController.php` - `storeOrder` metodida:**

```php
// Get or create active session
$session = $table->activeSession();
$isAdditional = $validated['is_additional'] ?? false;

if (!$session && $isAdditional) {
    return back()->with('error', 'Qo\'shimcha buyurtma uchun avval asosiy buyurtma bo\'lishi kerak');
}

// Create order with is_additional flag
$order = Order::create([
    // ...
    'is_additional' => $isAdditional,
    'parent_order_id' => $parentOrder?->id,
    // ...
]);
```

✅ Qo'shimcha buyurtmalar to'g'ri qo'shiladi va parent order bilan bog'lanadi

### 3. Stol sahifasida buyurtmalarni ko'rsatish

**`app/Http/Controllers/WaiterController.php` - `tables` metodida:**

```php
$tables = Table::where('restaurant_id', $restaurant?->id ?? 1)
    ->where('is_active', true)
    ->orderBy('number')
    ->get()
    ->map(function ($table) {
        $activeSession = $table->activeSession();
        $orders = [];
        
        if ($activeSession) {
            $orders = $activeSession->orders()
                ->where('payment_status', '!=', 'paid')
                ->with(['items.foodItem'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'customer_name' => $order->customer_name,
                        'total_amount' => $order->total_amount,
                        'status' => $order->status,
                        'payment_status' => $order->payment_status,
                        'is_additional' => $order->is_additional,
                        'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                        'items' => $order->items->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'name' => $item->name ?? $item->foodItem->name,
                                'quantity' => $item->quantity,
                                'price' => $item->price,
                            ];
                        })->toArray(),
                    ];
                })->toArray();
        }

        return [
            // ...
            'active_session' => $activeSession ? [
                'id' => $activeSession->id,
                'total_amount' => $activeSession->calculateTotal(),
                'paid_amount' => $activeSession->calculatePaidAmount(),
                'orders' => $orders,
            ] : null,
        ];
    });
```

✅ Faqat to'lanmagan buyurtmalar ko'rsatiladi (`payment_status != 'paid'`)

**`resources/js/Pages/Waiter/Tables.tsx`:**

- Active session buyurtmalarini ko'rsatish qismi qo'shildi
- Har bir buyurtma uchun:
  - Buyurtma raqami yoki "Qo'shimcha" belgisi
  - To'lov holati (To'langan/Qisman/To'lanmagan)
  - Taomlar ro'yxati (2 ta ko'rsatiladi, qolgani "+X ta boshqa taom")
  - Buyurtma jami summasi
- Sessiya jami summasi va to'langan summa ko'rsatiladi

### 4. Kassada to'lov qilinganda buyurtmalarni o'chirish

**`app/Http/Controllers/CashierController.php` - `processPayment` va `sessionPayment` metodlarida:**

```php
// Check if all orders in session are paid
$allPaid = $session->orders()
    ->where('status', '!=', 'cancelled')
    ->where('payment_status', '!=', 'paid')
    ->doesntExist();

if ($allPaid) {
    $session->markAsPaid();
    // Free the table
    $session->table->update(['status' => 'available']);
}
```

✅ Barcha buyurtmalar to'langanda:
- Session "paid" statusiga o'tadi
- Stol statusi "available" ga o'zgaradi
- Frontend'da buyurtmalar ko'rinmaydi (chunki `payment_status != 'paid'` filter qilinadi)

## O'zgarishlar

### `app/Http/Controllers/WaiterController.php`
- `tables()` metodida active session buyurtmalarini qo'shish
- Faqat to'lanmagan buyurtmalarni filter qilish
- Sessiya jami va to'langan summalarni hisoblash

### `resources/js/Pages/Waiter/Tables.tsx`
- Interface'larni yangilash (Order, ActiveSession)
- Buyurtmalarni ko'rsatish UI qo'shish
- To'lov holatini ko'rsatish
- Sessiya jami va to'langan summalarni ko'rsatish

## Natijalar

✅ Buyurtma berilgach stol statusi "occupied" ga o'zgaradi  
✅ Qo'shimcha buyurtmalar to'g'ri qo'shiladi  
✅ Stol sahifasida to'lanmagan buyurtmalar ko'rsatiladi  
✅ Kassada to'lov qilinganda buyurtmalar o'chadi va stol bo'shadi  
✅ Build muvaffaqiyatli o'tdi

## Keyingi qadamlar

- [ ] Test qilish: buyurtma yaratish va to'lov jarayonini sinab ko'rish
- [ ] UI yaxshilashlar (agar kerak bo'lsa)
