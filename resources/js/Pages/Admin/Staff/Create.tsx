import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

export default function StaffCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'waiter' as 'waiter' | 'kitchen' | 'cashier',
        employee_code: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/staff', {
            onSuccess: () => {
                toast.success('Muvaffaqiyatli!', {
                    description: 'Xodim yaratildi',
                });
            },
            onError: () => {
                toast.error('Xatolik!', {
                    description: 'Xodim yaratib bo\'lmadi',
                });
            },
        });
    };

    return (
        <AdminLayout title="Yangi xodim">
            <Head title="Yangi xodim" />

            <div className="max-w-2xl">
                <Button variant="ghost" className="mb-4" asChild>
                    <Link href="/admin/staff">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Orqaga
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Yangi xodim qo'shish</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Ism *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masalan: Ali Valiyev"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username *</Label>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="Masalan: waiter1"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Kirish uchun ishlatiladi (harf, raqam, _ . -)
                                </p>
                                {errors.username && (
                                    <p className="text-sm text-destructive">{errors.username}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="example@mail.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Rol *</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value: 'waiter' | 'kitchen' | 'cashier') => setData('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rolni tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="waiter">Ofitsiant</SelectItem>
                                        <SelectItem value="kitchen">Oshxona</SelectItem>
                                        <SelectItem value="cashier">Kassa</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-destructive">{errors.role}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employee_code">Xodim kodi</Label>
                                <Input
                                    id="employee_code"
                                    value={data.employee_code}
                                    onChange={(e) => setData('employee_code', e.target.value)}
                                    placeholder="Avtomatik yaratiladi"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Bo'sh qoldirilsa, avtomatik yaratiladi
                                </p>
                                {errors.employee_code && (
                                    <p className="text-sm text-destructive">{errors.employee_code}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Parol *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kamida 8 ta belgi"
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Parolni tasdiqlash *</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Parolni takrorlang"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Faol</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Xodim tizimga kirishi mumkin
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
                                    <Link href="/admin/staff">Bekor qilish</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
