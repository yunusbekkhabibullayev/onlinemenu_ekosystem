import { Link } from '@inertiajs/react';
import KitchenDashboard from './Dashboard';
import { cn } from '@/lib/utils';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: any[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    orders: PaginatedOrders;
}

export default function OrderQueue({ orders }: Props) {
    const groupedOrders = {
        pending: orders.data.filter((o) => o.status === 'pending'),
        confirmed: orders.data.filter((o) => o.status === 'confirmed'),
        preparing: orders.data.filter((o) => o.status === 'preparing'),
        ready: orders.data.filter((o) => o.status === 'ready'),
    };

    return (
        <div>
            <KitchenDashboard
                pendingOrders={groupedOrders.pending}
                confirmedOrders={groupedOrders.confirmed}
                preparingOrders={groupedOrders.preparing}
                readyOrders={groupedOrders.ready}
            />

            {orders.last_page > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    {orders.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={cn(
                                'inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-md border text-sm font-medium transition-colors',
                                link.active
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
                                !link.url && 'opacity-40 pointer-events-none'
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
