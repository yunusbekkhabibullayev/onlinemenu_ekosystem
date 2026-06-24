import { Head, router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Clock, CheckCircle, ChefHat, Package, ArrowLeft, RefreshCw } from 'lucide-react';
import WaiterLayout from '@/Layouts/WaiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { StatusBadge } from '@/Components/Admin/StatusBadge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
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
    name: string | null;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string | null;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'paid' | 'cancelled';
    total_amount: number;
    delivery_price: number;
    created_at: string;
    ready_at: string | null;
    table: Table | null;
    items: OrderItem[];
    orderSession: {
        id: number;
        status: string;
    } | null;
}

interface Props {
    orders: Order[];
}

export default function ActiveOrders({ orders }: Props) {
    const prevReadyCountRef = useRef(orders.filter((o) => o.status === 'ready').length);

    useEffect(() => {
        const poll = () => {
            if (document.hidden) return;
            router.reload({
                only: ['orders'],
                onSuccess: () => {
                    const newReadyCount = orders.filter((o) => o.status === 'ready').length;
                    if (newReadyCount > prevReadyCountRef.current) {
                        toast.info(`${newReadyCount - prevReadyCountRef.current} ta buyurtma tayyor!`);
                        document.title = `(${newReadyCount}) Tayyor buyurtmalar`;
                    } else if (newReadyCount === 0) {
                        document.title = 'Faol buyurtmalar';
                    }
                    prevReadyCountRef.current = newReadyCount;
                },
            });
        };

        const interval = setInterval(poll, 15000);
        return () => {
            clearInterval(interval);
            document.title = 'Faol buyurtmalar';
        };
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('uz-UZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'preparing':
                return <ChefHat className="w-4 h-4" />;
            case 'ready':
                return <Package className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getStatusBorderClass = (status: string) => {
        switch (status) {
            case 'pending': return 'border-l-amber-400';
            case 'confirmed': return 'border-l-blue-500';
            case 'preparing': return 'border-l-violet-500';
            case 'ready': return 'border-l-green-500';
            default: return 'border-l-border';
        }
    };

    const handleMarkDelivered = (orderId: number) => {
        router.put(`/waiter/orders/${orderId}/delivered`, {}, {
            onSuccess: () => {
                toast.success('Buyurtma yetkazildi deb belgilandi');
            },
            onError: () => {
                toast.error('Xatolik yuz berdi');
            },
        });
    };

    const groupedOrders = {
        ready: orders.filter((o) => o.status === 'ready'),
        preparing: orders.filter((o) => o.status === 'preparing'),
        confirmed: orders.filter((o) => o.status === 'confirmed'),
        pending: orders.filter((o) => o.status === 'pending'),
    };

    return (
        <WaiterLayout title="Faol buyurtmalar">
            <Head title="Faol buyurtmalar - Ofitsiant" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground mt-0.5">
                            Jami: <span className="font-semibold text-foreground">{orders.length}</span> ta buyurtma
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                            15 soniyada yangilanadi
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.reload({ only: ['orders'] })}
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Yangilash
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/waiter/tables')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Stollar
                        </Button>
                    </div>
                </div>

                {/* Ready Orders - Priority */}
                {groupedOrders.ready.length > 0 && (
                    <Card className="shadow-card border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Package className="w-5 h-5 text-green-500" />
                                Tayyor buyurtmalar
                                <Badge className="ml-auto bg-green-50 text-green-700 border border-green-200 hover:bg-green-50">
                                    {groupedOrders.ready.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {groupedOrders.ready.map((order) => (
                                    <Card key={order.id} className="bg-card border border-border">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                                        <span className="font-bold text-foreground">#{order.order_number}</span>
                                                        <StatusBadge status={order.status} />
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                                                        {order.table && (
                                                            <span>Stol #{order.table.number}{order.table.name && ` (${order.table.name})`}</span>
                                                        )}
                                                        {order.customer_name && <span>{order.customer_name}</span>}
                                                        <span>{formatDate(order.created_at)}</span>
                                                        {order.ready_at && (
                                                            <span className="text-green-600">Tayyor: {formatDate(order.ready_at)}</span>
                                                        )}
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
                                                    <div className="font-bold text-foreground border-t border-border pt-2">
                                                        Jami: {formatPrice(order.total_amount + order.delivery_price)} so'm
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => handleMarkDelivered(order.id)}
                                                    size="lg"
                                                    className="shrink-0"
                                                >
                                                    Yetkazildi
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Other Orders */}
                {[
                    { title: 'Tayyorlanmoqda', orders: groupedOrders.preparing, icon: ChefHat, border: 'border-l-violet-500' },
                    { title: 'Tasdiqlangan', orders: groupedOrders.confirmed, icon: CheckCircle, border: 'border-l-blue-500' },
                    { title: 'Kutilmoqda', orders: groupedOrders.pending, icon: Clock, border: 'border-l-amber-400' },
                ].map((group) =>
                    group.orders.length > 0 ? (
                        <Card key={group.title} className={`shadow-card border-l-4 ${group.border}`}>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <group.icon className="w-5 h-5 text-muted-foreground" />
                                    {group.title}
                                    <Badge variant="secondary" className="ml-auto">{group.orders.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Buyurtma</TableHead>
                                            <TableHead>Stol</TableHead>
                                            <TableHead>Mijoz</TableHead>
                                            <TableHead>Vaqt</TableHead>
                                            <TableHead>Summa</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {group.orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.order_number}</TableCell>
                                                <TableCell>
                                                    {order.table ? (
                                                        <span>#{order.table.number}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {order.customer_name ?? <span className="text-muted-foreground">-</span>}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(order.created_at)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatPrice(order.total_amount + order.delivery_price)} so'm
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={order.status} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : null
                )}

                {orders.length === 0 && (
                    <Card className="shadow-card">
                        <CardContent className="py-16 text-center">
                            <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">Hozircha faol buyurtmalar yo'q</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </WaiterLayout>
    );
}
