<?php

namespace App\Http\Controllers;

use App\Models\Table;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TableController extends Controller
{
    public function index(): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();
        $tables = Table::where('restaurant_id', $restaurant?->id ?? 1)
            ->orderBy('number')
            ->get();

        return Inertia::render('Admin/Tables/Index', [
            'tables' => $tables,
            'restaurant' => $restaurant,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'number' => 'required|string|max:50',
            'name' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1|max:20',
            'status' => 'required|in:available,occupied,reserved,cleaning',
            'is_active' => 'boolean',
        ]);

        $restaurant = Restaurant::where('is_active', true)->first();

        Table::create([
            'restaurant_id' => $restaurant?->id ?? 1,
            'number' => $validated['number'],
            'name' => $validated['name'] ?? null,
            'capacity' => $validated['capacity'],
            'status' => $validated['status'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.tables.index')
            ->with('success', 'Stol yaratildi');
    }

    public function update(Request $request, Table $table): RedirectResponse
    {
        $validated = $request->validate([
            'number' => 'required|string|max:50',
            'name' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1|max:20',
            'status' => 'required|in:available,occupied,reserved,cleaning',
            'is_active' => 'boolean',
        ]);

        $table->update($validated);

        return redirect()->route('admin.tables.index')
            ->with('success', 'Stol yangilandi');
    }

    public function qrcode(Table $table): HttpResponse
    {
        $botUsername = config('services.telegram.bot_username', 'your_bot');
        $url = "https://t.me/{$botUsername}?start=table_{$table->id}";

        $qrCode = QrCode::format('png')
            ->size(300)
            ->margin(2)
            ->generate($url);

        return response($qrCode)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', "attachment; filename=\"stol-{$table->number}-qr.png\"");
    }

    public function destroy(Table $table): RedirectResponse
    {
        // Check if table has active sessions
        if ($table->activeSession()) {
            return redirect()->route('admin.tables.index')
                ->with('error', 'Stolda faol buyurtma sessiyasi bor. Avval sessiyani yoping.');
        }

        $table->delete();

        return redirect()->route('admin.tables.index')
            ->with('success', 'Stol o\'chirildi');
    }
}
