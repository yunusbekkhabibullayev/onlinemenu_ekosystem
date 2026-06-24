import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Package } from 'lucide-react';
import MenuLayout from '@/Layouts/MenuLayout';
import { Restaurant } from '@/types';
import { cn } from '@/lib/utils';

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
    orders: OrderItem[];
}

const statusLabels: Record<string, string> = {
    pending: 'Kutilmoqda',
    confirmed: 'Tasdiqlandi',
    preparing: 'Tayyorlanmoqda',
    ready: 'Tayyor',
    delivered: 'Yetkazildi',
    paid: "To'langan",
    cancelled: 'Bekor qilindi',
};

export default function Orders({ orders, restaurant }: Props) {
    return (
        <MenuLayout>
            <Head title="Mening buyurtmalarim" />

            <main className="pb-28 lg:pb-10 min-h-[calc(100vh-56px)] bg-background">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                    <Link
                        href="/account"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Profilga qaytish
                    </Link>

                    <h1 className="font-display text-xl font-bold text-foreground mb-6">Mening buyurtmalarim</h1>

                    {orders.length === 0 ? (
                        <div className="bg-card border border-border rounded-2xl p-10 sm:p-14 text-center">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Package className="w-8 h-8 sm:w-10 sm:h-10 text-primary/70" />
                                </div>
                            </div>
                            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
                                Buyurtmalaringiz ro&apos;yxati
                            </h2>
                            <p className="text-muted-foreground text-sm mb-8">
                                Bu yerda siz bergan buyurtmalar chiqadi
                            </p>
                            <Link
                                href="/menu"
                                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Menyudan buyurtma berish
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card shadow-card"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                            <Package className="w-5 h-5 text-orange-500" />
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
                                            'inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1',
                                            order.status === 'delivered' || order.status === 'paid' ? 'bg-green-50 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                            'bg-amber-50 text-amber-700'
                                        )}>
                                            {statusLabels[order.status] ?? order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </MenuLayout>
    );
}
