import { useState, useEffect, useCallback } from 'react';

// Telegram WebApp types
interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        query_id?: string;
        user?: TelegramWebAppUser;
        auth_date?: number;
        hash?: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
        bg_color?: string;
        text_color?: string;
        hint_color?: string;
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
        secondary_bg_color?: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: {
        isVisible: boolean;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
    };
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        isProgressVisible: boolean;
        setText: (text: string) => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        showProgress: (leaveActive?: boolean) => void;
        hideProgress: () => void;
    };
    HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        selectionChanged: () => void;
    };
    ready: () => void;
    expand: () => void;
    close: () => void;
    sendData: (data: string) => void;
    openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
    openTelegramLink: (url: string) => void;
    showPopup: (params: {
        title?: string;
        message: string;
        buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text?: string;
        }>;
    }, callback?: (buttonId: string) => void) => void;
    showAlert: (message: string, callback?: () => void) => void;
    showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
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

export function useTelegramWebApp() {
    const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
    const [user, setUser] = useState<TelegramWebAppUser | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isTelegramContext, setIsTelegramContext] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        // Check if running in Telegram WebApp context
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tgWebApp = window.Telegram.WebApp;

            setWebApp(tgWebApp);
            setIsTelegramContext(true);

            // Get user data
            if (tgWebApp.initDataUnsafe?.user) {
                setUser(tgWebApp.initDataUnsafe.user);
            }

            // Tell Telegram that the Mini App is ready
            tgWebApp.ready();

            // Expand to full height
            tgWebApp.expand();

            setIsReady(true);

            // Auto-authenticate if in Telegram context
            if (tgWebApp.initData) {
                authenticateWithTelegram(tgWebApp.initData);
            }
        } else {
            setIsReady(true);
        }
    }, []);

    const authenticateWithTelegram = useCallback(async (initData: string) => {
        if (!initData || isAuthenticating) return;

        setIsAuthenticating(true);

        try {
            const response = await fetch('/telegram/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ initData }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success && data.user) {
                setAuthenticatedUser(data.user);
                console.log('Telegram auth successful:', data.user);
            } else {
                console.warn('Telegram auth failed:', data.message);
            }
        } catch (error) {
            console.error('Telegram auth error:', error);
        } finally {
            setIsAuthenticating(false);
        }
    }, [isAuthenticating]);

    const hapticFeedback = useCallback((type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => {
        if (!webApp?.HapticFeedback) return;

        if (['success', 'error', 'warning'].includes(type)) {
            webApp.HapticFeedback.notificationOccurred(type as 'success' | 'error' | 'warning');
        } else {
            webApp.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
        }
    }, [webApp]);

    const showMainButton = useCallback((text: string, onClick: () => void) => {
        if (!webApp?.MainButton) return;

        webApp.MainButton.setText(text);
        webApp.MainButton.onClick(onClick);
        webApp.MainButton.show();
    }, [webApp]);

    const hideMainButton = useCallback(() => {
        if (!webApp?.MainButton) return;
        webApp.MainButton.hide();
    }, [webApp]);

    const showBackButton = useCallback((onClick: () => void) => {
        if (!webApp?.BackButton) return;
        webApp.BackButton.onClick(onClick);
        webApp.BackButton.show();
    }, [webApp]);

    const hideBackButton = useCallback(() => {
        if (!webApp?.BackButton) return;
        webApp.BackButton.hide();
    }, [webApp]);

    const showAlert = useCallback((message: string, callback?: () => void) => {
        if (webApp?.showAlert) {
            webApp.showAlert(message, callback);
        } else {
            alert(message);
            callback?.();
        }
    }, [webApp]);

    const showConfirm = useCallback((message: string, callback?: (confirmed: boolean) => void) => {
        if (webApp?.showConfirm) {
            webApp.showConfirm(message, callback);
        } else {
            const confirmed = confirm(message);
            callback?.(confirmed);
        }
    }, [webApp]);

    const close = useCallback(() => {
        if (webApp?.close) {
            webApp.close();
        }
    }, [webApp]);

    return {
        webApp,
        user,
        isReady,
        isTelegramContext,
        authenticatedUser,
        isAuthenticating,
        initData: webApp?.initData || '',
        colorScheme: webApp?.colorScheme || 'light',
        themeParams: webApp?.themeParams || {},
        hapticFeedback,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
        showAlert,
        showConfirm,
        close,
    };
}
