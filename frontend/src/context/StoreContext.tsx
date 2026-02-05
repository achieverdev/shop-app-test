/**
 * @file StoreContext.tsx
 * @description The functional bridge between the frontend UI and the backend API.
 * Manages global React state for products, cart, and admin statistics.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, Order, AdminStats } from '../types';
import { ProductService, CartService, CheckoutService, AdminService } from '../services/api';

interface StoreContextType {
    products: Product[];
    cart: CartItem[];
    stats: AdminStats | null;
    loading: boolean;
    refreshCart: () => Promise<void>;
    refreshStats: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    checkout: (code?: string) => Promise<{ message: string; order: Order; reward: any }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshCart = useCallback(async () => {
        const data = await CartService.getCart();
        setCart(data);
    }, []);

    const refreshStats = useCallback(async () => {
        const data = await AdminService.getStats();
        setStats(data);
    }, []);

    const addToCart = async (productId: string, quantity: number) => {
        await CartService.addToCart(productId, quantity);
        await refreshCart();
    };

    const checkout = async (code?: string) => {
        const result = await CheckoutService.checkout(code);
        // Implementation: We immediately refresh the local cart and stats 
        // after a successful checkout to ensure the UI stays in sync with 
        // the backend (orders history, new reward generation, etc).
        await refreshCart();
        await refreshStats();
        return result;
    };

    useEffect(() => {
        const init = async () => {
            try {
                const prods = await ProductService.getProducts();
                setProducts(prods);
                await refreshCart();
                await refreshStats();
            } catch (err) {
                console.error("Failed to initialize store", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [refreshCart, refreshStats]);

    return (
        <StoreContext.Provider value={{ products, cart, stats, loading, refreshCart, refreshStats, addToCart, checkout }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within StoreProvider');
    return context;
};
