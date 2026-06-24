import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
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
import { Category } from '@/types';
import { useState } from 'react';

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setIsDeleting(true);
        router.delete(`/admin/categories/${deleteId}`, {
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Kategoriya o\'chirildi',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Kategoriyani o\'chirib bo\'lmadi',
                });
            },
            onFinish: () => {
                setIsDeleting(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AdminLayout title="Kategoriyalar">
            <Head title="Kategoriyalar" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Kategoriyalar ro'yxati</CardTitle>
                    <Button asChild>
                        <Link href="/admin/categories/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Yangi kategoriya
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {categories && categories.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tartib</TableHead>
                                    <TableHead>Nomi</TableHead>
                                    <TableHead>Taomlar soni</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            {category.order}
                                        </TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {(category as any).food_items_count || 0} ta
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={category.is_active ? 'success' : 'secondary'}>
                                                {category.is_active ? 'Faol' : 'Nofaol'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Dialog open={deleteId === category.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => setDeleteId(category.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Kategoriyani o'chirish</DialogTitle>
                                                            <DialogDescription>
                                                                "{category.name}" kategoriyasini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
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
                            <FolderTree className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Hali kategoriyalar yo'q</p>
                            <Button className="mt-4" asChild>
                                <Link href="/admin/categories/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Birinchi kategoriyani qo'shish
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
