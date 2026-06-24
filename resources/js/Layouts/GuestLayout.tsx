import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Store, ArrowLeft } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Back to Home Link */}
            <div className="w-full max-w-md mb-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Bosh sahifaga qaytish
                </Link>
            </div>

            {/* Logo */}
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-md">
                        <Store className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="font-display text-2xl font-bold text-foreground">
                        Restaurant
                    </span>
                </Link>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-6 md:p-8">
                {children}
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-muted-foreground">
                © 2026 Restaurant Menu App
            </p>
        </div>
    );
}
