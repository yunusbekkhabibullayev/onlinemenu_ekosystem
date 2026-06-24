import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Brain, TrendingUp, Users, ShoppingBag, Loader2, Sparkles, 
    AlertCircle, BarChart3, PieChart, Calendar, ArrowUpRight, 
    Target, Zap, AlertTriangle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import axios from 'axios';
import { cn } from '@/lib/utils';

interface MenuEntry {
    id: number;
    name: string;
    sales_count: number;
    revenue: number;
    label: 'Star' | 'Plowhorse' | 'Puzzle' | 'Dog';
}

interface Stats {
    total_orders: number;
    completed_orders: number;
    total_revenue: number;
    avg_order_value: number;
}

interface Props {
    menuEngineering: MenuEntry[];
    forecasting: Record<string, number>;
    stats: Stats;
    topSelling: any[];
}

export default function AIAnalytics({ menuEngineering, forecasting, stats, topSelling }: Props) {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(route('admin.ai-analytics.analyze'), {
                data: {
                    menuEngineering,
                    stats,
                    forecasting
                }
            });
            
            if (response.data.choices && response.data.choices[0].message.content) {
                setAnalysis(response.data.choices[0].message.content);
            } else {
                setError("AI javob bera olmadi. API kalitini tekshiring.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Analiz jarayonida xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

    const getLabelInfo = (label: string) => {
        switch (label) {
            case 'Star': return { color: 'text-green-600 bg-green-50 border-green-100', icon: StarIcon, desc: 'Ommabop va foydali' };
            case 'Plowhorse': return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Zap, desc: 'Ommabop, lekin past foyda' };
            case 'Puzzle': return { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Target, desc: 'Kam sotiladi, lekin foydali' };
            case 'Dog': return { color: 'text-red-600 bg-red-50 border-red-100', icon: AlertTriangle, desc: 'Past talab va foyda' };
            default: return { color: 'text-gray-600 bg-gray-50 border-gray-100', icon: BarChart3, desc: '' };
        }
    };

    const StarIcon = () => <Sparkles className="w-4 h-4" />;
    const dayNames = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

    return (
        <AdminLayout>
            <Head title="AI Analitika & Bashorat" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/30">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold font-display tracking-tight text-white">Advanced AI Intelligence</h1>
                        </div>
                        <p className="text-slate-400 max-w-lg text-lg leading-relaxed">
                            Menu Engineering va Sotuv bashorati yordamida biznesingizni yangi bosqichga olib chiqing.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <Button 
                            onClick={runAnalysis} 
                            disabled={loading}
                            size="lg"
                            className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-10 py-7 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-lg"
                        >
                            {loading ? (
                                <><Loader2 className="w-6 h-6 mr-3 animate-spin" />Tahlil qilinmoqda...</>
                            ) : (
                                <><Zap className="w-6 h-6 mr-3 text-indigo-500 fill-indigo-500" />Tahlilni yangilash</>
                            )}
                        </Button>
                    </div>
                    {/* Decorative lights */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full -mr-64 -mt-64 blur-[100px]" />
                </div>

                <Tabs defaultValue="engineering" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1 bg-muted/50 rounded-2xl mb-8">
                        <TabsTrigger value="engineering" className="rounded-xl py-3 text-sm font-semibold">
                            <Target className="w-4 h-4 mr-2" /> Menu Engineering
                        </TabsTrigger>
                        <TabsTrigger value="forecasting" className="rounded-xl py-3 text-sm font-semibold">
                            <Calendar className="w-4 h-4 mr-2" /> Sotuv Bashorati
                        </TabsTrigger>
                        <TabsTrigger value="top" className="rounded-xl py-3 text-sm font-semibold">
                            <BarChart3 className="w-4 h-4 mr-2" /> Top Sotuvlar
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="engineering" className="mt-0 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {['Star', 'Plowhorse', 'Puzzle', 'Dog'].map((label) => {
                                const count = menuEngineering.filter(i => i.label === label).length;
                                const info = getLabelInfo(label);
                                return (
                                    <div key={label} className={cn("p-6 rounded-3xl border transition-all h-full flex flex-col justify-between", info.color)}>
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                                                    <info.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-2xl font-black">{count}</span>
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">{label}s</h3>
                                            <p className="text-xs opacity-70 leading-relaxed font-medium">{info.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/30 text-xs font-bold uppercase text-muted-foreground border-b">
                                        <tr>
                                            <th className="px-8 py-5">Mahsulot</th>
                                            <th className="px-8 py-5 text-center">Sotuv</th>
                                            <th className="px-8 py-5 text-right">Tushum</th>
                                            <th className="px-8 py-5 text-right font-bold uppercase tracking-wider">Toifa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {menuEngineering.map((item) => {
                                            const info = getLabelInfo(item.label);
                                            return (
                                                <tr key={item.id} className="hover:bg-muted/20 transition-all group">
                                                    <td className="px-8 py-5 font-bold text-slate-800">{item.name || 'Noma\'lum'}</td>
                                                    <td className="px-8 py-5 text-center font-medium text-slate-600">{item.sales_count}</td>
                                                    <td className="px-8 py-5 text-right font-medium text-slate-600">
                                                        {new Intl.NumberFormat('uz-UZ').format(item.revenue)} so'm
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <span className={cn("inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", info.color)}>
                                                            <info.icon className="w-3 h-3 mr-1.5" />
                                                            {item.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="forecasting" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                            {dayNames.map((day, idx) => {
                                const count = forecasting[idx] || 0;
                                const max = Math.max(...Object.values(forecasting), 1);
                                const percent = (count / max) * 100;
                                return (
                                    <div key={day} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-end h-64 gap-6 hover:border-indigo-200 transition-colors group">
                                        <div className="w-full bg-slate-100 rounded-full h-full relative overflow-hidden flex items-end">
                                            <div 
                                                className="w-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-600" 
                                                style={{ height: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-black mb-1">{count}</div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">{day}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">Haftalik sotuv trendlari</h4>
                                <p className="text-slate-500 text-sm font-medium">Oxirgi 14 kunlik ma'lumotlar asosida eng faol kunlarni ko'rishingiz mumkin.</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="top" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topSelling.map((item: any, idx: number) => (
                                <div key={item.food_item_id} className="bg-card p-8 rounded-[2rem] border border-border shadow-soft hover:shadow-elevated transition-all relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <div className="text-slate-300 text-6xl font-black absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">#{idx + 1}</div>
                                        <h3 className="font-black text-2xl text-slate-800 mb-4 pr-12 line-clamp-1">{item.foodItem?.name || 'Noma\'lum'}</h3>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Jami sotilgan</div>
                                                <div className="text-3xl font-black text-indigo-600">{item.sales_count} <span className="text-sm font-medium text-slate-400">dona</span></div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Tushum</div>
                                                <div className="text-xl font-bold text-slate-800">{new Intl.NumberFormat('uz-UZ').format(item.revenue)} <span className="text-xs text-slate-400">so'm</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* AI Analysis Overlay */}
                {analysis && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl ring-1 ring-white/10">
                            <div className="bg-slate-800/50 backdrop-blur-xl px-10 py-6 border-b border-white/5 flex items-center justify-between rounded-t-[2.4rem]">
                                <div className="flex items-center gap-3 text-indigo-400 font-black tracking-widest uppercase text-xs">
                                    <Brain className="w-5 h-5" />
                                    AI Strategy & Recommendations
                                </div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Llama 3.3 (70B)</div>
                            </div>
                            <div className="p-10 text-white">
                                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-300 font-medium font-sans">
                                    {analysis}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
