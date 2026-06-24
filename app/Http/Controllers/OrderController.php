<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\FoodItem;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate
            $validated = $request->validate([
                'phone' => 'required|string|min:9|max:25',
                'items' => 'required|array|min:1',
                'items.*.id' => 'required|integer',
                'items.*.quantity' => 'required|integer|min:1',
                'notes' => 'nullable|string|max:500',
            ]);

            // Clean phone number (remove spaces and special characters except +)
            $phone = preg_replace('/[^\d+]/', '', $validated['phone']);

            $restaurant = Restaurant::where('is_active', true)->first();

            if (!$restaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restoran topilmadi',
                ], 404);
            }

            // Calculate total
            $totalAmount = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $foodItem = FoodItem::find($item['id']);
                if ($foodItem) {
                    $totalAmount += $foodItem->price * $item['quantity'];
                    $orderItems[] = [
                        'food_item_id' => $foodItem->id,
                        'quantity' => $item['quantity'],
                        'price' => $foodItem->price,
                        'name' => $foodItem->name,
                    ];
                }
            }

            if (empty($orderItems)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Taomlar topilmadi',
                ], 400);
            }

            // Create order in transaction
            DB::beginTransaction();

            $order = Order::create([
                'restaurant_id' => $restaurant->id,
                'user_id' => auth()->id(),
                'phone' => $phone,
                'total_amount' => $totalAmount,
                'delivery_price' => $restaurant->delivery_price ?? 0,
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_item_id' => $item['food_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            // Send to Telegram with inline buttons (don't fail if this fails)
            try {
                $telegramService = new TelegramService();
                $results = $telegramService->sendOrderNotificationWithButtons($order, $orderItems, $restaurant);

                // Save first message ID for reference
                if (!empty($results)) {
                    $firstMessageId = array_values(array_filter($results))[0] ?? null;
                    if ($firstMessageId) {
                        $order->update(['telegram_message_id' => $firstMessageId]);
                    }
                }
            } catch (\Exception $e) {
                Log::error('Telegram notification failed: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Buyurtma qabul qilindi!',
                'order_number' => $order->order_number,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validatsiya xatosi: ' . implode(', ', array_map(fn($errors) => implode(', ', $errors), $e->errors())),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Xatolik yuz berdi: ' . $e->getMessage(),
            ], 500);
        }
    }
}
