import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Ro\'yxatdan o\'tdingiz',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Ma\'lumotlarni tekshiring',
                });
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Ro'yxatdan o'tish" />

            <div className="text-center mb-6">
                <h1 className="font-display text-2xl font-bold text-foreground">Ro'yxatdan o'tish</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Yangi akkaunt yarating
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                        Ism
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="w-full pl-10 pr-4 py-3 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ismingiz"
                            required
                        />
                    </div>
                    {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-10 pr-4 py-3 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            required
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
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full pl-10 pr-4 py-3 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {errors.password && (
                        <p className="text-destructive text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground mb-1.5">
                        Parolni tasdiqlash
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full pl-10 pr-4 py-3 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-destructive text-sm mt-1">{errors.password_confirmation}</p>
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
                            Ro'yxatdan o'tilmoqda...
                        </>
                    ) : (
                        "Ro'yxatdan o'tish"
                    )}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Allaqachon ro'yxatdan o'tganmisiz?{' '}
                    <Link href={route('login')} className="text-primary font-medium hover:underline">
                        Kirish
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
