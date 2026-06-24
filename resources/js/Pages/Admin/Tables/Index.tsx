import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Table as TableIcon, Edit, Trash2, QrCode } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';

interface Table {
    id: number;
    number: string;
    name: string | null;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'cleaning';
    is_active: boolean;
}

interface Props {
    tables: Table[];
    restaurant: {
        id: number;
        name: string;
    } | null;
}

export default function TablesIndex({ tables, restaurant }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return <Badge>Bo'sh</Badge>;
            case 'occupied':
                return <Badge variant="destructive">Band</Badge>;
            case 'reserved':
                return <Badge variant="secondary">Rezervatsiya</Badge>;
            case 'cleaning':
                return <Badge variant="outline">Tozalash</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AdminLayout title="Stollar">
            <Head title="Stollar - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Stollar</h2>
                        <p className="text-muted-foreground mt-1">
                            Restoran: {restaurant?.name || 'Noma\'lum'}
                        </p>
                    </div>
                    <CreateTableDialog />
                </div>

                {/* Tables Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stollar ro'yxati</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tables.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Raqam</TableHead>
                                        <TableHead>Nomi</TableHead>
                                        <TableHead>Sig'im</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Faollik</TableHead>
                                        <TableHead className="text-right">Amallar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tables.map((table) => (
                                        <TableRow key={table.id}>
                                            <TableCell className="font-medium">
                                                #{table.number}
                                            </TableCell>
                                            <TableCell>{table.name || '-'}</TableCell>
                                            <TableCell>{table.capacity} kishi</TableCell>
                                            <TableCell>{getStatusBadge(table.status)}</TableCell>
                                            <TableCell>
                                                {table.is_active ? (
                                                    <Badge>Faol</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Nofaol</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <a
                                                        href={`/admin/tables/${table.id}/qrcode`}
                                                        download={`stol-${table.number}-qr.png`}
                                                        title="QR kod yuklab olish"
                                                    >
                                                        <Button variant="ghost" size="sm" type="button">
                                                            <QrCode className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                    </a>
                                                    <EditTableDialog table={table} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <TableIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                                <p className="text-muted-foreground">Hozircha stollar mavjud emas</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

function CreateTableDialog() {
    const { data, setData, post, processing, reset } = useForm({
        number: '',
        name: '',
        capacity: 4,
        status: 'available',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tables', {
            onSuccess: () => {
                toast.success('Stol yaratildi');
                reset();
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    if (typeof error === 'string') {
                        toast.error(error);
                    }
                });
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Yangi stol
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yangi stol yaratish</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="number">Stol raqami *</Label>
                        <Input
                            id="number"
                            value={data.number}
                            onChange={(e) => setData('number', e.target.value)}
                            placeholder="1, 2, VIP-1, ..."
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Stol nomi (ixtiyoriy)</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Oyna yonida, Balkon, ..."
                        />
                    </div>
                    <div>
                        <Label htmlFor="capacity">Sig'im (kishi) *</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            max="20"
                            value={data.capacity}
                            onChange={(e) => setData('capacity', parseInt(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="status">Status *</Label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="available">Bo'sh</option>
                            <option value="occupied">Band</option>
                            <option value="reserved">Rezervatsiya</option>
                            <option value="cleaning">Tozalash</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor="is_active">Faol</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={processing}>
                            Yaratish
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditTableDialog({ table }: { table: Table }) {
    const { data, setData, put, processing, delete: destroy } = useForm({
        number: table.number,
        name: table.name || '',
        capacity: table.capacity,
        status: table.status,
        is_active: table.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/tables/${table.id}`, {
            onSuccess: () => {
                toast.success('Stol yangilandi');
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    if (typeof error === 'string') {
                        toast.error(error);
                    }
                });
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Stolni o\'chirishni tasdiqlaysizmi?')) {
            destroy(`/admin/tables/${table.id}`, {
                onSuccess: () => {
                    toast.success('Stol o\'chirildi');
                },
                onError: () => {
                    toast.error('Xatolik yuz berdi');
                },
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Stolni tahrirlash</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit_number">Stol raqami *</Label>
                            <Input
                                id="edit_number"
                                value={data.number}
                                onChange={(e) => setData('number', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_name">Stol nomi</Label>
                            <Input
                                id="edit_name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_capacity">Sig'im *</Label>
                            <Input
                                id="edit_capacity"
                                type="number"
                                min="1"
                                max="20"
                                value={data.capacity}
                                onChange={(e) => setData('capacity', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit_status">Status *</Label>
                            <select
                                id="edit_status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value as 'available' | 'occupied' | 'reserved' | 'cleaning')}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="available">Bo'sh</option>
                                <option value="occupied">Band</option>
                                <option value="reserved">Rezervatsiya</option>
                                <option value="cleaning">Tozalash</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="edit_is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="edit_is_active">Faol</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={processing}>
                                Saqlash
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
        </div>
    );
}
