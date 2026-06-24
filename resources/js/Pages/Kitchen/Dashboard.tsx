import { Head, router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Clock, CheckCircle, ChefHat, Package, RefreshCw } from 'lucide-react';
import KitchenLayout from '@/Layouts/KitchenLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { StatusBadge } from '@/Components/Admin/StatusBadge';
import { toast } from 'sonner';

interface FoodItem {
    id: number;
    name: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    foodItem: FoodItem | null;
}

interface Table {
    id: number;
    number: string;
}

interface Waiter {
    id: number;
    name: string;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string | null;
    status: string;
    total_amount: number;
    created_at: string;
    table: Table | null;
    waiter: Waiter | null;
    items: OrderItem[];
}

interface Props {
    pendingOrders: Order[];
    confirmedOrders: Order[];
    preparingOrders: Order[];
    readyOrders: Order[];
}

const statusConfig = {
    pending: {
        label: 'Kutilmoqda',
        borderClass: 'border-l-amber-400',
        iconClass: 'text-amber-500',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        Icon: Clock,
    },
    confirmed: {
        label: 'Tasdiqlangan',
        borderClass: 'border-l-blue-500',
        iconClass: 'text-blue-500',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        Icon: CheckCircle,
    },
    preparing: {
        label: 'Tayyorlanmoqda',
        borderClass: 'border-l-violet-500',
        iconClass: 'text-violet-500',
        badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
        Icon: ChefHat,
    },
    ready: {
        label: 'Tayyor',
        borderClass: 'border-l-green-500',
        iconClass: 'text-green-500',
        badgeBg: 'bg-green-50 text-green-700 border-green-200',
        Icon: Package,
    },
} as const;

export default function KitchenDashboard({
    pendingOrders,
    confirmedOrders,
    preparingOrders,
    readyOrders,
}: Props) {
    const prevTotalRef = useRef(pendingOrders.length);

    useEffect(() => {
        const poll = () => {
            if (document.hidden) return;
            router.reload({
                only: ['pendingOrders', 'confirmedOrders', 'preparingOrders', 'readyOrders'],
                onSuccess: () => {
                    const newPending = pendingOrders.length;
                    if (newPending > prevTotalRef.current) {
                        toast.info(`${newPending - prevTotalRef.current} ta yangi buyurtma keldi!`);
                        document.title = `(${newPending}) Oshxona`;
                    } else if (newPending === 0) {
                        document.title = 'Oshxona';
                    }
                    prevTotalRef.current = newPending;
                },
            });
        };
        const interval = setInterval(poll, 15000);
        return () => {
            clearInterval(interval);
            document.title = 'Oshxona';
        };
    }, []);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('uz-UZ').format(price);

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    const handleAction = (orderId: number, action: string) => {
        router.put(`/kitchen/orders/${orderId}/${action}`, {}, {
            onSuccess: () => toast.success('Status yangilandi'),
            onError: () => toast.error('Xatolik yuz berdi'),
        });
    };

    const OrderCard = ({ order }: { order: Order }) => (
        <Card className={`mb-3 border-l-4 ${statusConfig[order.status as keyof typeof statusConfig]?.borderClass ?? 'border-l-gray-300'} shadow-card`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-bold text-foreground">#{order.order_number}</span>
                            {order.table && (
                                <Badge variant="outline" className="text-xs">
                                    Stol #{order.table.number}
                                </Badge>
                            )}
                            <StatusBadge status={order.status} />
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                            {order.customer_name && (
                                <span>{order.customer_name}</span>
                            )}
                            {order.waiter && (
                                <span>Ofitsiant: {order.waiter.name}</span>
                            )}
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {formatTime(order.created_at)}
                            </span>
                        </div>

                        <div className="space-y-1 mb-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-foreground">
                                        {item.foodItem?.name ?? 'Taom'} × {item.quantity}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {formatPrice(item.price * item.quantity)} so'm
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm font-semibold text-foreground border-t border-border pt-2">
                            Jami: {formatPrice(order.total_amount)} so'm
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                        {order.status === 'pending' && (
                            <Button
                                onClick={() => handleAction(order.id, 'confirm')}
                                size="sm"
                            >
                                Qabul qilish
                            </Button>
                        )}
                        {order.status === 'confirmed' && (
                            <Button
                                onClick={() => handleAction(order.id, 'preparing')}
                                size="sm"
                            >
                                Boshlash
                            </Button>
                        )}
                        {order.status === 'preparing' && (
                            <Button
                                onClick={() => handleAction(order.id, 'ready')}
                                size="sm"
                            >
                                Tayyor
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const totalActive = pendingOrders.length + confirmedOrders.length + preparingOrders.length + readyOrders.length;

    return (
        <KitchenLayout title="Oshxona Dashboard">
            <Head title="Oshxona Dashboard" />

            <div className="space-y-6">
                {/* Refresh indicator */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                        Har 15 soniyada avtomatik yangilanadi
                    </span>
                    <button
                        onClick={() => router.reload({ only: ['pendingOrders', 'confirmedOrders', 'preparingOrders', 'readyOrders'] })}
                        className="flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Hozir yangilash
                    </button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {([
                        { key: 'pending', count: pendingOrders.length },
                        { key: 'confirmed', count: confirmedOrders.length },
                        { key: 'preparing', count: preparingOrders.length },
                        { key: 'ready', count: readyOrders.length },
                    ] as const).map(({ key, count }) => {
                        const cfg = statusConfig[key];
                        const Icon = cfg.Icon;
                        return (
                            <Card key={key} className={`border-l-4 ${cfg.borderClass} shadow-card`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{cfg.label}</p>
                                            <p className="text-2xl font-bold text-foreground">{count}</p>
                                        </div>
                                        <Icon className={`w-8 h-8 ${cfg.iconClass}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Order sections */}
                {pendingOrders.length > 0 && (
                    <Card className="shadow-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="w-5 h-5 text-amber-500" />
                                Kutilayotgan buyurtmalar
                                <Badge className="ml-auto bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
                                    {pendingOrders.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {confirmedOrders.length > 0 && (
                    <Card className="shadow-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                                Tasdiqlangan buyurtmalar
                                <Badge className="ml-auto bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50">
                                    {confirmedOrders.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {confirmedOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {preparingOrders.length > 0 && (
                    <Card className="shadow-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ChefHat className="w-5 h-5 text-violet-500" />
                                Tayyorlanayotgan buyurtmalar
                                <Badge className="ml-auto bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-50">
                                    {preparingOrders.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {preparingOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {readyOrders.length > 0 && (
                    <Card className="shadow-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Package className="w-5 h-5 text-green-500" />
                                Tayyor buyurtmalar
                                <Badge className="ml-auto bg-green-50 text-green-700 border border-green-200 hover:bg-green-50">
                                    {readyOrders.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {readyOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {totalActive === 0 && (
                    <Card className="shadow-card">
                        <CardContent className="py-16 text-center">
                            <ChefHat className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">Hozircha buyurtmalar yo'q</p>
                            <p className="text-sm text-muted-foreground mt-1">Yangi buyurtmalar avtomatik ko'rinadi</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </KitchenLayout>
    );
}
