import { Badge } from '@/Components/ui/badge';

interface StatusBadgeProps {
    status: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
    pending: { label: 'Kutilmoqda', variant: 'warning' },
    confirmed: { label: 'Tasdiqlangan', variant: 'default' },
    preparing: { label: 'Tayyorlanmoqda', variant: 'secondary' },
    delivered: { label: 'Yetkazildi', variant: 'success' },
    cancelled: { label: 'Bekor qilindi', variant: 'destructive' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
}
