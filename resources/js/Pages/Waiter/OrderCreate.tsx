import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart, User, Save, Search, X } from 'lucide-react';
import WaiterLayout from '@/Layouts/WaiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';

interface FoodItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    is_available: boolean;
}

interface Category {
    id: number;
    name: string;
    foodItems: FoodItem[];
}

interface Table {
    id: number;
    number: string;
    name: string | null;
    capacity: number;
    status: string;
}

interface OrderSession {
    id: number;
    table_id: number;
    status: string;
}

interface Props {
    table: Table;
    categories?: Category[];
    activeSession?: OrderSession | null;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export default function OrderCreate({ table, categories = [], activeSession }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<number | null>(
        categories && categories.length > 0 ? categories[0].id : null
    );

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        items: [] as Array<{ id: number; quantity: number }>,
        notes: '',
        is_additional: !!activeSession,
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const addToCart = (item: FoodItem) => {
        if (!item.is_available) {
            toast.error('Bu taom hozir mavjud emas');
            return;
        }

        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
        });
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            setCart((prev) => prev.filter((i) => i.id !== itemId));
        } else {
            setCart((prev) =>
                prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
            );
        }
    };

    const getCartItemQuantity = (itemId: number) => {
        return cart.find((i) => i.id === itemId)?.quantity || 0;
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error('Kamida bitta taom tanlang');
            return;
        }

        setData({
            ...data,
            items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        });

        post(`/waiter/tables/${table.id}/orders`, {
            onSuccess: () => {
                toast.success('Buyurtma yaratildi!');
                router.visit('/waiter/orders/active');
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    if (typeof error === 'string') {
                        toast.error(error);
                    }
                });
            },
        });
    };

    // Filter categories with active food items only
    // Backend already filters by is_available, but we double-check here
    const filteredCategories = (categories || []).map((cat) => ({
        ...cat,
        foodItems: (cat.foodItems || []).filter((item: FoodItem) => item.is_available === true),
    })).filter((cat) => cat.foodItems && cat.foodItems.length > 0);

    // Get all active food items
    const getAllActiveFoodItems = (): FoodItem[] => {
        const allItems: FoodItem[] = [];
        filteredCategories.forEach((cat) => {
            if (cat.foodItems) {
                // Double check: only add items that are available
                cat.foodItems.forEach((item: FoodItem) => {
                    if (item.is_available) {
                        allItems.push(item);
                    }
                });
            }
        });
        return allItems;
    };

    // Search filter - only search in active items
    const getFilteredFoodItems = (): FoodItem[] => {
        const allItems = getAllActiveFoodItems();

        if (!searchQuery || searchQuery.trim() === '') {
            return allItems;
        }

        const query = searchQuery.toLowerCase().trim();
        return allItems.filter(
            (item) =>
                item.name.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query) ||
                item.name.toLowerCase().startsWith(query)
        );
    };

    const searchFilteredItems = getFilteredFoodItems();

    // Get category items - only active
    const getCategoryItems = (): FoodItem[] => {
        const categoriesToShow = activeCategory === null
            ? filteredCategories
            : filteredCategories.filter((cat) => cat.id === activeCategory);
        
        const allItems: FoodItem[] = [];
        categoriesToShow.forEach((category) => {
            category.foodItems
                .filter((item: FoodItem) => item.is_available === true)
                .forEach((item: FoodItem) => {
                    allItems.push(item);
                });
        });
        return allItems;
    };

    const categoryItems = getCategoryItems();

    return (
        <WaiterLayout title={`Buyurtma yaratish - Stol #${table.number}`}>
            <Head title={`Buyurtma - Stol #${table.number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.visit('/waiter/tables')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Orqaga
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Stol #{table.number}
                            </h2>
                            {table.name && (
                                <p className="text-gray-600">{table.name}</p>
                            )}
                            {activeSession && (
                                <Badge variant="secondary" className="mt-2">
                                    Qo'shimcha buyurtma
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Menu */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Taom qidirish..."
                                        className="pl-12 pr-12"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full"
                                        >
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Name - Optional */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Mijoz ma'lumotlari (ixtiyoriy)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="customer_name">Mijoz ismi</Label>
                                        <Input
                                            id="customer_name"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            placeholder="Mijoz ismini kiriting (ixtiyoriy)"
                                        />
                                        {errors.customer_name && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.customer_name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Categories */}
                        {!searchQuery && (
                            <div className="space-y-4">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    <Button
                                        type="button"
                                        variant={activeCategory === null ? 'default' : 'outline'}
                                        onClick={() => setActiveCategory(null)}
                                        className="whitespace-nowrap"
                                    >
                                        Barcha taomlar
                                    </Button>
                                    {filteredCategories.map((category) => (
                                        <Button
                                            key={category.id}
                                            type="button"
                                            variant={activeCategory === category.id ? 'default' : 'outline'}
                                            onClick={() => setActiveCategory(category.id)}
                                            className="whitespace-nowrap"
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Food Items */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {searchQuery && searchQuery.trim() ? (
                                // Show search results
                                searchFilteredItems.length > 0 ? (
                                    <>
                                        <div className="col-span-2 mb-2">
                                            <p className="text-sm text-muted-foreground">
                                                {searchFilteredItems.length} ta taom topildi
                                            </p>
                                        </div>
                                        {searchFilteredItems.map((item) => (
                                            <Card key={item.id} className="relative">
                                                <CardContent className="p-4">
                                                    <div className="flex gap-4">
                                                        {item.image && (
                                                            <img
                                                                src={`/storage/${item.image}`}
                                                                alt={item.name}
                                                                className="w-20 h-20 rounded-lg object-cover"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg">
                                                                {item.name}
                                                            </h3>
                                                            {item.description && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center justify-between mt-3">
                                                                <span className="font-bold text-primary">
                                                                    {formatPrice(item.price)} UZS
                                                                </span>
                                                                {item.is_available && (
                                                                    <div className="flex items-center gap-2">
                                                                        {getCartItemQuantity(item.id) > 0 && (
                                                                            <>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        updateQuantity(
                                                                                            item.id,
                                                                                            getCartItemQuantity(item.id) - 1
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Minus className="w-4 h-4" />
                                                                                </Button>
                                                                                <span className="w-8 text-center font-semibold">
                                                                                    {getCartItemQuantity(item.id)}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                        <Button
                                                                            type="button"
                                                                            variant="default"
                                                                            size="sm"
                                                                            onClick={() => addToCart(item)}
                                                                        >
                                                                            {getCartItemQuantity(item.id) > 0 ? (
                                                                                <Plus className="w-4 h-4" />
                                                                            ) : (
                                                                                'Qo\'shish'
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </>
                                ) : (
                                    <div className="col-span-2 text-center py-12 text-gray-500">
                                        <p className="text-lg font-medium mb-2">Hech narsa topilmadi</p>
                                        <p className="text-sm">Boshqa so'z bilan qidiring</p>
                                    </div>
                                )
                            ) : (
                                // Show by category - only active items
                                categoryItems.length > 0 ? (
                                    categoryItems.map((item) => (
                                        <Card key={item.id} className="relative">
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    {item.image && (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.name}
                                                            className="w-20 h-20 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg">
                                                            {item.name}
                                                        </h3>
                                                        {item.description && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-between mt-3">
                                                            <span className="font-bold text-primary">
                                                                {formatPrice(item.price)} UZS
                                                            </span>
                                                            {item.is_available && (
                                                                <div className="flex items-center gap-2">
                                                                    {getCartItemQuantity(item.id) > 0 && (
                                                                        <>
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    updateQuantity(
                                                                                        item.id,
                                                                                        getCartItemQuantity(item.id) - 1
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Minus className="w-4 h-4" />
                                                                            </Button>
                                                                            <span className="w-8 text-center font-semibold">
                                                                                {getCartItemQuantity(item.id)}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                    <Button
                                                                        type="button"
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => addToCart(item)}
                                                                    >
                                                                        {getCartItemQuantity(item.id) > 0 ? (
                                                                            <Plus className="w-4 h-4" />
                                                                        ) : (
                                                                            'Qo\'shish'
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-12 text-gray-500">
                                        <p>Bu kategoriyada taomlar topilmadi</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Right: Cart */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Savat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        Savat bo'sh
                                    </p>
                                ) : (
                                    <>
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {cart.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatPrice(item.price)} x {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity - 1)
                                                            }
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="w-8 text-center font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity + 1)
                                                            }
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t pt-4 space-y-4">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Jami:</span>
                                                <span>{formatPrice(totalPrice)} UZS</span>
                                            </div>

                                            <div>
                                                <Label htmlFor="notes">Eslatma (ixtiyoriy)</Label>
                                                <Textarea
                                                    id="notes"
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    placeholder="Qo'shimcha eslatmalar..."
                                                    rows={3}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                size="lg"
                                                disabled={processing}
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                {activeSession ? 'Qo\'shimcha buyurtma qo\'shish' : 'Buyurtma yaratish'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </WaiterLayout>
    );
}
