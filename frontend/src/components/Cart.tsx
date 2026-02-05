import React, { useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight, Tag, Ticket, CheckCircle2, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DiscountService } from '../services/api';

const Cart: React.FC = () => {
    const { cart, products, checkout } = useStore();
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percentage: number } | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [reward, setReward] = useState<{ message: string; code: string } | null>(null);
    const [successOrder, setSuccessOrder] = useState<any>(null);

    // Get full product details for cart items
    const cartDetails = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            ...item,
            name: product?.name || 'Unknown Product',
            subtotal: item.price * item.quantity
        };
    });

    const totalAmount = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = appliedDiscount ? Math.floor(totalAmount * (appliedDiscount.percentage / 100)) : 0;
    const finalTotal = totalAmount - discountAmount;

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) return;
        setIsValidating(true);
        try {
            const result = await DiscountService.validate(discountCode);
            setAppliedDiscount({ code: discountCode, percentage: result.percentage });
        } catch (error: any) {
            alert(error.response?.data?.error || "Invalid code");
            setAppliedDiscount(null);
        } finally {
            setIsValidating(false);
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const result = await checkout(appliedDiscount?.code || '');
            setSuccessOrder(result.order);
            setReward(result.reward);
        } catch (error: any) {
            alert(error.response?.data?.error || error.message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (successOrder) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-4xl font-extrabold mb-4">Order Confirmed!</h2>
                <p className="text-neutral-400 text-lg mb-8">
                    Your order <span className="text-white font-mono">#{successOrder.id}</span> has been placed successfully.
                </p>

                {reward && (
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-3xl p-8 mb-8 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Ticket size={80} />
                        </div>
                        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                            <Tag size={18} />
                            Special Reward
                        </h4>
                        <p className="text-white text-lg mb-4">{reward.message}</p>
                        <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
                            <span className="font-mono text-xl tracking-widest text-blue-400">{reward.code}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(reward.code)}
                                className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-md transition-colors"
                            >
                                Copy Code
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => {
                        setSuccessOrder(null);
                        setReward(null);
                        window.location.reload();
                    }}
                    className="bg-white text-neutral-900 px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all"
                >
                    Keep Shopping
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-32">
                <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-600">
                    <ShoppingCart size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
                <p className="text-neutral-500 italic max-w-sm mx-auto">
                    Fine taste takes time, but your cart shouldn't stay empty.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-2">
                <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Shopping Bag</h2>
                <div className="flex flex-col gap-6">
                    {cartDetails.map((item) => (
                        <div key={item.productId} className="flex items-center gap-6 p-6 bg-neutral-900/50 border border-neutral-800 rounded-3xl group">
                            <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-600">
                                <ShoppingCart size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{item.name}</h4>
                                <p className="text-neutral-500">${item.price} × {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold mb-1">${item.subtotal}</p>
                                <button className="text-neutral-600 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sticky top-24 shadow-2xl shadow-black/50">
                    <h3 className="text-2xl font-bold mb-6">Summary</h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-neutral-400">
                            <span>Subtotal</span>
                            <span>${totalAmount}</span>
                        </div>
                        {appliedDiscount && (
                            <div className="flex justify-between text-emerald-500 animate-in fade-in slide-in-from-right-4">
                                <span className="flex items-center gap-1">
                                    <Tag size={14} />
                                    Discount ({appliedDiscount.percentage}%)
                                </span>
                                <span>-${discountAmount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-neutral-400">
                            <span>Shipping</span>
                            <span className="text-emerald-500 font-medium">Free</span>
                        </div>
                        <div className="h-px bg-neutral-800 my-4"></div>
                        <div className="flex justify-between text-2xl font-bold">
                            <span>Total</span>
                            <span>${finalTotal}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-neutral-500 mb-2 uppercase tracking-widest">
                            Discount Code
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                placeholder="Enter code"
                                disabled={!!appliedDiscount}
                                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors uppercase font-mono text-sm"
                            />
                            {appliedDiscount ? (
                                <button
                                    onClick={() => { setAppliedDiscount(null); setDiscountCode(''); }}
                                    className="bg-neutral-800 p-3 rounded-xl hover:bg-neutral-700 transition-colors"
                                >
                                    <RefreshCw size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleApplyDiscount}
                                    disabled={isValidating || !discountCode}
                                    className="bg-blue-600 px-4 rounded-xl hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isValidating ? <RefreshCw size={18} className="animate-spin" /> : 'Apply'}
                                </button>
                            )}
                        </div>
                        {appliedDiscount && (
                            <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1 font-medium">
                                <CheckCircle2 size={12} />
                                Code "{appliedDiscount.code}" applied!
                            </p>
                        )}
                        <p className="mt-2 text-xs text-neutral-600 italic">
                            Rewards are generated every 5th order.
                        </p>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isCheckingOut ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-2 text-neutral-600 text-xs">
                        <ShieldCheck size={14} />
                        <span>Secure SSL Encrypted Checkout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShieldCheck: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
);

export default Cart;
