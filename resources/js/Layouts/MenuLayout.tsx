import { ReactNode, useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Home, UtensilsCrossed, ShoppingCart, User, Store, Search,
    ChevronLeft, ChevronRight, Globe, LogOut, LayoutDashboard, MapPin,
} from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useCart } from '@/Contexts/CartContext';
import { useAddress } from '@/Contexts/AddressContext';
import OnboardingFlow from '@/Components/OnboardingFlow';
import GlobalSearch from '@/Components/GlobalSearch';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MenuLayoutProps {
    children: ReactNode;
}

export default function MenuLayout({ children }: MenuLayoutProps) {
    const { t, language, setLanguage } = useLanguage();
    const { totalItems } = useCart();
    const { address, isAddressConfirmed, openAddressForm } = useAddress();
    const { url, props } = usePage();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const user = (props as any).auth?.user;
    const restaurant = (props as any).restaurant;

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [headerLogoFailed, setHeaderLogoFailed] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved !== null ? saved === 'true' : true;
        }
        return true;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
        }
    }, [isSidebarCollapsed]);

    // Sidebar nav (no Profile — handled in top header / bottom nav)
    const sidebarNavItems = [
        { icon: Home, label: t('home'), href: '/' },
        { icon: UtensilsCrossed, label: t('menu'), href: '/menu' },
        { icon: ShoppingCart, label: t('cart'), href: '/cart', badge: totalItems },
    ];

    // Mobile bottom nav includes Profile
    const bottomNavItems = [
        { icon: Home, label: t('home'), href: '/' },
        { icon: UtensilsCrossed, label: t('menu'), href: '/menu' },
        { icon: ShoppingCart, label: t('cart'), href: '/cart', badge: totalItems },
        { icon: User, label: t('account') || 'Profil', href: '/account' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return url === '/';
        if (href === '/account') return url.startsWith('/account') || url.startsWith('/profile') || url.startsWith('/orders');
        return url.startsWith(href);
    };

    const getDashboardLink = () => {
        if (!user) return null;
        switch (user.role) {
            case 'admin': return '/admin';
            case 'waiter': return '/waiter/tables';
            case 'kitchen': return '/kitchen/dashboard';
            case 'cashier': return '/cashier/dashboard';
            default: return null;
        }
    };

    const dashboardLink = getDashboardLink();

    const getPageTitle = () => {
        if (url === '/') return t('home');
        if (url.startsWith('/menu')) return t('menu');
        if (url.startsWith('/cart')) return t('cart');
        if (url.startsWith('/account')) return t('account') || 'Profil';
        if (url.startsWith('/profile')) return t('profileInformation') || 'Profil sozlamalari';
        if (url.startsWith('/orders')) return 'Mening buyurtmalarim';
        return '';
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background">
                <OnboardingFlow />
                <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

                {/* Logout confirmation dialog */}
                <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                    <DialogContent className="max-w-sm rounded-2xl">
                        <DialogHeader>
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-2">
                                <LogOut className="w-7 h-7 text-red-500" />
                            </div>
                            <DialogTitle className="text-center text-lg font-bold">
                                Tizimdan chiqish
                            </DialogTitle>
                            <DialogDescription className="text-center text-sm">
                                Haqiqatan ham tizimdan chiqmoqchimisiz?
                                Keyingi kirishda yana parol kiritishingiz kerak bo'ladi.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl"
                                onClick={() => setShowLogoutDialog(false)}
                            >
                                Bekor qilish
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 rounded-xl"
                                onClick={() => {
                                    setShowLogoutDialog(false);
                                    router.post('/logout');
                                }}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Chiqish
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Desktop Sidebar — Collapsible */}
                <aside
                    className={cn(
                        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-card border-r border-border transition-all duration-300',
                        isSidebarCollapsed ? 'w-20' : 'w-64'
                    )}
                >
                    {/* Logo — restoran logosi va nomi (masalan Shaverlent) */}
                    <div
                        className={cn(
                            'flex items-center gap-3 border-b border-border transition-all duration-300',
                            isSidebarCollapsed ? 'justify-center px-0 h-14' : 'px-6 h-14'
                        )}
                    >
                        {restaurant?.logo && !headerLogoFailed ? (
                            <img
                                src={`/storage/${restaurant.logo}`}
                                alt={restaurant?.name || 'Logo'}
                                className="w-9 h-9 rounded-xl object-cover shrink-0"
                                onError={() => setHeaderLogoFailed(true)}
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                                <Store className="w-5 h-5 text-primary-foreground" />
                            </div>
                        )}
                        {!isSidebarCollapsed && (
                            <span className="font-display font-bold text-lg whitespace-nowrap truncate">
                                {restaurant?.name || t('restaurant') || 'Restaurant'}
                            </span>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className={cn('flex-1 py-4 space-y-1 transition-all duration-300', isSidebarCollapsed ? 'px-2' : 'px-3')}>
                        {sidebarNavItems.map((item) => {
                            const active = isActive(item.href);
                            const Icon = item.icon;

                            const linkContent = (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl transition-all duration-200',
                                        isSidebarCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3',
                                        active
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    )}
                                >
                                    <div className="relative shrink-0">
                                        <Icon className="w-5 h-5" />
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                                {item.badge > 9 ? '9+' : item.badge}
                                            </span>
                                        )}
                                    </div>
                                    {!isSidebarCollapsed && (
                                        <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                                    )}
                                </Link>
                            );

                            return isSidebarCollapsed ? (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{item.label}{item.badge ? ` (${item.badge})` : ''}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <div key={item.href}>{linkContent}</div>
                            );
                        })}
                    </nav>

                    {/* Collapse toggle */}
                    <div className="p-3 border-t border-border">
                        {isSidebarCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setIsSidebarCollapsed(false)}
                                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right"><p>Kengaytirish</p></TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setIsSidebarCollapsed(true)}
                                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right"><p>Yig'ish</p></TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </aside>

                {/* Main content area */}
                <div className={cn('transition-all duration-300', isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>

                    {/* ─── Top Header ─── */}
                    <header className="sticky top-0 z-40 flex items-center h-14 px-4 bg-card border-b border-border shadow-sm gap-3">

                        {/* Left: Address (if confirmed) + Restaurant logo + Page title */}
                        <div className="flex-1 flex items-center gap-2.5 min-w-0">
                            {isAddressConfirmed && address?.street && (
                                <button
                                    onClick={openAddressForm}
                                    className="flex items-center gap-1.5 text-left min-w-0 max-w-[140px] sm:max-w-[200px] group shrink-0"
                                >
                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                    <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                        {address.street}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 rotate-90" />
                                </button>
                            )}
                            {restaurant?.logo && !headerLogoFailed ? (
                                <img
                                    src={`/storage/${restaurant.logo}`}
                                    alt={restaurant?.name || 'Logo'}
                                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                                    onError={() => setHeaderLogoFailed(true)}
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Store className="w-4 h-4 text-primary" />
                                </div>
                            )}
                            <span className="font-display font-bold text-base truncate">
                                {getPageTitle()}
                            </span>
                        </div>

                        {/* Center: search bar (desktop only) */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden lg:flex w-full max-w-xs xl:max-w-sm items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors text-sm"
                        >
                            <Search className="w-4 h-4 shrink-0" />
                            <span className="flex-1 text-left">{t('search') || 'Qidirish...'}</span>
                            <span className="text-xs border border-border rounded px-1.5 py-0.5 text-muted-foreground/50">⌘K</span>
                        </button>

                        {/* Right: Search (mobile) + Language + User (desktop) */}
                        <div className="flex-1 flex items-center justify-end gap-1">
                            {/* Mobile: icon-only search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Search className="w-4 h-4" />
                            </button>

                            {/* Language dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                                        <Globe className="w-4 h-4" />
                                        <span className="hidden sm:inline text-sm font-medium">
                                            {language === 'uz' ? "O'zbek" : 'Рус'}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem
                                        onClick={() => setLanguage('uz')}
                                        className={cn('cursor-pointer text-sm', language === 'uz' && 'bg-primary/10 text-primary font-semibold')}
                                    >
                                        O'zbekcha
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setLanguage('ru')}
                                        className={cn('cursor-pointer text-sm', language === 'ru' && 'bg-primary/10 text-primary font-semibold')}
                                    >
                                        Русский
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User dropdown - desktop (sm+) only */}
                            <div className="hidden sm:flex">
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">
                                                    {user.name}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <div className="px-2 py-1.5">
                                                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                            <DropdownMenuSeparator />
                                            {dashboardLink && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={dashboardLink} className="flex items-center gap-2 cursor-pointer">
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        Panel
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                                                    <User className="w-4 h-4" />
                                                    {t('account') || 'Profil'}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => setShowLogoutDialog(true)}
                                                className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                {t('logout') || 'Chiqish'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link href="/account">
                                        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                                            <User className="w-4 h-4" />
                                            <span className="hidden md:inline text-sm">{t('account') || 'Profil'}</span>
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    {children}

                </div>

                {/* Mobile Bottom Navigation — includes Profile */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
                    <div className="flex items-center justify-around h-[4.5rem] max-w-lg mx-auto">
                        {bottomNavItems.map((item) => {
                            const active = isActive(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200',
                                        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    <div className={cn('relative p-1.5 rounded-xl transition-all duration-200', active ? 'bg-primary/10' : '')}>
                                        <Icon className="w-5 h-5" />
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                                {item.badge > 99 ? '99+' : item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className={cn('text-xs font-medium transition-all duration-200', active ? 'font-semibold' : '')}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </TooltipProvider>
    );
}
