/**
 * @file store.ts
 * @description The central in-memory data store for the Uniblox Store.
 * Handles state management for products, carts, orders, and the discount engine.
 * 
 * SECURITY NOTE: This uses in-memory storage. For production, this must be migrated 
 * to a persistent database (e.g., PostgreSQL or MongoDB) with proper ACID compliance.
 */

import { StoreState, Product, Order } from './types';

const INITIAL_PRODUCTS: Product[] = [
    { id: '1', name: 'Premium Coffee Beans', price: 25, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600' },
    { id: '2', name: 'Artisan Mug', price: 15, image: 'https://images.unsplash.com/photo-1517256011271-bfbd3ca47695?auto=format&fit=crop&q=80&w=600' },
    { id: '3', name: 'French Press', price: 45, image: 'https://images.unsplash.com/photo-1442550528053-c431ecb55509?auto=format&fit=crop&q=80&w=600' },
    { id: '4', name: 'Moka Pot', price: 35, image: 'https://images.unsplash.com/photo-1544190153-c359d9976906?auto=format&fit=crop&q=80&w=600' },
    { id: '5', name: 'Glass Dripper', price: 20, image: 'https://images.unsplash.com/photo-1545665225-b23b9d8c9bc8?auto=format&fit=crop&q=80&w=600' },
    { id: '6', name: 'Coffee Grinder', price: 60, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600' },
    { id: '7', name: 'Milk Frother', price: 12, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600' },
    { id: '8', name: 'Travel Tumbler', price: 30, image: 'https://images.unsplash.com/photo-1577937927133-66ef06ac9af1?auto=format&fit=crop&q=80&w=600' },
];

class Store {
    private state: StoreState = {
        products: INITIAL_PRODUCTS,
        orders: [],
        discountCodes: [],
        carts: {},
        nthOrderCount: 2, // Default is now 2
        discountPercentage: 10,
        nextOrderNumber: 1,
        enableLogging: true,
    };

    getProducts() {
        return this.state.products;
    }

    getCart(userId: string) {
        return this.state.carts[userId] || [];
    }

    addToCart(userId: string, productId: string, quantity: number) {
        if (!this.state.carts[userId]) {
            this.state.carts[userId] = [];
        }

        const product = this.state.products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');

        const existingItem = this.state.carts[userId].find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.state.carts[userId].push({
                productId,
                quantity,
                price: product.price
            });
        }
    }

    clearCart(userId: string) {
        this.state.carts[userId] = [];
    }

    addOrder(order: Order) {
        this.state.orders.push(order);
        this.state.nextOrderNumber++;
    }

    getDiscountCodes() {
        return this.state.discountCodes;
    }

    addDiscountCode(code: string, orderId: string) {
        this.state.discountCodes.push({
            code,
            discountPercentage: this.state.discountPercentage,
            isUsed: false,
            orderIdGeneratedFrom: orderId
        });
    }

    markDiscountAsUsed(code: string) {
        const dc = this.state.discountCodes.find(c => c.code === code);
        if (dc) dc.isUsed = true;
    }

    getOrders() {
        return this.state.orders;
    }

    validateDiscount(code: string): { valid: boolean; percentage?: number } {
        this.log('Validating discount code...', { code });
        const discount = this.state.discountCodes.find(dc => dc.code === code && !dc.isUsed);
        if (discount) {
            this.log('Discount code is valid.', { percentage: discount.discountPercentage });
            return { valid: true, percentage: discount.discountPercentage };
        }
        this.log('Discount code is invalid.', { code });
        return { valid: false };
    }

    private log(message: string, data?: any) {
        if (this.state.enableLogging) {
            console.log(`[STORE LOG] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    }

    getState() {
        return this.state;
    }
}

export const globalStore = new Store();
