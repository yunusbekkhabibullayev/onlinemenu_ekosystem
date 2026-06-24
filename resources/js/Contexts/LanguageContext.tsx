import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'uz' | 'ru';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    uz: {
        home: 'Bosh sahifa',
        menu: 'Menyu',
        orders: 'Buyurtmalar',
        account: 'Profil',
        cart: 'Savat',
        categories: 'Kategoriyalar',
        allItems: 'Barcha taomlar',
        search: 'Qidirish...',
        available: 'Mavjud',
        unavailable: 'Mavjud emas',
        price: 'Narx',
        workingHours: 'Ish vaqti',
        address: 'Manzil',
        phone: 'Telefon',
        followUs: 'Bizni kuzating',
        language: 'Til',
        currency: "so'm",
        viewMenu: "Menyuni ko'rish",
        featured: 'Tavsiya etilgan',
        popular: 'Ommabop',
        restaurantInfo: 'Restoran haqida',
        restaurant: 'Restoran',
        restaurants: 'Restoranlar',
        close: 'Yopish',
        order: 'Buyurtma',
        cartEmpty: "Savat bo'sh",
        cartEmptyMessage: "Savatingizda hech narsa yo'q. Menyudan taomlar qo'shing.",
        subtotal: 'Oraliq jami',
        delivery: 'Yetkazib berish',
        total: 'Jami',
        placeOrder: 'Buyurtma berish',
        phoneNumber: 'Telefon raqami',
        phoneRequired: 'Telefon raqamini kiriting',
        phoneIncomplete: "Telefon raqami to'liq emas",
        invalidOperator: "Noto'g'ri operator kodi",
        invalidFormat: "Noto'g'ri telefon raqami formati",
        phoneHint: 'Format: +998 XX XXX XX XX',
        confirmOrder: 'Tasdiqlash',
        sending: 'Yuborilmoqda...',
        orderSuccess: 'Buyurtma qabul qilindi!',
        orderSuccessMessage: "Tez orada siz bilan bog'lanamiz.",
        orderError: "Xatolik yuz berdi. Qayta urinib ko'ring.",
        noResults: 'Hech narsa topilmadi',
        tryDifferentSearch: "Boshqa so'z bilan qidiring",
        orderSummary: 'Buyurtma tafsilotlari',
        items: 'ta mahsulot',
        login: 'Kirish',
        register: "Ro'yxatdan o'tish",
        logout: 'Chiqish',
        welcome: 'Xush kelibsiz!',
        loginPrompt: 'Admin paneliga kirish uchun tizimga kiring',
        email: 'Email',
        password: 'Parol',
        confirmPassword: 'Parolni tasdiqlash',
        name: 'Ism',
        rememberMe: 'Eslab qolish',
        forgotPassword: 'Parolni unutdingizmi?',
        alreadyRegistered: 'Allaqachon ro\'yxatdan o\'tganmisiz?',
        dontHaveAccount: 'Akkauntingiz yo\'qmi?',
        // Profil (admin)
        profileInformation: 'Profil ma\'lumotlari',
        profileInformationDesc: 'Hisobingiz profil ma\'lumotlari va email manzilini yangilang.',
        profilePhoto: 'Profil rasmi',
        profilePhotoDesc: 'JPG, PNG, GIF yoki boshqa rasm formatlari. Maksimal 10 MB.',
        choosePhoto: 'Rasm tanlang',
        changePhoto: 'Rasmni almashtirish',
        updatePassword: 'Parolni yangilash',
        updatePasswordDesc: 'Hisobingiz uzoq va tasodifiy paroldan foydalanishiga ishonch hosil qiling.',
        currentPassword: 'Joriy parol',
        newPassword: 'Yangi parol',
        deleteAccount: 'Hisobni o\'chirish',
        deleteAccountDesc: 'Hisob o\'chirilgach, barcha ma\'lumotlar butunlay yo\'q qilinadi. Oldin saqlab qolmoqchi bo\'lgan ma\'lumotlaringizni yuklab oling.',
        deleteAccountConfirm: 'Hisobni o\'chirishni xohlaysizmi?',
        deleteAccountWarning: 'Hisob o\'chirilgach, barcha ma\'lumotlar butunlay yo\'q qilinadi. Tasdiqlash uchun parolingizni kiriting.',
        save: 'Saqlash',
        cancel: 'Bekor qilish',
        saved: 'Saqlandi.',
        resendVerification: 'Tasdiqlash havolasini qayta yuborish',
        emailUnverified: 'Email manzilingiz hali tasdiqlanmagan.',
        verificationLinkSent: 'Yangi tasdiqlash havolasi email manzilingizga yuborildi.',
    },
    ru: {
        home: 'Главная',
        menu: 'Меню',
        orders: 'Заказы',
        account: 'Профиль',
        cart: 'Корзина',
        categories: 'Категории',
        allItems: 'Все блюда',
        search: 'Поиск...',
        available: 'В наличии',
        unavailable: 'Нет в наличии',
        price: 'Цена',
        workingHours: 'Время работы',
        address: 'Адрес',
        phone: 'Телефон',
        followUs: 'Подписывайтесь',
        language: 'Язык',
        currency: 'сум',
        viewMenu: 'Смотреть меню',
        featured: 'Рекомендуемые',
        popular: 'Популярные',
        restaurantInfo: 'О ресторане',
        restaurant: 'Ресторан',
        restaurants: 'Рестораны',
        close: 'Закрыть',
        order: 'Заказать',
        cartEmpty: 'Корзина пуста',
        cartEmptyMessage: 'В вашей корзине пока нет товаров. Добавьте блюда из меню.',
        subtotal: 'Подытог',
        delivery: 'Доставка',
        total: 'Итого',
        placeOrder: 'Оформить заказ',
        phoneNumber: 'Номер телефона',
        phoneRequired: 'Введите номер телефона',
        phoneIncomplete: 'Номер телефона неполный',
        invalidOperator: 'Неверный код оператора',
        invalidFormat: 'Неверный формат номера телефона',
        phoneHint: 'Формат: +998 XX XXX XX XX',
        confirmOrder: 'Подтвердить',
        sending: 'Отправка...',
        orderSuccess: 'Заказ принят!',
        orderSuccessMessage: 'Мы свяжемся с вами в ближайшее время.',
        orderError: 'Произошла ошибка. Попробуйте ещё раз.',
        noResults: 'Ничего не найдено',
        tryDifferentSearch: 'Попробуйте другой запрос',
        orderSummary: 'Детали заказа',
        items: 'товаров',
        login: 'Войти',
        register: 'Регистрация',
        logout: 'Выйти',
        welcome: 'Добро пожаловать!',
        loginPrompt: 'Войдите для доступа к панели администратора',
        email: 'Email',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        name: 'Имя',
        rememberMe: 'Запомнить меня',
        forgotPassword: 'Забыли пароль?',
        alreadyRegistered: 'Уже зарегистрированы?',
        dontHaveAccount: 'Нет аккаунта?',
        // Профиль (админ)
        profileInformation: 'Данные профиля',
        profileInformationDesc: 'Обновите данные профиля и email адрес вашей учётной записи.',
        profilePhoto: 'Фото профиля',
        profilePhotoDesc: 'JPG, PNG, GIF и другие форматы. Максимум 10 МБ.',
        choosePhoto: 'Выбрать фото',
        changePhoto: 'Изменить фото',
        updatePassword: 'Изменить пароль',
        updatePasswordDesc: 'Убедитесь, что ваш аккаунт использует длинный надёжный пароль.',
        currentPassword: 'Текущий пароль',
        newPassword: 'Новый пароль',
        deleteAccount: 'Удалить аккаунт',
        deleteAccountDesc: 'После удаления аккаунта все данные будут безвозвратно удалены. Перед удалением сохраните нужные данные.',
        deleteAccountConfirm: 'Вы уверены, что хотите удалить аккаунт?',
        deleteAccountWarning: 'После удаления аккаунта все данные будут удалены. Введите пароль для подтверждения.',
        save: 'Сохранить',
        cancel: 'Отмена',
        saved: 'Сохранено.',
        resendVerification: 'Отправить ссылку подтверждения повторно',
        emailUnverified: 'Ваш email ещё не подтверждён.',
        verificationLinkSent: 'Новая ссылка подтверждения отправлена на ваш email.',
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('menu-language');
            return (saved as Language) || 'uz';
        }
        return 'uz';
    });

    useEffect(() => {
        localStorage.setItem('menu-language', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
