import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAdd = async () => {
        setIsAdding(true);
        try {
            await addToCart(product.id, quantity);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="group bg-neutral-900 border border-neutral-800 rounded-3xl p-6 transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
            <div className="aspect-square bg-neutral-800 rounded-2xl mb-6 overflow-hidden group-hover:shadow-lg transition-all">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600';
                    }}
                />
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                <p className="text-2xl font-bold texte-white">${product.price}</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-neutral-950 p-2 rounded-2xl border border-neutral-800">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-800 text-neutral-400"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-800 text-neutral-400"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={handleAdd}
                    disabled={isAdding}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${showSuccess
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-neutral-100 text-neutral-900 hover:bg-white active:scale-95'
                        }`}
                >
                    {showSuccess ? (
                        <>
                            <Check size={18} />
                            <span>Added to Cart</span>
                        </>
                    ) : isAdding ? (
                        <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <ShoppingCart size={18} />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
