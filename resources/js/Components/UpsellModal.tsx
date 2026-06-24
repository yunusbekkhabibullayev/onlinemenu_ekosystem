import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { FoodItem } from '@/types';
import { useCart } from '@/Contexts/CartContext';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Plus, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    baseItem: FoodItem | null;
}

export default function UpsellModal({ isOpen, onClose, baseItem }: Props) {
    const [recommendations, setRecommendations] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { addItem } = useCart();
    const { t } = useLanguage();

    useEffect(() => {
        if (isOpen && baseItem) {
            fetchRecommendations();
        }
    }, [isOpen, baseItem]);

    const fetchRecommendations = async () => {
        if (!baseItem) return;
        setLoading(true);
        try {
            const response = await axios.get(route('api.recommendations', baseItem.id));
            if (response.data.length === 0) {
                onClose(); // Mos tavsiya topilmasa, modal yopiladi
                return;
            }
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecommend = (food: FoodItem) => {
        addItem(food);
        toast.success(t('addedToCart') || 'Savatga qo\'shildi', {
            description: food.name
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    if (!baseItem) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6">
                    <div className="flex items-center gap-2 text-primary font-bold mb-4">
                        <Sparkles className="w-5 h-5 fill-primary/20" />
                        <span className="text-sm uppercase tracking-wider">AI Tavsiya etadi</span>
                    </div>
                    
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-slate-800 leading-tight">
                            Buni ham sinab ko'rishni <br/>xohlaysizmi?
                        </DialogTitle>
                        <p className="text-muted-foreground text-sm font-medium mt-2">
                             "{baseItem.name}" bilan birga juda mazali bo'ladi!
                        </p>
                    </DialogHeader>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center py-12 gap-4">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Siz uchun tanlanmoqda...</span>
                            </div>
                        ) : (
                            recommendations.map((food) => (
                                <div 
                                    key={food.id} 
                                    className="bg-white rounded-2xl p-3 flex items-center gap-4 border border-border shadow-sm hover:border-primary/30 transition-all group"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                        <img 
                                            src={food.image ? `/storage/${food.image}` : '/images/placeholder.png'} 
                                            alt={food.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-800 text-sm truncate">{food.name}</h4>
                                        <p className="text-primary font-black text-base">{formatPrice(food.price)} {t('currency')}</p>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        onClick={() => handleAddRecommend(food)}
                                        className="rounded-full w-10 h-10 p-0 shadow-lg shadow-primary/20"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="w-full py-6 rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted text-muted-foreground"
                        >
                            Rahmat, shart emas
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
