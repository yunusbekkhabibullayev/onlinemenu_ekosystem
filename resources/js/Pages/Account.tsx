import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    User, LogOut, LayoutDashboard, ArrowRight,
    Mail, Shield, KeyRound, CheckCircle2, ChevronRight,
    UtensilsCrossed, ShoppingBag, Settings,
    Edit3, Camera, Package, HelpCircle, Globe, FileText, MapPin,
} from 'lucide-react';
import MenuLayout from '@/Layouts/MenuLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useAddress } from '@/Contexts/AddressContext';
import { Restaurant, User as UserType } from '@/types';
import { cn } from '@/lib/utils';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/Components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Button } from '@/Components/ui/button';

interface OrderItem {
    id: number;
    order_number: string;
    total_amount: number;
    delivery_price: number;
    status: string;
    created_at: string;
    items_count: number;
}

interface Props {
    restaurant?: Restaurant | null;
    auth?: { user: UserType | null };
    orders?: OrderItem[];
}

const roleConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    admin:   { label: 'Administrator', color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
    waiter:  { label: 'Ofitsiant',     color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
    kitchen: { label: 'Oshpaz',        color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
    cashier: { label: 'Kassir',        color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
    user:    { label: 'Mehmon',        color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200' },
};

const statusLabels: Record<string, string> = {
    pending: 'Kutilmoqda',
    confirmed: 'Tasdiqlandi',
    preparing: 'Tayyorlanmoqda',
    ready: 'Tayyor',
    delivered: 'Yetkazildi',
    paid: 'To\'langan',
    cancelled: 'Bekor qilindi',
};

export default function Account({ auth, orders = [] }: Props) {
    const { t, language, setLanguage } = useLanguage();
    const { address, openAddressForm } = useAddress();
    const user = auth?.user;
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    const getDashboardLink = () => {
        if (!user) return null;
        switch (user.role) {
            case 'admin':   return '/admin';
            case 'waiter':  return '/waiter/tables';
            case 'kitchen': return '/kitchen/dashboard';
            case 'cashier': return '/cashier/dashboard';
            default:        return null;
        }
    };

    const dashboardLink = getDashboardLink();
    const role = user ? (roleConfig[user.role] ?? roleConfig.user) : null;

    const getDashboardLabel = () => {
        switch (user?.role) {
            case 'admin':   return 'Admin Panel';
            case 'waiter':  return 'Ofitsiant Panel';
            case 'kitchen': return 'Oshxona Panel';
            case 'cashier': return 'Kassa Panel';
            default:        return 'Panel';
        }
    };

    const avatarSrc = user?.avatar && !avatarError ? `/storage/${user.avatar}` : null;

    return (
        <MenuLayout>
            <Head title={t('account')} />

            <main className="pb-28 lg:pb-10 min-h-[calc(100vh-56px)] bg-background">
                {user ? (
                    <div className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

                        {/* ── Profil kartochkasi — bitta rang, yaxlit dizayn ── */}
                        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
                            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary overflow-hidden border border-border">
                                            {avatarSrc ? (
                                                <img
                                                    src={avatarSrc}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                    onError={() => setAvatarError(true)}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-9 h-9 sm:w-11 sm:h-11 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                                            title="Rasmni o'zgartirish"
                                        >
                                            <Camera className="w-4 h-4 text-white" />
                                        </Link>
                                    </div>

                                    {/* Ism, email, lavozim */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground leading-tight">
                                                {user.name}
                                            </h1>
                                            <span className={cn(
                                                'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold',
                                                role?.bg, role?.color, role?.border
                                            )}>
                                                <Shield className="w-3 h-3" />
                                                {role?.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </p>
                                        {user.email_verified_at && (
                                            <p className="flex items-center gap-1 text-xs text-green-600 mt-1.5 font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Email tasdiqlangan
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {user.employee_code && (
                                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-xs">
                                            <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="font-mono font-medium text-foreground">{user.employee_code}</span>
                                        </div>
                                    )}
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Profilni tahrirlash</span>
                                        <span className="sm:hidden">Tahrirlash</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── Content grid ── */}
                        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">

                            {/* ── LEFT column (lg: 1/3) ── */}
                            <div className="space-y-4">

                                {/* Navigatsiya */}
                                <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
                                    <div className="px-4 py-3 border-b border-border">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigatsiya</p>
                                    </div>
                                    <div className="divide-y divide-border">
                                        <NavRow href="/menu" icon={UtensilsCrossed} iconBg="bg-orange-50" iconColor="text-orange-500" label="Menyu" desc="Taomlar ro'yxati" />
                                        <NavRow href="/cart" icon={ShoppingBag} iconBg="bg-green-50" iconColor="text-green-600" label="Savatcha" desc="Buyurtmalar" />
                                        <NavRow href="/profile" icon={Settings} iconBg="bg-gray-100" iconColor="text-gray-600" label="Sozlamalar" desc="Profil va parol" />
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT column (lg: 2/3) ── */}
                            <div className="lg:col-span-2 space-y-4">

                                {/* Panel card (agar staff bo'lsa) */}
                                {dashboardLink && (
                                    <Link
                                        href={dashboardLink}
                                        className="flex items-center gap-4 p-5 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl shadow-card hover:shadow-elevated hover:from-primary/10 hover:to-primary/15 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                                            <LayoutDashboard className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{getDashboardLabel()}</p>
                                            <p className="text-sm text-muted-foreground mt-0.5">Boshqaruv paneliga o'tish</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-primary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </Link>
                                )}

                                {/* Yetkazib berish manzili */}
                                <button
                                    type="button"
                                    onClick={openAddressForm}
                                    className="w-full bg-card border border-border rounded-2xl shadow-card overflow-hidden p-5 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground">Yetkazib berish manzili</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {address?.street || 'Manzilni qo\'shing yoki o\'zgartirish'}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-primary/60 group-hover:text-primary shrink-0" />
                                    </div>
                                </button>

                                {/* Mening buyurtmalarim */}
                                <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
                                    <div className="px-5 py-4 border-b border-border">
                                        <h3 className="font-semibold text-base text-foreground">Mening buyurtmalarim</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">So'nggi buyurtmalaringiz</p>
                                    </div>
                                    <div className="p-5">
                                        {orders.length === 0 ? (
                                            <div className="py-8 text-center">
                                                <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-3">
                                                    <Package className="w-7 h-7 text-primary/60" />
                                                </div>
                                                <p className="text-sm font-medium text-foreground">Buyurtmalaringiz ro&apos;yxati</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">Bu yerda siz bergan buyurtmalar chiqadi</p>
                                                <Link
                                                    href="/menu"
                                                    className="inline-flex items-center gap-1.5 mt-4 py-2 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90"
                                                >
                                                    Menyudan buyurtma berish
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {orders.slice(0, 5).map((order) => (
                                                    <Link
                                                        key={order.id}
                                                        href="/orders"
                                                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                                                <Package className="w-4 h-4 text-orange-500" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-foreground truncate">{order.order_number}</p>
                                                                <p className="text-xs text-muted-foreground">{order.created_at} · {order.items_count} ta mahsulot</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {new Intl.NumberFormat('uz-UZ').format(order.total_amount + order.delivery_price)} so'm
                                                            </p>
                                                            <span className={cn(
                                                                'text-xs font-medium px-2 py-0.5 rounded-full',
                                                                order.status === 'delivered' || order.status === 'paid' ? 'bg-green-50 text-green-700' :
                                                                order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                                'bg-amber-50 text-amber-700'
                                                            )}>
                                                                {statusLabels[order.status] ?? order.status}
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground shrink-0" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {orders.length > 0 && (
                                            <Link
                                                href="/orders"
                                                className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                                            >
                                                Barcha buyurtmalar
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Xavfli zona — faqat mobil */}
                                <div className="lg:hidden bg-card border border-red-100 rounded-2xl shadow-card overflow-hidden">
                                    <div className="px-5 py-4 border-b border-red-100">
                                        <h3 className="font-semibold text-sm text-red-600">Xavfli zona</h3>
                                    </div>
                                    <div className="px-5 py-4 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Tizimdan chiqish</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Hisobingizdan xavfsiz chiqish
                                            </p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="shrink-0 rounded-xl gap-2"
                                            onClick={() => setShowLogoutDialog(true)}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Chiqish
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ─── Guest — Uzum Tezkor uslubi ─── */
                    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-24 lg:pb-10">
                        <h1 className="font-display text-xl font-bold text-foreground mb-6">
                            {t('account') || 'Profil'}
                        </h1>
                        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                            <button
                                type="button"
                                onClick={openAddressForm}
                                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-secondary/50 transition-colors group text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-foreground block">Yetkazib berish manzili</span>
                                    <span className="text-xs text-muted-foreground truncate block">
                                        {address?.street || 'Manzilni qo\'shing'}
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                            </button>
                            <Link href="#" className="flex items-center gap-3 px-4 py-4 hover:bg-secondary/50 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-foreground">Yordam</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-secondary/50 transition-colors group text-left">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Globe className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="flex-1 text-sm font-medium text-foreground">Til</span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => setLanguage('uz')} className={cn('cursor-pointer', language === 'uz' && 'bg-primary/10 text-primary font-semibold')}>
                                        O&apos;zbekcha
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLanguage('ru')} className={cn('cursor-pointer', language === 'ru' && 'bg-primary/10 text-primary font-semibold')}>
                                        Русский
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Link href="#" className="flex items-center gap-3 px-4 py-4 hover:bg-secondary/50 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-foreground">Maxfiylik siyosati</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                            </Link>
                            <Link href="#" className="flex items-center gap-3 px-4 py-4 hover:bg-secondary/50 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-foreground">Foydalanuvchi shartnomasi</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                            </Link>
                        </div>
                        <Link
                            href="/login"
                            className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-colors"
                        >
                            Kirish / Ro&apos;yxatdan o&apos;tish
                        </Link>
                    </div>
                )}
            </main>

            {/* Logout dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent className="max-w-sm rounded-2xl">
                    <DialogHeader>
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-2">
                            <LogOut className="w-7 h-7 text-red-500" />
                        </div>
                        <DialogTitle className="text-center text-lg font-bold">Tizimdan chiqish</DialogTitle>
                        <DialogDescription className="text-center text-sm">
                            Haqiqatan ham tizimdan chiqmoqchimisiz?
                            Keyingi kirishda yana parol kiritishingiz kerak bo'ladi.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowLogoutDialog(false)}>
                            Bekor qilish
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 rounded-xl"
                            onClick={() => { setShowLogoutDialog(false); router.post('/logout'); }}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Chiqish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MenuLayout>
    );
}

/* ── Reusable sub-components ── */

function NavRow({ href, icon: Icon, iconBg, iconColor, label, desc }: {
    href: string; icon: any; iconBg: string; iconColor: string; label: string; desc: string;
}) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors group">
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
                <Icon className={cn('w-4 h-4', iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </Link>
    );
}

