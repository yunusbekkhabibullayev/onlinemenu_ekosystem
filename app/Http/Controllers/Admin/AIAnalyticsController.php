<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\FoodItem;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AIAnalyticsController extends Controller
{
    public function index(): Response
    {
        // 1. Menu Engineering - Mahsulotlarni rentabellik va ommaboplik bo'yicha tahlil qilish
        $menuItems = OrderItem::select('food_item_id', DB::raw('SUM(quantity) as sales_count'), DB::raw('SUM(quantity * price) as revenue'))
            ->with('foodItem:id,name,price,category_id')
            ->groupBy('food_item_id')
            ->get();

        $avgSales = $menuItems->avg('sales_count') ?: 1;
        $avgRevenue = $menuItems->avg('revenue') ?: 1;

        $menuEngineering = $menuItems->map(function ($item) use ($avgSales, $avgRevenue) {
            $isPopular = $item->sales_count >= $avgSales;
            $isProfitable = $item->revenue >= $avgRevenue;

            if ($isPopular && $isProfitable) $label = 'Star';
            elseif ($isPopular && !$isProfitable) $label = 'Plowhorse';
            elseif (!$isPopular && $isProfitable) $label = 'Puzzle';
            else $label = 'Dog';

            return [
                'id' => $item->food_item_id,
                'name' => $item->foodItem?->name ?? 'Noma\'lum',
                'sales_count' => $item->sales_count,
                'revenue' => $item->revenue,
                'label' => $label
            ];
        });

        // 2. Inventory Forecasting - Kunlik va haftalik trendlarni aniqlash
        $forecasting = Order::where('status', 'delivered')
            ->where('created_at', '>=', now()->subDays(14))
            ->select(DB::raw('strftime("%w", created_at) as day_of_week'), DB::raw('COUNT(*) as order_count'))
            ->groupBy('day_of_week')
            ->get()
            ->mapWithKeys(fn($item) => [$item->day_of_week => $item->order_count]);

        // 3. Umumiy statistika
        $stats = [
            'total_orders' => Order::count(),
            'completed_orders' => Order::where('status', 'delivered')->count(),
            'total_revenue' => Order::where('status', 'delivered')->sum('total_amount'),
            'avg_order_value' => Order::where('status', 'delivered')->avg('total_amount') ?: 0,
        ];

        return Inertia::render('Admin/AIAnalytics', [
            'menuEngineering' => $menuEngineering,
            'forecasting' => $forecasting,
            'stats' => $stats,
            'topSelling' => $menuItems->sortByDesc('sales_count')->take(10)->values(), // Eski topSelling ni ham saqlab qolamiz
        ]);
    }

    public function analyze(Request $request)
    {
        $apiKey = env('GROQ_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'Groq API key not found in .env'], 500);
        }

        $data = $request->input('data');

        $prompt = "Siz restoran biznesi analitigi siz. Quyidagi ma'lumotlar asosida restoran egalari uchun tahlil qiling:\n\n" .
                  "Ma'lumotlar:\n" . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n" .
                  "Iltimos quyidagilarni aniqlang:\n" .
                  "1. Eng muvaffaqiyatli mahsulotlar va nega?\n" .
                  "2. Foydalanuvchilarga qanday turdagi yangi mahsulotlarni tavsiya qilish mumkin?\n" .
                  "3. Sotuvni oshirish uchun 3 ta aniq strategiya.\n\n" .
                  "Javobni O'zbek tilida, chiroyli va professional ko'rinishda bering.";

        try {
            $response = Http::withOptions([
                'verify' => false,
            ])->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile', // Yangi va kuchli model
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return response()->json([
                'error' => 'Groq API Error: ' . ($response->json('error.message') ?? $response->body())
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    /** 
     * Smart Upselling AI - Mahsulotga kontekstdan kelib chiqib tavsiya berish
     */
    public function getRecommendations(FoodItem $foodItem)
    {
        $apiKey = env('GROQ_API_KEY');
        
        // 1. Kategoriyalari bilan birga mahsulotlarni olish
        $allMenu = FoodItem::join('categories', 'food_items.category_id', '=', 'categories.id')
            ->select('food_items.*', 'categories.name as category_name')
            ->where('is_available', true)
            ->where('food_items.id', '!=', $foodItem->id)
            ->withCount(['orderItems as sales_count'])
            ->get();

        if (!$apiKey || $allMenu->isEmpty()) return response()->json([]);

        // AIga to'liqroq metadata yuboramiz
        $menuText = $allMenu->map(fn($item) => 
            "ID: {$item->id}, Nomi: {$item->name}, Kategoriya: {$item->category_name}, Sotilgan: {$item->sales_count} ta"
        )->implode("\n");

        $baseCategory = FoodItem::join('categories', 'food_items.category_id', '=', 'categories.id')
            ->where('food_items.id', $foodItem->id)
            ->value('categories.name');

        $prompt = "Siz professional O'zbek milliy restorani maslahatchisisiz. Mijoz '{$foodItem->name}' ({$baseCategory}) tanladi.\n" .
                  "Quyidagi mahsulotlardan mantiqan mos 3 ta ID tanlang:\n\n" .
                  "QOIDALAR:\n" .
                  "1. AGAR KATEGORIYA 'Asosiy taomlar' bo'lsa (Palov, Manti, Lag'mon, Dimlama, Norin va h.k.):\n" .
                  "   - 1-2 ta SALATLAR kategoriyasidan tanlang (Achichuk, Olivye, Yunoncha kabi)\n" .
                  "   - 1 ta ICHIMLIKLAR kategoriyasidan tanlang (Ayron, Kompot, Limonad kabi)\n\n" .
                  "2. AGAR KATEGORIYA 'Sho'rvalar' bo'lsa:\n" .
                  "   - 1 ta SALATLAR kategoriyasidan tanlang\n" .
                  "   - 1 ta ICHIMLIKLAR kategoriyasidan tanlang\n" .
                  "   - 1 ta ASOSIY TAOMLAR yoki boshqa taomdang tanlang\n\n" .
                  "3. AGAR KATEGORIYA 'Kaboblar' bo'lsa:\n" .
                  "   - 1 ta SALATLAR kategoriyasidan tanlang (Achichuk kabob bilan ajoyib)\n" .
                  "   - 1 ta boshqa KABOBLAR kategoriyasidan tanlang\n" .
                  "   - 1 ta ICHIMLIKLAR kategoriyasidan tanlang\n\n" .
                  "4. AGAR KATEGORIYA 'Salatlar' bo'lsa:\n" .
                  "   - 1 ta ASOSIY TAOMLAR kategoriyasidan tanlang\n" .
                  "   - 1 ta ICHIMLIKLAR kategoriyasidan tanlang\n" .
                  "   - 1 ta KABOBLAR yoki boshqa taomdang tanlang\n\n" .
                  "5. AGAR KATEGORIYA 'Ichimliklar' bo'lsa:\n" .
                  "   - 1 ta ASOSIY TAOMLAR kategoriyasidan tanlang\n" .
                  "   - 1 ta SALATLAR kategoriyasidan tanlang\n" .
                  "   - 1 ta SHIRINLIKLAR kategoriyasidan tanlang\n\n" .
                  "6. AGAR KATEGORIYA 'Shirinliklar' bo'lsa:\n" .
                  "   - 1 ta ICHIMLIKLAR kategoriyasidan tanlang (choy yaxshi mos keladi)\n" .
                  "   - 2 ta boshqa SHIRINLIKLAR kategoriyasidan tanlang\n\n" .
                  "MUHIM QOIDALAR:\n" .
                  "- '{$foodItem->name}' ning o'zini hech qachon qaytarmang\n" .
                  "- Har xil kategoriyalardan tanlang, bir kategoriyadan ko'pi bilan 2 ta\n" .
                  "- Eng ko'p sotilgan mahsulotlarga ustunlik bering\n\n" .
                  "Menyu:\n{$menuText}\n\n" .
                  "Javob format (faqat raqamlar): [ID1, ID2, ID3]";

        try {
            $response = Http::withOptions(['verify' => false])->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [['role' => 'user', 'content' => $prompt]],
                'temperature' => 0.0,
            ]);

            $content = $response->json('choices.0.message.content');
            preg_match('/\[\s*(\d+(\s*,\s*\d+)*)?\s*\]/', $content, $matches);
            $ids = isset($matches[0]) ? json_decode($matches[0]) : [];
            
            $recommendations = FoodItem::whereIn('id', $ids)
                ->where('name', 'not like', '%Choy%')
                ->where('name', 'not like', '%choy%')
                ->get();

            return response()->json($recommendations->take(3));

        } catch (\Exception $e) {
            return response()->json(FoodItem::where('id', '!=', $foodItem->id)->inRandomOrder()->take(3)->get());
        }
    }
}
