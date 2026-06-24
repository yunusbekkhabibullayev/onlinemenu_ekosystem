import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '@/Contexts/CartContext';
import { LanguageProvider } from '@/Contexts/LanguageContext';
import { TelegramProvider } from '@/Contexts/TelegramContext';
import { AddressProvider } from '@/Contexts/AddressContext';
import { Toaster } from '@/Components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Table Talk';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <TelegramProvider>
                <LanguageProvider>
                    <AddressProvider>
                        <CartProvider>
                            <App {...props} />
                            <Toaster />
                        </CartProvider>
                    </AddressProvider>
                </LanguageProvider>
            </TelegramProvider>
        );
    },
    progress: {
        color: '#f97316', // Orange primary color
    },
});
