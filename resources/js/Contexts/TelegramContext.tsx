import { createContext, useContext, ReactNode } from 'react';
import { useTelegramWebApp } from '@/Hooks/useTelegramWebApp';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    role: string;
    telegram_id: string;
    telegram_username?: string;
    telegram_photo_url?: string;
}

interface TelegramContextType {
    isTelegramContext: boolean;
    isReady: boolean;
    user: TelegramUser | null;
    authenticatedUser: AuthenticatedUser | null;
    isAuthenticating: boolean;
    colorScheme: 'light' | 'dark';
    hapticFeedback: (type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => void;
    showMainButton: (text: string, onClick: () => void) => void;
    hideMainButton: () => void;
    showBackButton: (onClick: () => void) => void;
    hideBackButton: () => void;
    showAlert: (message: string, callback?: () => void) => void;
    showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
    close: () => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export function TelegramProvider({ children }: { children: ReactNode }) {
    const telegram = useTelegramWebApp();

    return (
        <TelegramContext.Provider value={{
            isTelegramContext: telegram.isTelegramContext,
            isReady: telegram.isReady,
            user: telegram.user,
            authenticatedUser: telegram.authenticatedUser,
            isAuthenticating: telegram.isAuthenticating,
            colorScheme: telegram.colorScheme,
            hapticFeedback: telegram.hapticFeedback,
            showMainButton: telegram.showMainButton,
            hideMainButton: telegram.hideMainButton,
            showBackButton: telegram.showBackButton,
            hideBackButton: telegram.hideBackButton,
            showAlert: telegram.showAlert,
            showConfirm: telegram.showConfirm,
            close: telegram.close,
        }}>
            {children}
        </TelegramContext.Provider>
    );
}

export function useTelegram() {
    const context = useContext(TelegramContext);

    if (!context) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }

    return context;
}
