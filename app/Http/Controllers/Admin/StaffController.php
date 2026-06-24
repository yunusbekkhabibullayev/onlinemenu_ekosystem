<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    /**
     * Display a listing of staff members (waiter, kitchen, cashier)
     */
    public function index(): Response
    {
        $staff = User::whereIn('role', ['waiter', 'kitchen', 'cashier'])
            ->orderBy('role')
            ->orderBy('name')
            ->get();

        // Group by role
        $groupedStaff = [
            'waiter' => $staff->where('role', 'waiter')->values(),
            'kitchen' => $staff->where('role', 'kitchen')->values(),
            'cashier' => $staff->where('role', 'cashier')->values(),
        ];

        return Inertia::render('Admin/Staff/Index', [
            'staff' => $staff,
            'groupedStaff' => $groupedStaff,
        ]);
    }

    /**
     * Show the form for creating a new staff member
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Staff/Create');
    }

    /**
     * Store a newly created staff member
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username|regex:/^[a-zA-Z0-9_.-]+$/',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:waiter,kitchen,cashier',
            'employee_code' => 'nullable|string|max:50|unique:users',
            'is_active' => 'boolean',
        ]);

        // Generate employee code if not provided
        if (empty($validated['employee_code'])) {
            $rolePrefix = match($validated['role']) {
                'waiter' => 'W',
                'kitchen' => 'K',
                'cashier' => 'C',
                default => 'E',
            };
            
            $lastCode = User::where('role', $validated['role'])
                ->where('employee_code', 'like', $rolePrefix . '%')
                ->orderBy('employee_code', 'desc')
                ->value('employee_code');
            
            $nextNumber = $lastCode ? (int)substr($lastCode, 1) + 1 : 1;
            $validated['employee_code'] = $rolePrefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        }

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'employee_code' => $validated['employee_code'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Xodim yaratildi');
    }

    /**
     * Show the form for editing the specified staff member
     */
    public function edit(User $staff): Response
    {
        // Only allow editing staff members (not admin)
        if ($staff->role === 'admin') {
            abort(403, 'Admin foydalanuvchisini tahrirlash mumkin emas');
        }

        if (!in_array($staff->role, ['waiter', 'kitchen', 'cashier'])) {
            abort(403, 'Faqat xodimlarni tahrirlash mumkin');
        }

        return Inertia::render('Admin/Staff/Edit', [
            'staff' => $staff,
        ]);
    }

    /**
     * Update the specified staff member
     */
    public function update(Request $request, User $staff): RedirectResponse
    {
        // Only allow editing staff members (not admin)
        if ($staff->role === 'admin') {
            abort(403, 'Admin foydalanuvchisini tahrirlash mumkin emas');
        }

        if (!in_array($staff->role, ['waiter', 'kitchen', 'cashier'])) {
            abort(403, 'Faqat xodimlarni tahrirlash mumkin');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $staff->id . '|regex:/^[a-zA-Z0-9_.-]+$/',
            'email' => 'required|string|email|max:255|unique:users,email,' . $staff->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:waiter,kitchen,cashier',
            'employee_code' => 'nullable|string|max:50|unique:users,employee_code,' . $staff->id,
            'is_active' => 'boolean',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'employee_code' => $validated['employee_code'] ?? $staff->employee_code,
            'is_active' => $validated['is_active'] ?? $staff->is_active,
        ];

        // Update password only if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $staff->update($updateData);

        return redirect()->route('admin.staff.index')
            ->with('success', 'Xodim ma\'lumotlari yangilandi');
    }

    /**
     * Remove the specified staff member
     */
    public function destroy(User $staff): RedirectResponse
    {
        // Only allow deleting staff members (not admin)
        if ($staff->role === 'admin') {
            abort(403, 'Admin foydalanuvchisini o\'chirish mumkin emas');
        }

        if (!in_array($staff->role, ['waiter', 'kitchen', 'cashier'])) {
            abort(403, 'Faqat xodimlarni o\'chirish mumkin');
        }

        $staff->delete();

        return redirect()->route('admin.staff.index')
            ->with('success', 'Xodim o\'chirildi');
    }
}
