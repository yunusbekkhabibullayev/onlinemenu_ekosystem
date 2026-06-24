import { Head, useForm } from '@inertiajs/react';
import { Store, MapPin, Phone, Clock, Instagram, Send, Truck, Globe, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface Restaurant {
    id?: number;
    name: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    working_hours: string | null;
    logo: string | null;
    location_url: string | null;
    instagram: string | null;
    telegram: string | null;
    delivery_price: number;
    is_active: boolean;
}

interface Props {
    restaurant: Restaurant | null;
}

export default function RestaurantIndex({ restaurant }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        restaurant?.logo ? `/storage/${restaurant.logo}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        name: restaurant?.name || '',
        description: restaurant?.description || '',
        address: restaurant?.address || '',
        phone: restaurant?.phone || '',
        working_hours: restaurant?.working_hours || '',
        location_url: restaurant?.location_url || '',
        instagram: restaurant?.instagram || '',
        telegram: restaurant?.telegram || '',
        delivery_price: restaurant?.delivery_price || 0,
        is_active: restaurant?.is_active ?? true,
        logo: null as File | null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/restaurant', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Restoran ma\'lumotlari yangilandi',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Ma\'lumotlarni saqlab bo\'lmadi',
                });
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Restoran sozlamalari" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Restoran sozlamalari</h1>
                    <p className="text-muted-foreground">
                        Restoran haqidagi asosiy ma'lumotlarni boshqaring
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Asosiy ma'lumotlar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="w-5 h-5" />
                                    Asosiy ma'lumotlar
                                </CardTitle>
                                <CardDescription>
                                    Restoran nomi va tavsifi
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Restoran nomi *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Masalan: Oq Saroy"
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
                                        placeholder="Restoran haqida qisqacha ma'lumot..."
                                        rows={4}
                                        className="mt-1"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>Logo</Label>
                                    <div className="mt-1 flex items-center gap-4">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Logo"
                                                className="w-20 h-20 rounded-xl object-cover border"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center border">
                                                <Store className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm">Yuklash</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <Label htmlFor="is_active">Faol holati</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Restoran buyurtma qabul qilmoqdami?
                                        </p>
                                    </div>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Aloqa ma'lumotlari */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Aloqa ma'lumotlari
                                </CardTitle>
                                <CardDescription>
                                    Manzil, telefon va ish vaqti
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="address">Manzil</Label>
                                    <div className="relative mt-1">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            placeholder="Toshkent sh., Chilonzor t."
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="phone">Telefon</Label>
                                    <div className="relative mt-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="+998 90 123 45 67"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="working_hours">Ish vaqti</Label>
                                    <div className="relative mt-1">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="working_hours"
                                            value={data.working_hours}
                                            onChange={e => setData('working_hours', e.target.value)}
                                            placeholder="09:00 - 23:00"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="location_url">Lokatsiya (Google Maps)</Label>
                                    <div className="relative mt-1">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="location_url"
                                            value={data.location_url}
                                            onChange={e => setData('location_url', e.target.value)}
                                            placeholder="https://maps.google.com/..."
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ijtimoiy tarmoqlar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Instagram className="w-5 h-5" />
                                    Ijtimoiy tarmoqlar
                                </CardTitle>
                                <CardDescription>
                                    Instagram va Telegram manzillari
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <div className="relative mt-1">
                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="instagram"
                                            value={data.instagram}
                                            onChange={e => setData('instagram', e.target.value)}
                                            placeholder="https://instagram.com/restaurant"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="telegram">Telegram</Label>
                                    <div className="relative mt-1">
                                        <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="telegram"
                                            value={data.telegram}
                                            onChange={e => setData('telegram', e.target.value)}
                                            placeholder="https://t.me/restaurant"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Yetkazib berish */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Yetkazib berish
                                </CardTitle>
                                <CardDescription>
                                    Yetkazib berish narxi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="delivery_price">Yetkazib berish narxi (UZS) *</Label>
                                    <Input
                                        id="delivery_price"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={data.delivery_price}
                                        onChange={e => setData('delivery_price', parseFloat(e.target.value) || 0)}
                                        placeholder="15000"
                                        className="mt-1"
                                    />
                                    {errors.delivery_price && (
                                        <p className="text-sm text-destructive mt-1">{errors.delivery_price}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                                        0 qo'ying agar yetkazib berish bepul bo'lsa
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} size="lg">
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
                </form>
            </div>
        </AdminLayout>
    );
}
