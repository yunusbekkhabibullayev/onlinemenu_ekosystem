import { Head, router } from '@inertiajs/react';
import { Settings, Send, Globe, Clock, Trash2, CheckCircle, XCircle, Loader2, RefreshCw, Link, Unlink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface Props {
    telegram: {
        bot_token: string;
        chat_ids: string;
        is_configured: boolean;
        webhook_url: string;
        webhook_status: {
            url: string;
            has_custom_certificate: boolean;
            pending_update_count: number;
            last_error_date?: number;
            last_error_message?: string;
        } | null;
    };
    app: {
        name: string;
        timezone: string;
        locale: string;
        url: string;
    };
}

export default function SettingsIndex({ telegram, app }: Props) {
    const [testingTelegram, setTestingTelegram] = useState(false);
    const [clearingCache, setClearingCache] = useState(false);
    const [settingWebhook, setSettingWebhook] = useState(false);
    const [deletingWebhook, setDeletingWebhook] = useState(false);

    const handleTestTelegram = async () => {
        setTestingTelegram(true);
        try {
            const response = await fetch('/admin/settings/test-telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Muvaffaqiyatli!', {
                    description: data.message,
                });
            } else {
                toast.error('Xatolik!', {
                    description: data.message,
                });
            }
        } catch (error) {
            toast.error('Xatolik!', {
                description: 'Telegram ga ulanib bo\'lmadi',
            });
        } finally {
            setTestingTelegram(false);
        }
    };

    const handleClearCache = async () => {
        setClearingCache(true);
        try {
            const response = await fetch('/admin/settings/clear-cache', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Muvaffaqiyatli!', {
                    description: data.message,
                });
            } else {
                toast.error('Xatolik!', {
                    description: data.message,
                });
            }
        } catch (error) {
            toast.error('Xatolik!', {
                description: 'Keshni tozalab bo\'lmadi',
            });
        } finally {
            setClearingCache(false);
        }
    };

    const handleSetWebhook = async () => {
        setSettingWebhook(true);
        try {
            const response = await fetch('/admin/settings/set-webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Muvaffaqiyatli!', {
                    description: data.message,
                });
                router.reload();
            } else {
                toast.error('Xatolik!', {
                    description: data.message,
                });
            }
        } catch (error) {
            toast.error('Xatolik!', {
                description: 'Webhook sozlab bo\'lmadi',
            });
        } finally {
            setSettingWebhook(false);
        }
    };

    const handleDeleteWebhook = async () => {
        setDeletingWebhook(true);
        try {
            const response = await fetch('/admin/settings/delete-webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Muvaffaqiyatli!', {
                    description: data.message,
                });
                router.reload();
            } else {
                toast.error('Xatolik!', {
                    description: data.message,
                });
            }
        } catch (error) {
            toast.error('Xatolik!', {
                description: 'Webhook o\'chirib bo\'lmadi',
            });
        } finally {
            setDeletingWebhook(false);
        }
    };

    const isWebhookActive = telegram.webhook_status?.url && telegram.webhook_status.url === telegram.webhook_url;

    return (
        <AdminLayout>
            <Head title="Sozlamalar" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Sozlamalar</h1>
                    <p className="text-muted-foreground">
                        Tizim sozlamalarini boshqaring
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Telegram sozlamalari */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Send className="w-5 h-5 text-primary" />
                                    <CardTitle>Telegram Bot</CardTitle>
                                </div>
                                {telegram.is_configured ? (
                                    <Badge variant="default">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Sozlangan
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Sozlanmagan
                                    </Badge>
                                )}
                            </div>
                            <CardDescription>
                                Buyurtma bildirishnomalari uchun Telegram bot sozlamalari
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Bot Token</Label>
                                <Input
                                    value={telegram.bot_token || 'Sozlanmagan'}
                                    readOnly
                                    className="mt-1 bg-muted"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    .env faylida TELEGRAM_BOT_TOKEN orqali o'zgartiriladi
                                </p>
                            </div>

                            <div>
                                <Label>Chat ID lar</Label>
                                <Input
                                    value={telegram.chat_ids || 'Sozlanmagan'}
                                    readOnly
                                    className="mt-1 bg-muted"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    .env faylida TELEGRAM_CHAT_IDS orqali o'zgartiriladi (vergul bilan ajrating)
                                </p>
                            </div>

                            <Button
                                onClick={handleTestTelegram}
                                disabled={!telegram.is_configured || testingTelegram}
                                className="w-full"
                            >
                                {testingTelegram ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Test qilinmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Test xabar yuborish
                                    </>
                                )}
                            </Button>

                            {/* Webhook sozlamalari */}
                            <div className="pt-4 border-t">
                                <Label className="flex items-center gap-2 mb-2">
                                    <Link className="w-4 h-4" />
                                    Webhook (Telegram'dan boshqarish)
                                </Label>

                                {telegram.webhook_status && (
                                    <div className="mb-3 p-3 bg-muted rounded-lg text-xs space-y-1">
                                        <p>
                                            <strong>Joriy URL:</strong>{' '}
                                            {telegram.webhook_status.url || 'O\'rnatilmagan'}
                                        </p>
                                        <p>
                                            <strong>Kutayotgan yangilanishlar:</strong>{' '}
                                            {telegram.webhook_status.pending_update_count}
                                        </p>
                                        {telegram.webhook_status.last_error_message && (
                                            <p className="text-red-600">
                                                <strong>Oxirgi xato:</strong>{' '}
                                                {telegram.webhook_status.last_error_message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {isWebhookActive ? (
                                        <Button
                                            onClick={handleDeleteWebhook}
                                            disabled={deletingWebhook}
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            {deletingWebhook ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Unlink className="w-4 h-4 mr-2" />
                                            )}
                                            Webhook o'chirish
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSetWebhook}
                                            disabled={!telegram.is_configured || settingWebhook}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            {settingWebhook ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Link className="w-4 h-4 mr-2" />
                                            )}
                                            Webhook sozlash
                                        </Button>
                                    )}
                                </div>

                                <p className="text-xs text-muted-foreground mt-2">
                                    Webhook sozlanganda Telegram'dan to'g'ridan-to'g'ri buyurtma statusini o'zgartirish mumkin
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dastur sozlamalari */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Dastur sozlamalari
                            </CardTitle>
                            <CardDescription>
                                Asosiy dastur konfiguratsiyasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Dastur nomi</Label>
                                <Input
                                    value={app.name}
                                    readOnly
                                    className="mt-1 bg-muted"
                                />
                            </div>

                            <div>
                                <Label className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Vaqt mintaqasi
                                </Label>
                                <Input
                                    value={app.timezone}
                                    readOnly
                                    className="mt-1 bg-muted"
                                />
                            </div>

                            <div>
                                <Label className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Til
                                </Label>
                                <Input
                                    value={app.locale === 'uz' ? 'O\'zbek' : app.locale === 'ru' ? 'Русский' : app.locale}
                                    readOnly
                                    className="mt-1 bg-muted"
                                />
                            </div>

                            <div>
                                <Label>Sayt URL</Label>
                                <Input
                                    value={app.url}
                                    readOnly
                                    className="mt-1 bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kesh boshqaruvi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="w-5 h-5" />
                                Kesh boshqaruvi
                            </CardTitle>
                            <CardDescription>
                                Dastur keshini tozalash
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Agar o'zgarishlar ko'rinmasa yoki xatoliklar bo'lsa, keshni tozalang.
                                Bu config, view va app keshlarini tozalaydi.
                            </p>

                            <Button
                                onClick={handleClearCache}
                                disabled={clearingCache}
                                variant="outline"
                                className="w-full"
                            >
                                {clearingCache ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Tozalanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Keshni tozalash
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Yordam */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Telegram Bot yaratish</CardTitle>
                            <CardDescription>
                                Telegram bildirishnomalarini sozlash uchun qo'llanma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                <li>Telegram da <strong>@BotFather</strong> ga yozing</li>
                                <li><code>/newbot</code> buyrug'ini yuboring</li>
                                <li>Bot uchun nom va username kiriting</li>
                                <li>Olingan <strong>token</strong> ni nusxalang</li>
                                <li>Botingizga start bosing va biror xabar yozing</li>
                                <li>
                                    <code>https://api.telegram.org/bot{'<TOKEN>'}/getUpdates</code> orqali <strong>chat_id</strong> ni oling
                                </li>
                                <li>.env faylida quyidagilarni qo'shing:</li>
                            </ol>
                            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_IDS=chat_id_1,chat_id_2`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
