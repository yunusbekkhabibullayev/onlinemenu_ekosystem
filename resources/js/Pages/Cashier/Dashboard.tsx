import { Head, Link } from '@inertiajs/react';
import { CreditCard, DollarSign, Clock, CheckCircle, Banknote, Smartphone } from 'lucide-react';
import CashierLayout from '@/Layouts/CashierLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

interface Payment {
    id: number;
    amount: number;
    payment_method: string;
    created_at: string;
    order: {
        order_number: string;
    } | null;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    delivery_price: number;
    table: {
        number: string;
    } | null;
}

interface Props {
    pendingPayments: Order[];
    todayPayments: Payment[];
    todayTotal: number;
}

const paymentMethodLabel: Record<string, string> = {
    cash: 'Naqd',
    card: 'Karta',
    online: 'Onlayn',
};

const paymentMethodIcon = (method: string) => {
    if (method === 'card') return <CreditCard className="w-3.5 h-3.5" />;
    if (method === 'online') return <Smartphone className="w-3.5 h-3.5" />;
    return <Banknote className="w-3.5 h-3.5" />;
};

export default function CashierDashboard({ pendingPayments, todayPayments, todayTotal }: Props) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('uz-UZ').format(price);

    return (
        <CashierLayout title="Kassa Dashboard">
            <Head title="Kassa Dashboard" />

            <div className="space-y-6">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-l-4 border-l-amber-400 shadow-card">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">To'lov kutilmoqda</p>
                                    <p className="text-2xl font-bold text-foreground">{pendingPayments.length}</p>
                                </div>
                                <Clock className="w-8 h-8 text-amber-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500 shadow-card">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Bugungi to'lovlar</p>
                                    <p className="text-2xl font-bold text-foreground">{todayPayments.length}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-primary shadow-card">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Bugungi jami</p>
                                    <p className="text-xl font-bold text-foreground">{formatPrice(todayTotal)} so'm</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Payments */}
                <Card className="shadow-card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                To'lov kutilayotgan buyurtmalar
                            </CardTitle>
                            <Link href="/cashier/orders/pending-payment">
                                <Button variant="outline" size="sm">Barchasini ko'rish</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pendingPayments.length > 0 ? (
                            <div className="space-y-2">
                                {pendingPayments.slice(0, 5).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                                    >
                                        <div>
                                            <p className="font-medium text-foreground">#{order.order_number}</p>
                                            {order.table && (
                                                <p className="text-sm text-muted-foreground">
                                                    Stol #{order.table.number}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-foreground">
                                                {formatPrice(order.total_amount + order.delivery_price)} so'm
                                            </p>
                                            <Link href="/cashier/orders/pending-payment">
                                                <Button size="sm" className="mt-1.5">
                                                    To'lov
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <CheckCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                                <p className="text-muted-foreground">To'lov kutilayotgan buyurtmalar yo'q</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Today's Payments */}
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Bugungi to'lovlar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {todayPayments.length > 0 ? (
                            <div className="space-y-2">
                                {todayPayments.slice(0, 10).map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                {paymentMethodIcon(payment.payment_method)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {payment.order?.order_number ?? 'Sessiya'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {paymentMethodLabel[payment.payment_method] ?? payment.payment_method}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-foreground">
                                            {formatPrice(payment.amount)} so'm
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <CreditCard className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                                <p className="text-muted-foreground">Bugun to'lovlar yo'q</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </CashierLayout>
    );
}
