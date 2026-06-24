import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Minus, Plus, Search, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import MenuLayout from '@/Layouts/MenuLayout';
import UpsellModal from '@/Components/UpsellModal';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useCart } from '@/Contexts/CartContext';
import { Restaurant, Category, FoodItem } from '@/types';

interface Props {
    restaurant: Restaurant | null;
    categories: Category[];
    foodItems: FoodItem[];
    selectedCategory: string | null;
}

export default function Menu({ restaurant, categories, foodItems, selectedCategory }: Props) {
    const { t } = useLanguage();
    const { addItem, updateQuantity, getItemQuantity } = useCart();
    const [activeCategory, setActiveCategory] = useState<number | null>(
        selectedCategory ? parseInt(selectedCategory) : null
    );
    const [upsellItem, setUpsellItem] = useState<FoodItem | null>(null);
    const [isUpsellOpen, setIsUpsellOpen] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    // Hostingda category_id va cat.id turi farq qilishi mumkin (string vs number) — Number() bilan taqqoslash
    const sameCategory = (catId: number, itemCatId: number) => Number(catId) === Number(itemCatId);

    // Filter by category
    const filteredItems = activeCategory
        ? foodItems.filter(item => sameCategory(activeCategory, item.category_id))
        : foodItems;

    // Group items by category when showing all
    let groupedItems: Record<string, FoodItem[]> = activeCategory
        ? { [String(activeCategory)]: filteredItems }
        : categories.reduce((acc, cat) => {
            const items = foodItems.filter(f => sameCategory(cat.id, f.category_id));
            if (items.length > 0) {
                acc[String(cat.id)] = items;
            }
            return acc;
        }, {} as Record<string, FoodItem[]>);

    // Hostingda category_id mos kelmasa — barcha taomlarni bitta guruhda ko'rsatish
    if (Object.keys(groupedItems).length === 0 && filteredItems.length > 0) {
        groupedItems = { all: filteredItems };
    }

    return (
        <MenuLayout>
            <Head title={t('menu')} />

            {/* Category Navigation - Mobile/Tablet horizontal scroll */}
            <div className="lg:hidden sticky top-14 z-30 bg-card border-b border-border/50">
                <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                            !activeCategory
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                    >
                        <UtensilsCrossed className="w-4 h-4" />
                        {t('allItems')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                activeCategory === cat.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-muted text-foreground hover:bg-muted/80'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:flex">
                {/* Desktop Sidebar Categories */}
                <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-r border-border bg-card">
                    <div className="p-4 xl:p-6">
                        <h3 className="font-semibold text-base xl:text-lg text-muted-foreground mb-4 xl:mb-5 px-2">
                            {t('categories')}
                        </h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`w-full flex items-center justify-between px-4 xl:px-5 py-3 xl:py-4 rounded-xl xl:rounded-2xl text-sm xl:text-base font-medium transition-all duration-200 ${
                                    !activeCategory
                                        ? 'bg-primary text-white shadow-md'
                                        : 'hover:bg-muted text-foreground'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <UtensilsCrossed className="w-4 h-4 xl:w-5 xl:h-5" />
                                    <span>{t('allItems')}</span>
                                </div>
                                <span className={`text-xs xl:text-sm ${!activeCategory ? 'opacity-90' : 'opacity-60'}`}>
                                    {foodItems.length}
                                </span>
                            </button>
                            {categories.map((cat) => {
                                const count = foodItems.filter(f => sameCategory(cat.id, f.category_id)).length;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`w-full flex items-center justify-between px-4 xl:px-5 py-3 xl:py-4 rounded-xl xl:rounded-2xl text-sm xl:text-base font-medium transition-all duration-200 ${
                                            activeCategory === cat.id
                                                ? 'bg-primary text-white shadow-md'
                                                : 'hover:bg-muted text-foreground'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className={`text-xs xl:text-sm ${activeCategory === cat.id ? 'opacity-90' : 'opacity-60'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Food Grid */}
                <main className="flex-1 pb-24 lg:pb-8 xl:pb-12 px-4 sm:px-6 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-6 xl:py-8">
                    <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
                        {Object.entries(groupedItems).map(([categoryId, items]) => {
                            const category = categoryId === 'all' ? null : categories.find(c => Number(c.id) === Number(categoryId));
                            return (
                                <div key={categoryId} id={`category-${categoryId}`}>
                                    {!activeCategory && (
                                        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 lg:mb-6 text-foreground">
                                            {category ? category.name : t('allItems')}
                                        </h2>
                                    )}

                                    {/* Grid: 1col up to 1460px, 2col 1460-1944px, 3col 1945px+ */}
                                    <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 min-[1460px]:grid-cols-2 min-[1945px]:grid-cols-3">
                                        {items.map((food, index) => {
                                            const quantity = getItemQuantity(food.id);
                                            return (
                                                <div
                                                    key={food.id}
                                                    className="bg-card rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden border border-border animate-fade-in"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 lg:p-6">
                                                        {/* Image */}
                                                        <div className="relative w-full sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-[140px] xl:h-[140px] shrink-0 sm:shrink-0">
                                                            {food.image ? (
                                                                <img
                                                                    src={`/storage/${food.image}`}
                                                                    alt={food.name}
                                                                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-muted rounded-xl sm:rounded-2xl flex items-center justify-center">
                                                                    <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground/40" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                            <div>
                                                                <h3 className="font-bold text-lg sm:text-xl lg:text-xl leading-tight mb-1.5 sm:mb-2 line-clamp-2 text-foreground">
                                                                    {food.name}
                                                                </h3>
                                                                {food.description && (
                                                                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
                                                                        {food.description}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center justify-between gap-3 sm:gap-4">
                                                                <span className="text-primary font-bold text-lg sm:text-xl lg:text-xl whitespace-nowrap">
                                                                    {formatPrice(food.price)} {t('currency')}
                                                                </span>

                                                                {quantity === 0 ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            addItem(food);
                                                                            toast.success('Savatga qo\'shildi', {
                                                                                description: food.name,
                                                                            });
                                                                            // AI o'zi mantiqiy tavsiya bor-yo'qligini hal qiladi
                                                                            setUpsellItem(food);
                                                                            setIsUpsellOpen(true);
                                                                        }}
                                                                        className="px-4 sm:px-5 lg:px-6 xl:px-8 py-2 sm:py-2.5 lg:py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                                                                    >
                                                                        {t('order')}
                                                                    </button>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 sm:gap-3 bg-muted rounded-full p-1 sm:p-1.5">
                                                                        <button
                                                                            onClick={() => updateQuantity(food.id, quantity - 1)}
                                                                            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-card hover:bg-muted transition-colors shadow-card"
                                                                        >
                                                                            <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                                                                        </button>
                                                                        <span className="text-base sm:text-lg font-bold min-w-[2rem] text-center text-foreground">
                                                                            {quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => updateQuantity(food.id, quantity + 1)}
                                                                            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                                                                        >
                                                                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredItems.length === 0 && (
                            <div className="text-center py-16 sm:py-20 lg:py-24 text-muted-foreground">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-muted-foreground/60" />
                                </div>
                                <p className="font-semibold text-lg sm:text-xl lg:text-2xl text-foreground">{t('noResults')}</p>
                                <p className="text-sm sm:text-base lg:text-lg mt-2 text-muted-foreground">{t('tryDifferentSearch')}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <UpsellModal 
                isOpen={isUpsellOpen} 
                onClose={() => setIsUpsellOpen(false)} 
                baseItem={upsellItem} 
            />
        </MenuLayout>
    );
}
