import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Tizimga kirdingiz',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Email yoki parol noto\'g\'ri',
                });
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Kirish" />

            <div className="text-center mb-6">
                <h1 className="font-display text-2xl font-bold text-foreground">Kirish</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Admin paneliga kirish uchun ma'lumotlarni kiriting
                </p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email yoki username */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email yoki username
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            id="email"
                            type="text"
                            name="email"
                            value={data.email}
                            className="w-full pl-10 pr-4 py-3 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin yoki email@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                        Parol
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="w-full pl-10 pr-12 py-3 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-destructive text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-muted-foreground text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Eslab qolish
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-primary hover:underline"
                        >
                            Parolni unutdingizmi?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Kirish...
                        </>
                    ) : (
                        'Kirish'
                    )}
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Akkauntingiz yo'qmi?{' '}
                    <Link href={route('register')} className="text-primary font-medium hover:underline">
                        Ro'yxatdan o'ting
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
