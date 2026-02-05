import React, { useState } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Percent, Ticket, RefreshCw, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AdminService } from '../services/api';

const Admin: React.FC = () => {
    const { stats, refreshStats } = useStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setMessage(null);
        try {
            const result = await AdminService.generateCode();
            setMessage({ type: 'success', text: `Code generated: ${result.code}` });
            await refreshStats();
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || "Condition not satisfied for generation."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (!stats) return (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <RefreshCw className="animate-spin mb-4" />
            <p>Loading analytics...</p>
        </div>
    );

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Items Sold', value: stats.totalItemsPurchased, icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Discounts', value: `$${stats.totalDiscountGiven}`, icon: Percent, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Active Milestones', value: stats.discountCodes.length, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-extrabold mb-3 tracking-tight">Admin Dashboard</h2>
                    <p className="text-neutral-400 text-lg">Real-time store performance and system management.</p>
                </div>
                <button
                    onClick={() => refreshStats()}
                    className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                    <RefreshCw size={20} className="text-neutral-400" />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group hover:border-neutral-700 transition-all">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-neutral-500 text-sm font-medium uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Ticket size={24} className="text-blue-500" />
                            Discount Code Registry
                        </h3>
                        <div className="space-y-4">
                            {stats.discountCodes.length === 0 ? (
                                <p className="text-neutral-600 italic">No codes generated yet. Milestone rewards appear here.</p>
                            ) : (
                                stats.discountCodes.map((code, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${code.isUsed ? 'bg-neutral-700' : 'bg-emerald-500 animate-pulse'}`}></div>
                                            <span className="font-mono text-lg font-bold tracking-wider">{code.code}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm px-3 py-1 bg-neutral-800 rounded-lg text-neutral-400">
                                                {code.percentage}% OFF
                                            </span>
                                            <span className={`text-xs font-bold uppercase tracking-widest ${code.isUsed ? 'text-neutral-600' : 'text-emerald-500'}`}>
                                                {code.isUsed ? 'Consumed' : 'Available'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                        <h3 className="text-2xl font-bold mb-4">System Actions</h3>
                        <p className="text-neutral-500 text-sm mb-8">
                            Manually trigger a discount code generation if the nth order condition is met but it was missed.
                        </p>

                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl flex gap-3 items-start text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <span>{message.text}</span>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <Percent size={18} />
                                    <span>Generate Milestone Code</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
