import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Kategoriya yaratildi',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Kategoriya yaratib bo\'lmadi',
                });
            },
        });
    };

    return (
        <AdminLayout title="Yangi kategoriya">
            <Head title="Yangi kategoriya" />

            <div className="max-w-2xl">
                <Button variant="ghost" className="mb-4" asChild>
                    <Link href="/admin/categories">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Orqaga
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Yangi kategoriya qo'shish</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Kategoriya nomi</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masalan: Salatlar"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Tartib raqami</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                                {errors.order && (
                                    <p className="text-sm text-destructive">{errors.order}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Faol</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Kategoriyani menyuda ko'rsatish
                                    </p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saqlanmoqda...' : 'Saqlash'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/categories">Bekor qilish</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
