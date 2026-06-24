import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, UtensilsCrossed, FolderTree, DollarSign, Clock, Eye } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { StatCard } from '@/Components/Admin/StatCard';
import { StatusBadge } from '@/Components/Admin/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Order, Category, FoodItem } from '@/types';

interface Props {
    stats: {
        todayOrders: number;
        totalRevenue: number;
        todayRevenue: number;
        totalFoods: number;
        totalCategories: number;
        pendingOrders: number;
    };
    recentOrders: Order[];
}

export default function Dashboard({ stats, recentOrders }: Props) {
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
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard
                    title="Bugungi buyurtmalar"
                    value={stats.todayOrders}
                    icon={<ShoppingBag className="w-6 h-6" />}
                />
                <StatCard
                    title="Bugungi daromad"
                    value={`${formatPrice(stats.todayRevenue)} so'm`}
                    icon={<DollarSign className="w-6 h-6" />}
                    description={`Jami: ${formatPrice(stats.totalRevenue)} so'm`}
                />
                <StatCard
                    title="Taomlar soni"
                    value={stats.totalFoods}
                    icon={<UtensilsCrossed className="w-6 h-6" />}
                />
                <StatCard
                    title="Kutilayotgan"
                    value={stats.pendingOrders}
                    icon={<Clock className="w-6 h-6" />}
                    description="buyurtmalar"
                />
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Oxirgi buyurtmalar</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/orders">Barchasini ko'rish</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {recentOrders && recentOrders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Buyurtma #</TableHead>
                                    <TableHead>Telefon</TableHead>
                                    <TableHead>Summa</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sana</TableHead>
                                    <TableHead className="text-right">Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {order.order_number}
                                        </TableCell>
                                        <TableCell>{order.phone}</TableCell>
                                        <TableCell>
                                            {formatPrice(order.total_amount + order.delivery_price)} so'm
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(order.created_at as unknown as string)}
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
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Hali buyurtmalar yo'q</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
