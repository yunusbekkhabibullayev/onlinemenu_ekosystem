export interface User {
    id: number;
    name: string;
    username?: string | null;
    email: string;
    email_verified_at?: string;
    avatar?: string | null;
    role: 'admin' | 'waiter' | 'kitchen' | 'cashier' | 'user';
    employee_code?: string;
    is_active?: boolean;
}

export interface Restaurant {
    id: number;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    working_hours?: string;
    logo?: string;
    location_url?: string;
    instagram?: string;
    telegram?: string;
    delivery_price: number;
    is_active: boolean;
}

export interface Category {
    id: number;
    restaurant_id: number;
    name: string;
    slug?: string;
    order: number;
    is_active: boolean;
}

export interface FoodItem {
    id: number;
    category_id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
    is_available: boolean;
    order: number;
}

export interface CartItem extends FoodItem {
    quantity: number;
}

export interface Table {
    id: number;
    restaurant_id: number;
    number: string;
    name?: string | null;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'cleaning';
    is_active: boolean;
}

export interface OrderSession {
    id: number;
    table_id: number;
    waiter_id?: number | null;
    status: 'active' | 'closed' | 'paid';
    started_at: string;
    closed_at?: string | null;
    total_amount: number;
    paid_amount: number;
}

export interface Payment {
    id: number;
    order_id?: number | null;
    order_session_id?: number | null;
    amount: number;
    payment_method: 'cash' | 'card' | 'online';
    status: 'pending' | 'completed' | 'refunded';
    processed_by?: number | null;
    notes?: string | null;
    created_at?: string;
}

export interface Order {
    id: number;
    restaurant_id: number;
    table_id?: number | null;
    order_session_id?: number | null;
    waiter_id?: number | null;
    order_number: string;
    phone: string;
    customer_name?: string | null;
    total_amount: number;
    delivery_price: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'paid' | 'cancelled';
    payment_status: 'unpaid' | 'partial' | 'paid';
    payment_method?: 'cash' | 'card' | 'online' | null;
    paid_at?: string | null;
    ready_at?: string | null;
    delivered_at?: string | null;
    is_additional: boolean;
    parent_order_id?: number | null;
    notes?: string | null;
    telegram_message_id?: string | null;
    created_at?: string;
    updated_at?: string;
    table?: Table | null;
    waiter?: User | null;
    orderSession?: OrderSession | null;
    payments?: Payment[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    food_item_id: number;
    quantity: number;
    price: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
