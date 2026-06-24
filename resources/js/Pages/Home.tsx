import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Clock, ExternalLink, Phone, Instagram, Send, UtensilsCrossed, Store, Truck } from 'lucide-react';
import MenuLayout from '@/Layouts/MenuLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useAddress } from '@/Contexts/AddressContext';
import { Restaurant, FoodItem } from '@/types';

interface Props {
    restaurant: Restaurant | null;
    featuredItems: FoodItem[];
}

export default function Home({ restaurant, featuredItems }: Props) {
    const { t } = useLanguage();
    const { address, isAddressConfirmed, openAddressForm } = useAddress();
    /** Rasm yuklanmagan (404 yoki xato) mahsulot id lari — placeholder ko‘rsatiladi */
    const [failedImageIds, setFailedImageIds] = useState<Set<number>>(new Set());
    /** Restoran logosi yuklanmagan bo‘lsa true */
    const [restaurantLogoFailed, setRestaurantLogoFailed] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const handleAddressClick = () => {
        if (restaurant?.location_url) {
            window.open(restaurant.location_url, '_blank');
        } else if (restaurant?.address) {
            const encodedAddress = encodeURIComponent(restaurant.address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
        }
    };

    return (
        <MenuLayout>
            <Head title={t('home')} />

            <main className="pb-24 lg:pb-8">
                {/* Manzilni qo'shing banner — user skip qilganda */}
                {isAddressConfirmed && !address?.street && (
                    <div className="sticky top-14 z-30 py-3 bg-background/95 backdrop-blur-md border-b border-border shadow-sm px-4 sm:px-6 lg:px-8 -mt-1 mb-4">
                        <div className="max-w-7xl mx-auto">
                            <button
                                onClick={openAddressForm}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-medium text-sm hover:bg-primary/15 transition-colors shadow-sm"
                            >
                                <MapPin className="w-5 h-5 shrink-0" />
                                Manzilni qo'shing — yetkazib berish uchun
                            </button>
                        </div>
                    </div>
                )}

                {/* Promo banners — Uzum Tezkor uslubida */}
                <section className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                    <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-white">
                            <div className="flex items-center gap-2 mb-1">
                                <Truck className="w-5 h-5" />
                                <span className="font-semibold text-sm">Bepul yetkazish</span>
                            </div>
                            <p className="text-sm opacity-90">Birinchi buyurtmalaringizni tez yetkazib beramiz</p>
                        </div>
                        <div className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white">
                            <div className="flex items-center gap-2 mb-1">
                                <UtensilsCrossed className="w-5 h-5" />
                                <span className="font-semibold text-sm">Mazali taomlar</span>
                            </div>
                            <p className="text-sm opacity-90">Har doim yangi va sifatli mahsulotlar</p>
                        </div>
                    </div>
                </section>

                {/* Hero Section - Restaurant Info */}
                <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 xl:py-16">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16 gap-6">

                            {/* Left block: Logo + Info (one row) */}
                            <div className="flex-1 flex items-start gap-4 sm:gap-6">
                                {/* Logo — yuklanmasa Store ikonkasi */}
                                {(restaurant?.logo && !restaurantLogoFailed) ? (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-2xl xl:rounded-3xl overflow-hidden shadow-xl border-2 border-white/80 shrink-0">
                                        <img
                                            src={`/storage/${restaurant.logo}`}
                                            alt={restaurant?.name || 'Logo'}
                                            className="w-full h-full object-cover"
                                            onError={() => setRestaurantLogoFailed(true)}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-2xl xl:rounded-3xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Store className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-primary" />
                                    </div>
                                )}

                                {/* Title + Description + Hours + Buttons */}
                                <div className="flex-1 min-w-0">
                                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-1 sm:mb-2">
                                        {restaurant?.name || t('restaurant')}
                                    </h1>
                                    {restaurant?.description && (
                                        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-3">
                                            {restaurant.description}
                                        </p>
                                    )}
                                    {restaurant?.working_hours && (
                                        <div className="flex items-center gap-2 text-foreground mb-3">
                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                                            <span className="text-sm sm:text-base font-medium">{restaurant.working_hours}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {restaurant?.phone && (
                                            <a
                                                href={`tel:${restaurant.phone}`}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                                            >
                                                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                                            </a>
                                        )}
                                        {restaurant?.instagram && (
                                            <a
                                                href={restaurant.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white transition-all hover:scale-105 shadow-md"
                                            >
                                                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </a>
                                        )}
                                        {restaurant?.telegram && (
                                            <a
                                                href={restaurant.telegram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0088cc] flex items-center justify-center text-white transition-all hover:scale-105 shadow-md"
                                            >
                                                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right block: Address Card */}
                            {restaurant?.address && (
                                <div
                                    onClick={handleAddressClick}
                                    className="lg:w-72 xl:w-80 bg-card rounded-2xl p-4 sm:p-5 shadow-card border border-border cursor-pointer hover:shadow-elevated transition-all group"
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl shrink-0">
                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">{t('address')}</p>
                                            <p className="text-sm sm:text-base font-medium text-foreground leading-snug">
                                                {restaurant.address}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Featured Section - Tavsiya etilgan */}
                {featuredItems.length > 0 && (
                        <section className="bg-card px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-6 sm:mb-8 lg:mb-12">
                                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
                                    {t('featured') || 'Tavsiya etilgan'}
                                </h2>
                            </div>

                            {/* Responsive Grid: 2 columns mobile, 3 tablet, 4 desktop */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
                                {featuredItems.map((item, index) => (
                                    <Link
                                        key={item.id}
                                        href={`/menu?category=${item.category_id}`}
                                        className="group group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in border border-border"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="aspect-square relative overflow-hidden">
                                            {item.image && !failedImageIds.has(item.id) ? (
                                                <img
                                                    src={`/storage/${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                    onError={() => setFailedImageIds((prev) => new Set(prev).add(item.id))}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <UtensilsCrossed className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-muted-foreground/60" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                        </div>
                                        <div className="p-4 sm:p-5 lg:p-6">
                                            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                                                {formatPrice(item.price)} {t('currency')}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </MenuLayout>
    );
}
