import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, Truck, Phone, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import MenuLayout from '@/Layouts/MenuLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useCart } from '@/Contexts/CartContext';
import { Restaurant } from '@/types';

interface Props {
    restaurant: Restaurant | null;
    deliveryPrice: number;
}

// Valid Uzbekistan operator codes
const VALID_OPERATOR_CODES = ['90', '99', '91', '95', '97', '88', '20', '50', '33', '93', '94', '77', '92', '55'];

// Phone validation
const validateUzbekPhone = (phone: string): { isValid: boolean; error: string } => {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length !== 12) return { isValid: false, error: 'phoneIncomplete' };
    if (!cleaned.startsWith('998')) return { isValid: false, error: 'invalidFormat' };
    const operatorCode = cleaned.substring(3, 5);
    if (!VALID_OPERATOR_CODES.includes(operatorCode)) return { isValid: false, error: 'invalidOperator' };
    return { isValid: true, error: '' };
};

// Format phone +998 XX XXX XX XX
const formatPhoneDisplay = (value: string): string => {
    const digits = value.replace(/[^\d]/g, '');
    let normalized = digits.startsWith('998') ? digits : '998' + digits.slice(0, 9);
    normalized = normalized.slice(0, 12);

    let formatted = '+998';
    const after = normalized.slice(3);
    if (after.length > 0) formatted += ' ' + after.slice(0, 2);
    if (after.length > 2) formatted += ' ' + after.slice(2, 5);
    if (after.length > 5) formatted += ' ' + after.slice(5, 7);
    if (after.length > 7) formatted += ' ' + after.slice(7, 9);
    return formatted;
};

