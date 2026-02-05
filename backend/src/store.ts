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

    placeOrder(userId: string, discountCode?: string): { order: Order; generatedCode: string | null } {
        this.log('Processing checkout...', { userId, discountCode });
        const cartItems = this.getCart(userId);
        if (cartItems.length === 0) {
            this.log('Error: Cart is empty.');
            throw new Error('Cart is empty');
        }

        let totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmount = 0;

        // 3. APPLY DISCOUNT LOGIC
        // Rule: Only unused codes created by the system are valid.
        // SECURITY NOTE: We perform a strict check on isUsed to prevent double-spending of codes.
        if (discountCode) {
            const validCode = this.state.discountCodes.find(
                dc => dc.code === discountCode && !dc.isUsed
            );

            if (!validCode) {
                this.log('Error: Invalid or used discount code provided.', { code: discountCode });
                throw new Error('Invalid or already used discount code');
            }

            // Calculate the discount value based on the code's percentage
            discountAmount = (totalAmount * validCode.discountPercentage) / 100;
            validCode.isUsed = true; // Mark as spent so it can't be reused
            this.log('Discount applied successfully!', { code: discountCode, amount: discountAmount });
        }

        const finalAmount = totalAmount - discountAmount;

        // 4. Record the final purchase
        // SECURITY NOTE: Order IDs are generated randomly. 
        // FIXME: For high-scale production, use UUIDs or a database sequence to ensure uniqueness and prevent id collision.
        const order: Order = {
            id: `ord_${Math.random().toString(36).substring(2, 9)}`,
            items: [...cartItems],
            totalAmount,
            discountAmount,
            finalAmount,
            discountCode,
            createdAt: new Date()
        };

        this.state.orders.push(order);
        this.clearCart(userId);
        this.log('Order placed successfully.', { orderId: order.id, total: order.finalAmount });

        // 5. REWARD ENGINE LOGIC
        // Rule: Every "nthOrderCount" orders (currently set to 2), generate a one-time code.
        // This encourages customer retention by rewarding repeat purchases.
        let generatedCode: string | null = null;
        if (this.state.orders.length % this.state.nthOrderCount === 0) {
            generatedCode = `DISCOUNT_${Math.random().toString(36).toUpperCase().substring(2, 8)}`;
            this.addDiscountCode(generatedCode, order.id);
            this.log('Milestone reached! New discount code generated.', { code: generatedCode });
        }

        return { order, generatedCode };
    }

    getOrders() {
        return this.state.orders;
    }

    addOrder(order: any) {
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

    manualDiscountGeneration(): string | null {
        const currentCount = this.state.orders.length;
        if (currentCount > 0 && currentCount % this.state.nthOrderCount === 0) {
            // Check if a code already exists for the latest order
            const lastOrder = this.state.orders[currentCount - 1];
            const alreadyGenerated = this.state.discountCodes.some(dc => dc.orderIdGeneratedFrom === lastOrder?.id);

            if (!alreadyGenerated && lastOrder) {
                const code = `ADMIN_DISCOUNT_${Math.random().toString(36).toUpperCase().substring(2, 8)}`;
                this.addDiscountCode(code, lastOrder.id);
                return code;
            }
        }
        return null;
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
