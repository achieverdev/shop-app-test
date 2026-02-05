import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

const Shop: React.FC = () => {
    const { products } = useStore();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h2 className="text-4xl font-extrabold mb-3 tracking-tight">Curated Collection</h2>
                <p className="text-neutral-400 text-lg max-w-2xl">
                    Experience luxury in every detail. Our handcrafted selection represents the peak of artisanal quality.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl">
                    <p className="text-neutral-500 italic">Connecting to luxury vault...</p>
                </div>
            )}
        </div>
    );
};

export default Shop;
