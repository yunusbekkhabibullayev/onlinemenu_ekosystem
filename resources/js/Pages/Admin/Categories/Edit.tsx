import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Category } from '@/types';

interface Props {
    category: Category;
}

export default function CategoriesEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        order: category.order,
        is_active: category.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`, {
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Kategoriya yangilandi',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Kategoriyani yangilab bo\'lmadi',
                });
            },
        });
    };

    return (
        <AdminLayout title="Kategoriyani tahrirlash">
            <Head title="Kategoriyani tahrirlash" />

            <div className="max-w-2xl">
                <Button variant="ghost" className="mb-4" asChild>
                    <Link href="/admin/categories">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Orqaga
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Kategoriyani tahrirlash</CardTitle>
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
                                    {processing ? 'Saqlanmoqda...' : 'Yangilash'}
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
