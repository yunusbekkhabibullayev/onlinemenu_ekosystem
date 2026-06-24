import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Transition } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { User } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import { User as UserType } from '@/types';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { t } = useLanguage();
    const user = usePage().props.auth.user as UserType | undefined;
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Profil ma'lumotlari (name, email) ── */
    const {
        data, setData, patch, errors, processing, recentlySuccessful,
    } = useForm({
        name:  user?.name  ?? '',
        email: user?.email ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    /* ── Avatar yuklash (FormData + router.post — useForm ishlatmaymiz) ── */
    const [previewFile, setPreviewFile]       = useState<File | null>(null);
    const [avatarProcessing, setAvatarProcessing] = useState(false);
    const [avatarSuccess, setAvatarSuccess]   = useState(false);
    const [avatarError, setAvatarError]       = useState<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreviewFile(file);
        setAvatarError(null);
        setAvatarSuccess(false);
        setAvatarProcessing(true);

        const fd = new FormData();
        fd.append('avatar', file);

        router.post(route('profile.avatar'), fd, {
            forceFormData: true,
            onSuccess: () => {
                setAvatarSuccess(true);
                setTimeout(() => setAvatarSuccess(false), 3000);
            },
            onError: (errs) => {
                setAvatarError(errs.avatar ?? t('errorOccurred') ?? 'Xatolik yuz berdi');
                setPreviewFile(null);
            },
            onFinish: () => setAvatarProcessing(false),
        });
    };

    const previewUrl = previewFile
        ? URL.createObjectURL(previewFile)
        : user?.avatar
            ? `/storage/${user.avatar}`
            : null;

    const inputClass = 'mt-1 block w-full py-3 px-4 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all';
    const btnClass = 'rounded-xl bg-primary text-primary-foreground font-semibold px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50';

    return (
        <section className={className}>
            <header>
                <h2 className="font-display text-lg font-semibold text-foreground">
                    {t('profileInformation')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('profileInformationDesc')}
                </p>
            </header>

            {/* ── Avatar yuklash ── */}
            <div className="mt-6">
                <InputLabel value={t('profilePhoto')} className="text-foreground" />
                <p className="mt-0.5 text-xs text-muted-foreground">{t('profilePhotoDesc')}</p>
                <div className="mt-2 flex items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                        {previewUrl ? (
                            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                <User className="h-10 w-10 text-primary" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <button
                            type="button"
                            disabled={avatarProcessing}
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-fit ${btnClass}`}
                        >
                            {avatarProcessing
                                ? 'Yuklanmoqda...'
                                : previewUrl
                                    ? t('changePhoto')
                                    : t('choosePhoto')}
                        </button>
                        <Transition
                            show={avatarSuccess}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-xs text-green-600">{t('saved')}</p>
                        </Transition>
                    </div>
                </div>
                <InputError className="mt-1" message={avatarError ?? undefined} />
            </div>

            {/* ── Ism va email ── */}
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value={t('name')} className="text-foreground" />
                    <TextInput
                        id="name"
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('email')} className="text-foreground" />
                    <TextInput
                        id="email"
                        type="email"
                        className={inputClass}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user?.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-foreground">
                            {t('emailUnverified')}{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            >
                                {t('resendVerification')}
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm font-medium text-green-600">
                                {t('verificationLinkSent')}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={processing} className={btnClass}>
                        {t('save')}
                    </button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-muted-foreground">{t('saved')}</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
