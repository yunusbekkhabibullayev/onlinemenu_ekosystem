import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { Plus, Table as TableIcon, Users, CheckCircle, XCircle, Clock, ShoppingCart, Package, RefreshCw } from 'lucide-react';
import WaiterLayout from '@/Layouts/WaiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string | null;
    total_amount: number;
    status: string;
    payment_status: string;
    is_additional: boolean;
    created_at: string;
    items: OrderItem[];
}

interface ActiveSession {
    id: number;
    total_amount: number;
    paid_amount: number;
    orders: Order[];
}

interface Table {
    id: number;
    number: string;
    name: string | null;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'cleaning';
    has_active_session: boolean;
    active_session: ActiveSession | null;
}

interface Props {
    tables: Table[];
    restaurant: {
        id: number;
        name: string;
    } | null;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
};

export default function Tables({ tables, restaurant }: Props) {
    useEffect(() => {
        const poll = () => {
            if (!document.hidden) {
                router.reload({ only: ['tables'] });
            }
        };
        const interval = setInterval(poll, 15000);
        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (status: string, hasActiveSession: boolean) => {
        if (hasActiveSession || status === 'occupied') {
            return (
                <Badge variant="destructive" className="gap-1">
                    <XCircle className="w-3 h-3" />
                    Band
                </Badge>
            );
        }
        if (status === 'reserved') {
            return (
                <Badge variant="secondary" className="gap-1">
                    <Clock className="w-3 h-3" />
                    Rezervatsiya
                </Badge>
            );
        }
        if (status === 'cleaning') {
            return (
                <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    Tozalash
                </Badge>
            );
        }
        return (
            <Badge variant="default" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                Bo'sh
            </Badge>
        );
    };

    return (
        <WaiterLayout title="Stollar">
            <Head title="Stollar - Ofitsiant" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground mt-0.5">
                            Restoran: <span className="font-medium text-foreground">{restaurant?.name ?? "Noma'lum"}</span>
                        </p>
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                        Avtomatik yangilanadi
                    </span>
                </div>

                {/* Tables Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {tables.map((table) => (
                        <Card
                            key={table.id}
                            className={cn(
                                "transition-all hover:shadow-elevated border-l-4",
                                (table.status === 'occupied' || table.has_active_session)
                                    ? "border-l-destructive"
                                    : table.status === 'available'
                                    ? "border-l-green-500"
                                    : "border-l-border"
                            )}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TableIcon className="w-5 h-5" />
                                        Stol #{table.number}
                                    </CardTitle>
                                    {getStatusBadge(table.status, table.has_active_session)}
                                </div>
                                {table.name && (
                                    <p className="text-sm text-muted-foreground mt-1">{table.name}</p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>Sig'im: {table.capacity} kishi</span>
                                </div>
                                
                                <Link href={`/waiter/tables/${table.id}/order`}>
                                    <Button
                                        className="w-full"
                                        variant={table.status === 'available' ? 'default' : 'secondary'}
                                        disabled={table.status === 'cleaning'}
                                    >
                                        {table.has_active_session || table.status === 'occupied'
                                            ? 'Qo\'shimcha buyurtma'
                                            : 'Buyurtma yaratish'}
                                    </Button>
                                </Link>

                                {/* Active Session Orders */}
                                {table.active_session && table.active_session.orders.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Package className="w-4 h-4 text-muted-foreground" />
                                            <h4 className="text-sm font-semibold text-foreground">
                                                Berilgan buyurtmalar
                                            </h4>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {table.active_session.orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="p-2 bg-muted/50 rounded-lg border border-border"
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-medium text-foreground">
                                                            {order.is_additional ? (
                                                                <span className="text-primary">Qo'shimcha</span>
                                                            ) : (
                                                                <span>#{order.order_number}</span>
                                                            )}
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                order.payment_status === 'paid'
                                                                    ? 'default'
                                                                    : order.payment_status === 'partial'
                                                                    ? 'secondary'
                                                                    : 'outline'
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {order.payment_status === 'paid'
                                                                ? 'To\'langan'
                                                                : order.payment_status === 'partial'
                                                                ? 'Qisman'
                                                                : 'To\'lanmagan'}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground space-y-1">
                                                        {order.items.slice(0, 2).map((item, idx) => (
                                                            <div key={idx} className="flex justify-between">
                                                                <span>{item.name} x{item.quantity}</span>
                                                                <span>{formatPrice(item.price * item.quantity)} so'm</span>
                                                            </div>
                                                        ))}
                                                        {order.items.length > 2 && (
                                                            <div className="text-muted-foreground/70 italic">
                                                                +{order.items.length - 2} ta boshqa
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
                                                        <span className="text-xs font-semibold text-muted-foreground">Jami:</span>
                                                        <span className="text-xs font-bold text-primary">
                                                            {formatPrice(order.total_amount)} so'm
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-semibold text-foreground">Sessiya jami:</span>
                                                <span className="font-bold text-primary">
                                                    {formatPrice(table.active_session.total_amount)} so'm
                                                </span>
                                            </div>
                                            {table.active_session.paid_amount > 0 && (
                                                <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                                    <span>To'langan:</span>
                                                    <span>{formatPrice(table.active_session.paid_amount)} so'm</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {tables.length === 0 && (
                    <Card className="shadow-card">
                        <CardContent className="py-16 text-center">
                            <TableIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground">Hozircha stollar mavjud emas</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </WaiterLayout>
    );
}
