import React, { useState } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Percent, Ticket, RefreshCw, AlertCircle, Clock, CheckCircle2, History } from 'lucide-react';
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
        { label: 'Orders Placed', value: stats.orders?.length || 0, icon: History, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <History size={24} className="text-purple-500" />
                            Recent Orders
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-neutral-500 text-xs uppercase tracking-widest border-b border-neutral-800">
                                    <tr>
                                        <th className="pb-4 pt-2">Order ID</th>
                                        <th className="pb-4 pt-2">Items</th>
                                        <th className="pb-4 pt-2">Discount</th>
                                        <th className="pb-4 pt-2">Total</th>
                                        <th className="pb-4 pt-2 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {stats.orders && stats.orders.length > 0 ? (
                                        stats.orders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="py-4 font-mono text-sm text-neutral-300">#{order.id.split('-')[0]}</td>
                                                <td className="py-4 text-neutral-400">{order.items} unit(s)</td>
                                                <td className="py-4 text-emerald-500 font-medium">{order.discount > 0 ? `-$${order.discount}` : '—'}</td>
                                                <td className="py-4 font-bold">${order.total}</td>
                                                <td className="py-4 text-right">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase">
                                                        <CheckCircle2 size={12} />
                                                        Success
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-neutral-600 italic">No orders recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 h-full">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Percent size={24} className="text-amber-500" />
                            System Actions
                        </h3>
                        <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
                            Manually trigger a discount code generation if the milestone condition is met.
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
                            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Ticket size={18} />}
                            <span>Generate Code</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <History size={24} className="text-blue-500" />
                    Discount Code Registry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.discountCodes.map((code, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-neutral-950 border border-neutral-800 rounded-2xl group hover:border-neutral-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-2.5 h-2.5 rounded-full ${code.isUsed ? 'bg-neutral-800' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
                                <span className="font-mono text-lg font-bold tracking-widest">{code.code}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs px-2 py-1 bg-neutral-800 rounded-md text-neutral-400 font-bold uppercase">{code.percentage}% OFF</span>
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${code.isUsed ? 'text-neutral-700' : 'text-emerald-500'}`}>
                                    {code.isUsed ? 'Consumed' : 'Ready'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {stats.discountCodes.length === 0 && (
                        <div className="col-span-full py-8 text-center text-neutral-600 italic bg-neutral-950/50 border border-dashed border-neutral-800 rounded-2xl">
                            No milestone codes generated. Rewards will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
