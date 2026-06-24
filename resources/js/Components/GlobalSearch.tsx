import { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { Search, X, Loader2, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useCart } from '@/Contexts/CartContext';
import { toast } from 'sonner';
import { FoodItem as FoodItemType } from '@/types';

interface SearchFoodItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category: {
        id: number;
        name: string;
    } | null;
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const { t } = useLanguage();
    const { addItem } = useCart();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchFoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Search with debounce
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.results || []);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleClose = () => {
        setQuery('');
        setResults([]);
        onClose();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const handleAddToCart = (food: SearchFoodItem) => {
        // Convert to CartContext FoodItem format
        const foodItem: FoodItemType = {
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image || undefined,
            category_id: food.category?.id || 0,
            is_available: true,
            order: 0,
        };
        addItem(foodItem);
        toast.success('Savatga qo\'shildi', {
            description: food.name,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Search Modal */}
            <div className="relative max-w-2xl mx-auto mt-[10vh] px-4">
                <div className="bg-card rounded-2xl shadow-elevated overflow-hidden animate-scale-in">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('searchPlaceholder') || "Taom qidirish..."}
                            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                        />
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        ) : query && (
                            <button
                                onClick={() => setQuery('')}
                                className="p-1 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {query.length < 2 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Qidirish uchun kamida 2 ta belgi kiriting</p>
                            </div>
                        ) : isLoading ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                <p className="text-sm">Qidirilmoqda...</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p className="font-medium">{t('noResults') || "Hech narsa topilmadi"}</p>
                                <p className="text-sm mt-1">{t('tryDifferentSearch') || "Boshqa so'z bilan qidiring"}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {results.map((food) => (
                                    <div
                                        key={food.id}
                                        className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors"
                                    >
                                        {/* Image */}
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                                            {food.image ? (
                                                <img
                                                    src={`/storage/${food.image}`}
                                                    alt={food.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl">🍽️</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium truncate">{food.name}</h4>
                                            {food.category && (
                                                <p className="text-xs text-muted-foreground">
                                                    {food.category.name}
                                                </p>
                                            )}
                                            <p className="text-sm font-bold text-primary mt-0.5">
                                                {formatPrice(food.price)} UZS
                                            </p>
                                        </div>

                                        {/* Add to cart */}
                                        <button
                                            onClick={() => handleAddToCart(food)}
                                            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors shrink-0"
                                        >
                                            {t('order') || '+'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {results.length > 0 && (
                        <div className="p-3 border-t border-border bg-secondary/30">
                            <Link
                                href={`/menu?search=${encodeURIComponent(query)}`}
                                onClick={handleClose}
                                className="block text-center text-sm text-primary font-medium hover:underline"
                            >
                                Barcha natijalarni ko'rish ({results.length})
                            </Link>
                        </div>
                    )}
                </div>

                {/* Keyboard hint */}
                <p className="text-center text-white/60 text-xs mt-4">
                    Yopish uchun <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> bosing
                </p>
            </div>
        </div>
    );
}