export default function Cart({ restaurant, deliveryPrice }: Props) {
    const { t } = useLanguage();
    const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phone, setPhone] = useState('+998 ');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const grandTotal = totalPrice + deliveryPrice;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length < 4) {
            setPhone('+998 ');
            return;
        }
        setPhone(formatPhoneDisplay(value));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            setError(t('cartEmpty'));
            return;
        }

        const validation = validateUzbekPhone(phone);
        if (!validation.isValid) {
            setError(t(validation.error));
            return;
        }

        setIsSubmitting(true);
        setError('');

        // Get CSRF token from multiple sources
        const getCsrfToken = (): string => {
            // Try meta tag first
            const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (metaToken) return metaToken;

            // Try cookie (Laravel stores XSRF-TOKEN in cookie)
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'XSRF-TOKEN') {
                    return decodeURIComponent(value);
                }
            }

            return '';
        };

        const csrfToken = getCsrfToken();

        if (!csrfToken) {
            console.error('CSRF token not found');
            setError('Session xatosi. Sahifani yangilang.');
            toast.error('Session xatosi', {
                description: 'Sahifani yangilab qayta urinib ko\'ring',
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/orders', {
                method: 'POST',
                credentials: 'same-origin', // Important for cookies
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    phone: phone,
                    items: items.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            // Handle 419 specifically
            if (response.status === 419) {
                console.error('CSRF token expired');
                setError('Session muddati tugadi. Sahifani yangilang.');
                toast.error('Session muddati tugadi', {
                    description: 'Sahifani yangilab qayta urinib ko\'ring',
                });
                // Reload page to get new CSRF token
                setTimeout(() => window.location.reload(), 2000);
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', response.status, errorText);
                setError(`Server xatosi: ${response.status}`);
                return;
            }

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                toast.success('Buyurtma qabul qilindi!', {
                    description: `Buyurtma raqami: ${data.order_number}`,
                });
                setTimeout(() => {
                    clearCart();
                    setIsModalOpen(false);
                    setIsSuccess(false);
                    setPhone('+998 ');
                }, 2000);
            } else {
                toast.error('Xatolik!', {
                    description: data.message || t('orderError'),
                });
                setError(data.message || t('orderError'));
            }
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Xatolik!', {
                description: t('orderError'),
            });
            setError(t('orderError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <MenuLayout>
                <Head title={t('cart')} />
                <main className="flex flex-col items-center justify-center min-h-[60vh] lg:min-h-[80vh] px-4 pb-24">
                    <div className="text-center max-w-sm w-full">
                        {/* Uzum Tezkor uslubidagi bo'sh savat */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-primary/70" />
                            </div>
                        </div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Bo&apos;m-bo&apos;sh
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base mb-8">
                            Bu yerda siz buyurtmaga qo&apos;shgan mazali taomlar chiqadi
                        </p>
                        <Link
                            href="/menu"
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-semibold text-base hover:bg-primary/90 transition-colors"
                        >
                            Menyuga o&apos;tish
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Link>
                    </div>
                </main>
            </MenuLayout>
        );
    }

    return (
        <MenuLayout>
            <Head title={t('cart')} />

            <header className="sticky top-14 z-30 bg-card border-b border-border px-4 lg:px-6 xl:px-8 py-3 lg:py-4 shrink-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="font-display text-xl lg:text-2xl xl:text-3xl font-bold">{t('cart')}</h1>
                    <span className="text-sm lg:text-base text-muted-foreground">
                        {items.length} {t('items')}
                    </span>
                </div>
            </header>

            {/* Main Content - Responsive Layout */}
            <div className="max-w-7xl mx-auto lg:flex lg:gap-8 xl:gap-12 lg:p-6 xl:p-8">
                {/* Cart Items */}
                <main className="flex-1 px-4 lg:px-0 py-4 lg:py-0">
                    <div className="space-y-3 md:space-y-4 lg:space-y-5 pb-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-card rounded-2xl lg:rounded-3xl p-3 md:p-4 lg:p-5 xl:p-6 shadow-card flex gap-3 md:gap-4 lg:gap-5 animate-fade-in"
                            >
                                {/* Image */}
                                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-xl lg:rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                                    {item.image ? (
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-2xl md:text-3xl lg:text-4xl">🍽️</span>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <h3 className="font-semibold text-sm md:text-base lg:text-lg xl:text-xl line-clamp-1">{item.name}</h3>
                                    <p className="text-primary font-bold text-sm md:text-base lg:text-lg mt-1 lg:mt-2">
                                        {formatPrice(item.price)} {t('currency')}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-2 lg:pt-3">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 lg:gap-2.5 bg-secondary rounded-full p-1 lg:p-1.5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-card hover:bg-muted transition-colors"
                                            >
                                                <Minus className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                                            </button>
                                            <span className="text-sm md:text-base lg:text-lg font-semibold min-w-[1.5rem] lg:min-w-[2rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="hidden md:block text-right">
                                            <span className="font-bold text-base lg:text-lg xl:text-xl">
                                                {formatPrice(item.price * item.quantity)} {t('currency')}
                                            </span>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 lg:p-3 text-destructive hover:bg-destructive/10 rounded-lg lg:rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Order Summary - Sidebar on desktop, bottom fixed on mobile */}
                <aside className="lg:w-96 xl:w-[420px] shrink-0">
                    {/* Mobile - Fixed at bottom */}
                    <div className="lg:hidden shrink-0 bg-card border-t border-border p-4 pb-24">
                        <div className="max-w-lg mx-auto space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('subtotal')}</span>
                                <span>{formatPrice(totalPrice)} {t('currency')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Truck className="w-4 h-4" />
                                    {t('delivery')}
                                </span>
                                <span>{formatPrice(deliveryPrice)} {t('currency')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                                <span>{t('total')}</span>
                                <span className="text-primary">{formatPrice(grandTotal)} {t('currency')}</span>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-colors mt-2"
                            >
                                {t('placeOrder')}
                            </button>
                        </div>
                    </div>

                    {/* Desktop - Sticky sidebar */}
                    <div className="hidden lg:block sticky top-24 bg-card rounded-2xl p-6 shadow-card">
                        <h2 className="font-display text-lg font-semibold mb-4">{t('orderSummary')}</h2>

                        {/* Items summary */}
                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                                    <span>{formatPrice(item.price * item.quantity)} UZS</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('subtotal')}</span>
                                <span>{formatPrice(totalPrice)} {t('currency')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Truck className="w-4 h-4" />
                                    {t('delivery')}
                                </span>
                                <span>{formatPrice(deliveryPrice)} {t('currency')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl pt-3 border-t border-border">
                                <span>{t('total')}</span>
                                <span className="text-primary">{formatPrice(grandTotal)} {t('currency')}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors mt-6"
                        >
                            {t('placeOrder')}
                        </button>
                    </div>
                </aside>
            </div>

            {/* Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
                        onClick={() => !isSubmitting && setIsModalOpen(false)}
                    />
                    <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-elevated animate-scale-in">
                        <h2 className="font-display text-xl font-semibold mb-4">
                            {isSuccess ? t('orderSuccess') : t('placeOrder')}
                        </h2>

                        {isSuccess ? (
                            <div className="flex flex-col items-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-center text-muted-foreground">
                                    {t('orderSuccessMessage')}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Order Summary */}
                                <div className="bg-secondary/50 rounded-xl p-3 space-y-1 max-h-32 overflow-y-auto">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>{formatPrice(item.price * item.quantity)} UZS</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="space-y-1 border-t border-border pt-2">
                                    {deliveryPrice > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>{t('delivery')}</span>
                                            <span>{formatPrice(deliveryPrice)} UZS</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold">
                                        <span>{t('total')}</span>
                                        <span className="text-primary">{formatPrice(grandTotal)} UZS</span>
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('phoneNumber')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="+998 99 123 45 67"
                                            className="w-full pl-10 pr-4 py-3 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                                    <p className="text-xs text-muted-foreground mt-1">{t('phoneHint')}</p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> {t('sending')}
                                        </>
                                    ) : (
                                        t('confirmOrder')
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </MenuLayout>
    );
}
