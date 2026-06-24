import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

interface Category {
    id: number;
    name: string;
}

interface FoodItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category_id: number;
    image: string | null;
    is_available: boolean;
    order: number;
}

interface Props {
    food: FoodItem;
    categories: Category[];
}

export default function FoodsEdit({ food, categories }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        food.image ? `/storage/${food.image}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: food.name,
        description: food.description || '',
        price: food.price,
        category_id: food.category_id,
        image: null as File | null,
        is_available: food.is_available,
        order: food.order,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/foods/${food.id}`, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Taom yangilandi',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Taomni yangilab bo\'lmadi',
                });
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Taomni tahrirlash" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/foods"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Taomni tahrirlash</h1>
                        <p className="text-muted-foreground">
                            {food.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main info */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Asosiy ma'lumotlar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nomi *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Tavsif</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Narxi (UZS) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="1000"
                                            value={data.price}
                                            onChange={e => setData('price', parseFloat(e.target.value) || 0)}
                                            className="mt-1"
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-destructive mt-1">{errors.price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="category_id">Kategoriya *</Label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={e => setData('category_id', parseInt(e.target.value))}
                                            className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                        >
                                            <option value="">Tanlang...</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="text-sm text-destructive mt-1">{errors.category_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="order">Tartib raqami</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={e => setData('order', parseInt(e.target.value) || 0)}
                                        className="mt-1"
                                    />
                                    {errors.order && (
                                        <p className="text-sm text-destructive mt-1">{errors.order}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rasm</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full aspect-square object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                <span className="text-4xl">🍽️</span>
                                            </div>
                                        )}

                                        <label className="cursor-pointer block">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm">Rasm yuklash</span>
                                            </div>
                                        </label>
                                        {errors.image && (
                                            <p className="text-sm text-destructive">{errors.image}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Holati</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Mavjud</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Taom buyurtma qilish mumkinmi?
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_available}
                                            onCheckedChange={(checked) => setData('is_available', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Link href="/admin/foods" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full">
                                        Bekor qilish
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saqlanmoqda...
                                        </>
                                    ) : (
                                        'Saqlash'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
