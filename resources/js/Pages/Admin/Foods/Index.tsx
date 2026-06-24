import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { FoodItem, Category } from '@/types';
import { useState } from 'react';

interface Props {
    foods: (FoodItem & { category: Category })[];
}

export default function FoodsIndex({ foods }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const handleDelete = () => {
        if (!deleteId) return;
        setIsDeleting(true);
        router.delete(`/admin/foods/${deleteId}`, {
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Taom o\'chirildi',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Taomni o\'chirib bo\'lmadi',
                });
            },
            onFinish: () => {
                setIsDeleting(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AdminLayout title="Taomlar">
            <Head title="Taomlar" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Taomlar ro'yxati</CardTitle>
                    <Button asChild>
                        <Link href="/admin/foods/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Yangi taom
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {foods && foods.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rasm</TableHead>
                                    <TableHead>Nomi</TableHead>
                                    <TableHead>Kategoriya</TableHead>
                                    <TableHead>Narxi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {foods.map((food) => (
                                    <TableRow key={food.id}>
                                        <TableCell>
                                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                                                {food.image ? (
                                                    <img
                                                        src={`/storage/${food.image}`}
                                                        alt={food.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">
                                                        🍽️
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {food.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {food.category?.name || '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatPrice(food.price)} so'm
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={food.is_available ? 'success' : 'secondary'}>
                                                {food.is_available ? 'Mavjud' : 'Mavjud emas'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/foods/${food.id}/edit`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Dialog open={deleteId === food.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => setDeleteId(food.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Taomni o'chirish</DialogTitle>
                                                            <DialogDescription>
                                                                "{food.name}" taomini o'chirmoqchimisiz?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                                                                Bekor qilish
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={handleDelete}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? 'O\'chirilmoqda...' : 'O\'chirish'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Hali taomlar yo'q</p>
                            <Button className="mt-4" asChild>
                                <Link href="/admin/foods/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Birinchi taomni qo'shish
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
