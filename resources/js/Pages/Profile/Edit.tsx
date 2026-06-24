import MenuLayout from '@/Layouts/MenuLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { t } = useLanguage();
    const user = (usePage().props as any).auth?.user;
    const isAdmin = user?.role === 'admin';

    return (
        <MenuLayout>
            <Head title={t('profileInformation')} />

            <main className="pb-28 lg:pb-10 min-h-[calc(100vh-56px)] bg-background">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                    <Link
                        href="/account"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Profilga qaytish
                    </Link>

                    <div className="space-y-6">
                        <div className="bg-card border border-border p-6 shadow-card rounded-2xl">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-2xl"
                            />
                        </div>

                        <div className="bg-card border border-border p-6 shadow-card rounded-2xl">
                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>

                        {isAdmin && (
                            <div className="bg-card border border-red-200 rounded-2xl shadow-card overflow-hidden">
                                <div className="px-5 py-3 border-b border-red-100 bg-red-50/50">
                                    <h3 className="font-semibold text-sm text-red-600">Xavfli zona</h3>
                                </div>
                                <div className="p-6">
                                    <DeleteUserForm className="max-w-2xl" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </MenuLayout>
    );
}
