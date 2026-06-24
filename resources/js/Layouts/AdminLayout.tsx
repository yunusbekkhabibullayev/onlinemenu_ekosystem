import { ReactNode, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Store,
    FolderTree,
    UtensilsCrossed,
    ShoppingBag,
    Settings,
    Menu,
    X,
    LogOut,
    User,
    Users,
    Table as TableIcon,
    Globe,
    Brain,
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Separator } from '@/Components/ui/separator';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/Components/ui/dialog';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/Contexts/LanguageContext';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Restoran', href: '/admin/restaurant', icon: Store },
    { name: 'Kategoriyalar', href: '/admin/categories', icon: FolderTree },
    { name: 'Taomlar', href: '/admin/foods', icon: UtensilsCrossed },
    { name: 'Stollar', href: '/admin/tables', icon: TableIcon },
    { name: 'Buyurtmalar', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Xodimlar', href: '/admin/staff', icon: Users },
    { name: 'AI Analitika', href: '/admin/ai-analytics', icon: Brain },
    { name: 'Sozlamalar', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const user = (props as any).auth?.user;
    const { language, setLanguage } = useLanguage();

    const isActive = (href: string) => {
        if (href === '/admin') return url === '/admin';
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Admin Panel</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <Store className="w-5 h-5" />
                        Saytga qaytish
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        {title && (
                            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Language dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span className="hidden sm:inline-block">
                                        {language === 'uz' ? "O'zbek" : 'Русский'}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                    onClick={() => setLanguage('uz')}
                                    className={cn(
                                        "cursor-pointer",
                                        language === 'uz' && "bg-primary/10 text-primary font-semibold"
                                    )}
                                >
                                    O'zbekcha
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setLanguage('ru')}
                                    className={cn(
                                        "cursor-pointer",
                                        language === 'ru' && "bg-primary/10 text-primary font-semibold"
                                    )}
                                >
                                    Русский
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* User dropdown */}
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <span className="hidden sm:inline-block">{user?.name || 'Admin'}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Mening akkauntim</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile">Profil</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings">Sozlamalar</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setShowLogoutDialog(true)}
                                className="text-red-600 cursor-pointer focus:text-red-600"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Chiqish
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Logout confirmation dialog */}
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
                        <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => { setShowLogoutDialog(false); router.post('/logout'); }}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Chiqish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
