import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { FoodItem, CartItem } from '@/types';

interface CartContextType {
    items: CartItem[];
    addItem: (item: FoodItem) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    getItemQuantity: (itemId: number) => number;
}

const CART_STORAGE_KEY = 'restaurant-cart';

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load cart from localStorage on initial render
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(CART_STORAGE_KEY);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.error('Failed to load cart from localStorage:', e);
            }
        }
        return [];
    });

    // Save cart to localStorage whenever items change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } catch (e) {
                console.error('Failed to save cart to localStorage:', e);
            }
        }
    }, [items]);

    const addItem = useCallback((item: FoodItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((itemId: number) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.id !== itemId));
        } else {
            setItems(prev =>
                prev.map(i => i.id === itemId ? { ...i, quantity } : i)
            );
        }
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getItemQuantity = useCallback((itemId: number) => {
        return items.find(i => i.id === itemId)?.quantity || 0;
    }, [items]);

    const totalItems = useMemo(() =>
        items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const totalPrice = useMemo(() =>
        items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [items]
    );

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            getItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
