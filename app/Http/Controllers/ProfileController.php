<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information (name, email only — no file).
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // avatar faylini PATCH da qabul qilmaymiz — buning uchun alohida POST /profile/avatar
        unset($data['avatar']);

        $user->fill($data);
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Upload/update avatar only (POST, multipart/form-data).
     * Har qanday rasm formatini WebP ga o'girib saqlaydi (GD yordamida).
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:10240'],
        ]);

        $user  = $request->user();
        $file  = $request->file('avatar');
        $webp  = $this->convertToWebp($file->getRealPath());

        // Eski avatarni o'chirish
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // WebP faylni saqlash
        $filename = 'avatars/' . uniqid('av_', true) . '.webp';
        Storage::disk('public')->put($filename, $webp);

        $user->avatar = $filename;
        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Istalgan rasm faylini GD orqali WebP formatga o'giradi.
     */
    private function convertToWebp(string $sourcePath): string
    {
        $mime = mime_content_type($sourcePath);

        $image = match (true) {
            str_contains($mime, 'jpeg') => imagecreatefromjpeg($sourcePath),
            str_contains($mime, 'png')  => imagecreatefrompng($sourcePath),
            str_contains($mime, 'gif')  => imagecreatefromgif($sourcePath),
            str_contains($mime, 'webp') => imagecreatefromwebp($sourcePath),
            str_contains($mime, 'bmp')  => imagecreatefrombmp($sourcePath),
            default                     => imagecreatefromstring(file_get_contents($sourcePath)),
        };

        // PNG / GIF shaffofligini saqlash
        if (str_contains($mime, 'png') || str_contains($mime, 'gif')) {
            imagepalettetotruecolor($image);
            imagealphablending($image, true);
            imagesavealpha($image, true);
        }

        ob_start();
        imagewebp($image, null, 85);
        $data = ob_get_clean();
        imagedestroy($image);

        return $data;
    }

    /**
     * Delete the user's account (faqat admin uchun).
     */
    public function destroy(Request $request): RedirectResponse
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Hisobni o\'chirish ruxsati yo\'q.');
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
