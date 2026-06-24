import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Users, UserCheck, ChefHat, CreditCard } from 'lucide-react';
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
import { User } from '@/types';
import { useState } from 'react';

interface Props {
    staff: User[];
    groupedStaff: {
        waiter: User[];
        kitchen: User[];
        cashier: User[];
    };
}

const roleLabels = {
    waiter: 'Ofitsiant',
    kitchen: 'Oshxona',
    cashier: 'Kassa',
};

const roleIcons = {
    waiter: UserCheck,
    kitchen: ChefHat,
    cashier: CreditCard,
};

const roleVariants: Record<string, 'default' | 'secondary' | 'outline'> = {
    waiter: 'default',
    kitchen: 'secondary',
    cashier: 'outline',
};

export default function StaffIndex({ staff, groupedStaff }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;
        setIsDeleting(true);
        router.delete(`/admin/staff/${deleteId}`, {
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Xodim o\'chirildi',
                });
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Xodimni o\'chirib bo\'lmadi',
                });
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AdminLayout title="Xodimlar">
            <Head title="Xodimlar" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Xodimlar</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Barcha xodimlarni boshqarish
                        </p>
                    </div>
                    <Link href="/admin/staff/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Yangi xodim
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ofitsiantlar</CardTitle>
                            <UserCheck className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{groupedStaff.waiter.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Oshxona</CardTitle>
                            <ChefHat className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{groupedStaff.kitchen.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Kassa</CardTitle>
                            <CreditCard className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{groupedStaff.cashier.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Staff Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Barcha xodimlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ism</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Xodim kodi</TableHead>
                                    <TableHead>Holat</TableHead>
                                    <TableHead className="text-right">Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Xodimlar topilmadi
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    staff.map((member) => {
                                        const RoleIcon = roleIcons[member.role as keyof typeof roleIcons];
                                        return (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-medium">
                                                    {member.name}
                                                </TableCell>
                                                <TableCell>{member.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={roleVariants[member.role as keyof typeof roleVariants] ?? 'outline'}>
                                                        <RoleIcon className="w-3 h-3 mr-1" />
                                                        {roleLabels[member.role as keyof typeof roleLabels]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {member.employee_code || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={member.is_active ? 'default' : 'secondary'}>
                                                        {member.is_active ? 'Faol' : 'Nofaol'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/staff/${member.id}/edit`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setDeleteId(member.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Xodimni o'chirish</DialogTitle>
                                                                    <DialogDescription>
                                                                        Bu xodimni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => setDeleteId(null)}
                                                                    >
                                                                        Bekor qilish
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={handleDelete}
                                                                        disabled={isDeleting || deleteId !== member.id}
                                                                    >
                                                                        {isDeleting ? 'O\'chirilmoqda...' : 'O\'chirish'}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
