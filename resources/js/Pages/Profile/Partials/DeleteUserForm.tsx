import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const { t } = useLanguage();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const inputClass = 'mt-1 block w-full py-3 px-4 bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all';
    const dangerBtnClass = 'rounded-xl bg-destructive text-destructive-foreground font-semibold px-4 py-3 hover:bg-destructive/90 transition-colors disabled:opacity-50';
    const outlineBtnClass = 'rounded-xl border border-border bg-card text-foreground font-semibold px-4 py-3 hover:bg-secondary transition-colors';

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="font-display text-lg font-semibold text-foreground">
                    {t('deleteAccount')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('deleteAccountDesc')}
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className={dangerBtnClass}
            >
                {t('deleteAccount')}
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                        {t('deleteAccountConfirm')}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('deleteAccountWarning')}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={t('password')}
                            className="sr-only"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={inputClass}
                            isFocused
                            placeholder={t('password')}
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className={outlineBtnClass}>
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className={dangerBtnClass}
                        >
                            {t('deleteAccount')}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
