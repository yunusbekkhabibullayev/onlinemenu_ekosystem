import { Head, router, useForm } from '@inertiajs/react';
import { CreditCard, DollarSign, ArrowLeft, Clock, Banknote, Smartphone } from 'lucide-react';
import CashierLayout from '@/Layouts/CashierLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
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
    name: string | null;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string | null;
    total_amount: number;
    delivery_price: number;
    payment_status: string;
    delivered_at: string | null;
    table: Table | null;
    items: OrderItem[];
    payments: Array<{
        id: number;
        amount: number;
        payment_method: string;
        created_at: string;
    }>;
}

interface Props {
    orders: Order[];
}

const paymentLabel: Record<string, string> = {
    cash: 'Naqd',
    card: 'Karta',
    online: 'Onlayn',
};

export default function PendingPayments({ orders }: Props) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('uz-UZ').format(price);

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('uz-UZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaidAmount = (order: Order) =>
        order.payments
            .filter((p) => p.payment_method !== 'refunded')
            .reduce((sum, p) => sum + p.amount, 0);

    const getRemainingAmount = (order: Order) => {
        const total = order.total_amount + order.delivery_price;
        return total - getPaidAmount(order);
    };

    return (
        <CashierLayout title="To'lov kutilayotgan buyurtmalar">
            <Head title="To'lovlar - Kassa" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground mt-0.5">
                            Jami: <span className="font-semibold text-foreground">{orders.length}</span> ta buyurtma
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/cashier/dashboard')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => {
                        const paidAmount = getPaidAmount(order);
                        const remainingAmount = getRemainingAmount(order);
                        const total = order.total_amount + order.delivery_price;

                        return (
                            <Card key={order.id} className="shadow-card border-l-4 border-l-amber-400">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Order header */}
                                            <div className="flex items-center gap-2 flex-wrap mb-3">
                                                <span className="font-bold text-lg text-foreground">
                                                    #{order.order_number}
                                                </span>
                                                {order.table && (
                                                    <Badge variant="outline">
                                                        Stol #{order.table.number}
                                                        {order.table.name && ` (${order.table.name})`}
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant={
                                                        order.payment_status === 'paid'
                                                            ? 'default'
                                                            : order.payment_status === 'partial'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {order.payment_status === 'paid'
                                                        ? "To'langan"
                                                        : order.payment_status === 'partial'
                                                        ? "Qisman to'langan"
                                                        : "To'lanmagan"}
                                                </Badge>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                                                {order.customer_name && <span>{order.customer_name}</span>}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Yetkazildi: {formatDate(order.delivered_at)}
                                                </span>
                                            </div>

                                            {/* Items */}
                                            <div className="space-y-1 mb-4">
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

                                            {/* Summary */}
                                            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Jami summa</p>
                                                    <p className="font-bold text-foreground">{formatPrice(total)} so'm</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">To'langan</p>
                                                    <p className="font-bold text-green-600">{formatPrice(paidAmount)} so'm</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Qolgan</p>
                                                    <p className="font-bold text-destructive">{formatPrice(remainingAmount)} so'm</p>
                                                </div>
                                            </div>

                                            {/* Payment history */}
                                            {order.payments.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-border">
                                                    <p className="text-xs text-muted-foreground mb-2">To'lovlar tarixi:</p>
                                                    <div className="space-y-1">
                                                        {order.payments.map((payment) => (
                                                            <div
                                                                key={payment.id}
                                                                className="flex items-center justify-between text-xs text-muted-foreground"
                                                            >
                                                                <span>
                                                                    {paymentLabel[payment.payment_method] ?? payment.payment_method}
                                                                    {' — '}
                                                                    {formatDate(payment.created_at)}
                                                                </span>
                                                                <span className="font-medium text-foreground">
                                                                    {formatPrice(payment.amount)} so'm
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="shrink-0">
                                            <PaymentDialog order={order} remainingAmount={remainingAmount} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {orders.length === 0 && (
                    <Card className="shadow-card">
                        <CardContent className="py-16 text-center">
                            <CreditCard className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">
                                To'lov kutilayotgan buyurtmalar yo'q
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </CashierLayout>
    );
}

function PaymentDialog({ order, remainingAmount }: { order: Order; remainingAmount: number }) {
    const { data, setData, post, processing, reset } = useForm({
        amount: remainingAmount.toString(),
        payment_method: 'cash',
        notes: '',
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('uz-UZ').format(price);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/cashier/orders/${order.id}/payment`, {
            onSuccess: () => {
                toast.success("To'lov qabul qilindi");
                reset();
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    if (typeof error === 'string') toast.error(error);
                });
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg">
                    <DollarSign className="w-4 h-4 mr-2" />
                    To'lov
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>To'lov qabul qilish — #{order.order_number}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div>
                        <Label htmlFor="amount">To'lov summasi</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="1"
                            min="1"
                            max={remainingAmount}
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            required
                            className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Qolgan: {formatPrice(remainingAmount)} so'm
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="payment_method">To'lov usuli</Label>
                        <Select
                            value={data.payment_method}
                            onValueChange={(v) => setData('payment_method', v)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="To'lov usulini tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Naqd pul</SelectItem>
                                <SelectItem value="card">Bank kartasi</SelectItem>
                                <SelectItem value="online">Onlayn to'lov</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="notes">Eslatma (ixtiyoriy)</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            className="mt-1"
                        />
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        To'lovni tasdiqlash
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
