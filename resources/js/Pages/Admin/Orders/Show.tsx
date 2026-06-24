import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Phone, Clock, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { StatusBadge } from '@/Components/Admin/StatusBadge';
import { Separator } from '@/Components/ui/separator';
import { Order, OrderItem, FoodItem } from '@/types';
import { useState } from 'react';

interface Props {
    order: Order & {
        items: (OrderItem & { food_item: FoodItem })[];
    };
}

const statuses = [
    { value: 'pending', label: 'Kutilmoqda', emoji: '⏳' },
    { value: 'confirmed', label: 'Tasdiqlangan', emoji: '✅' },
    { value: 'preparing', label: 'Tayyorlanmoqda', emoji: '👨‍🍳' },
    { value: 'delivered', label: 'Yetkazildi', emoji: '🚚' },
    { value: 'cancelled', label: 'Bekor qilindi', emoji: '❌' },
];

export default function OrderShow({ order }: Props) {
    const [updating, setUpdating] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('uz-UZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const updateStatus = (status: string) => {
        const statusInfo = statuses.find(s => s.value === status);
        const currentStatusInfo = statuses.find(s => s.value === order.status);

        setUpdating(true);
        setUpdatingStatus(status);

        router.put(`/admin/orders/${order.id}/status`, { status }, {
            onSuccess: () => {
                toast.success(`${statusInfo?.emoji} Status yangilandi!`, {
                    description: `Buyurtma #${order.order_number} statusi "${statusInfo?.label}" ga o'zgartirildi. Telegram xabari yuborildi.`,
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Statusni yangilab bo\'lmadi',
                });
            },
            onFinish: () => {
                setUpdating(false);
                setUpdatingStatus(null);
            },
        });
    };

    return (
        <AdminLayout title={`Buyurtma #${order.order_number}`}>
            <Head title={`Buyurtma #${order.order_number}`} />

            <Button variant="ghost" className="mb-4" asChild>
                <Link href="/admin/orders">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Orqaga
                </Link>
            </Button>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Buyurtma tafsilotlari</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items && order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                        {item.food_item?.image ? (
                                            <img
                                                src={`/storage/${item.food_item.image}`}
                                                alt={item.food_item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                🍽️
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{item.food_item?.name || 'Taom'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatPrice(item.price)} so'm × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {formatPrice(item.price * item.quantity)} so'm
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Oraliq jami</span>
                                    <span>{formatPrice(order.total_amount)} so'm</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Yetkazib berish</span>
                                    <span>{formatPrice(order.delivery_price)} so'm</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Jami</span>
                                    <span className="text-primary">
                                        {formatPrice(order.total_amount + order.delivery_price)} so'm
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Info & Status */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ma'lumotlar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Telefon</p>
                                    <p className="font-medium">{order.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Sana</p>
                                    <p className="font-medium">{formatDate((order as any).created_at)}</p>
                                </div>
                            </div>

                            {order.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Izoh</p>
                                    <p className="text-sm bg-muted p-3 rounded-lg">{order.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Status</CardTitle>
                                <StatusBadge status={order.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                {statuses.map((s) => (
                                    <Button
                                        key={s.value}
                                        variant={order.status === s.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => updateStatus(s.value)}
                                        disabled={updating || order.status === s.value}
                                        className="w-full"
                                    >
                                        {updatingStatus === s.value ? (
                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        ) : (
                                            <span className="mr-1">{s.emoji}</span>
                                        )}
                                        {s.label}
                                    </Button>
                                ))}
                            </div>

                            {/* Telegram notification info */}
                             <div className="flex items-center gap-2 p-3 bg-secondary text-secondary-foreground rounded-lg text-sm">
                                <Send className="w-4 h-4 flex-shrink-0" />
                                <span>Status o'zgarganda Telegram orqali xabar yuboriladi</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
