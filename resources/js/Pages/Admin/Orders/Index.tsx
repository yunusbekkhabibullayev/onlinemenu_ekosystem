import { Head, Link } from '@inertiajs/react';
import { Eye, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { StatusBadge } from '@/Components/Admin/StatusBadge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Order } from '@/types';
import { cn } from '@/lib/utils';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface Props {
    orders: PaginatedOrders;
}

export default function OrdersIndex({ orders }: Props) {
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

    return (
        <AdminLayout title="Buyurtmalar">
            <Head title="Buyurtmalar" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Buyurtmalar ro'yxati</CardTitle>
                    {orders.total > 0 && (
                        <span className="text-sm text-muted-foreground">
                            Jami: {orders.total} ta | {orders.from}–{orders.to} ko'rsatilmoqda
                        </span>
                    )}
                </CardHeader>
                <CardContent>
                    {orders.data && orders.data.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Buyurtma #</TableHead>
                                        <TableHead>Telefon</TableHead>
                                        <TableHead>Summa</TableHead>
                                        <TableHead>Yetkazish</TableHead>
                                        <TableHead>Jami</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Sana</TableHead>
                                        <TableHead className="text-right">Amallar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                {order.order_number}
                                            </TableCell>
                                            <TableCell>{order.phone}</TableCell>
                                            <TableCell>
                                                {formatPrice(order.total_amount)} so'm
                                            </TableCell>
                                            <TableCell>
                                                {formatPrice(order.delivery_price)} so'm
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatPrice(order.total_amount + order.delivery_price)} so'm
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={order.status} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {formatDate((order as any).created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="flex items-center justify-center gap-1 mt-6">
                                    {orders.links.map((link, i) => {
                                        const isFirst = i === 0;
                                        const isLast = i === orders.links.length - 1;
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url ?? '#'}
                                                preserveScroll
                                                className={cn(
                                                    'inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-md border text-sm font-medium transition-colors',
                                                    link.active
                                                        ? 'bg-orange-500 text-white border-orange-500'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
                                                    !link.url && 'opacity-40 pointer-events-none'
                                                )}
                                                dangerouslySetInnerHTML={{
                                                    __html: isFirst
                                                        ? '&laquo;'
                                                        : isLast
                                                        ? '&raquo;'
                                                        : link.label,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Hali buyurtmalar yo'q</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
