/**
 * @file order.service.ts
 * @description Business logic for processing orders and generating analytics.
 */

import { globalStore } from '../store';
import { Order } from '../types';
import { DiscountService } from './discount.service';

export const OrderService = {
    /**
     * Orchestrates the checkout process.
     * Logic: Verify Cart -> Apply Discount -> Save Order -> Generate Reward.
     */
    processCheckout(userId: string, discountCode?: string): { order: Order; rewardCode: string | null } {
        // Implementation: Business logic moved from Store to Service
        const cartItems = globalStore.getCart(userId);
        if (cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        let totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmount = 0;

        // 1. APPLY DISCOUNT LOGIC
        if (discountCode) {
            const validate = DiscountService.validateCode(discountCode);
            if (!validate.valid) {
                throw new Error('Invalid or already used discount code');
            }

            discountAmount = (totalAmount * (validate.percentage || 0)) / 100;
            globalStore.markDiscountAsUsed(discountCode);
        }

        const finalAmount = totalAmount - discountAmount;

        // 2. Record the final purchase
        const order: Order = {
            id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            items: [...cartItems],
            totalAmount,
            discountAmount,
            finalAmount,
            discountCode,
            createdAt: new Date()
        };

        globalStore.addOrder(order);
        globalStore.clearCart(userId);

        // 3. REWARD ENGINE LOGIC
        let rewardCode: string | null = null;
        const currentOrders = globalStore.getOrders();
        const nth = globalStore.getState().nthOrderCount;

        if (currentOrders.length % nth === 0) {
            rewardCode = DiscountService.generateMilestoneCode(order.id);
        }

        return { order, rewardCode };
    },

    /**
     * Aggregates store performance metrics.
     * Logic: Sum revenue, items, and discounts across all history.
     */
    getStoreStats() {
        const orders = globalStore.getOrders();
        const discountCodes = globalStore.getDiscountCodes();

        let totalItemsPurchased = 0;
        let totalRevenue = 0;
        let totalDiscountGiven = 0;

        orders.forEach((order: Order) => {
            totalItemsPurchased += order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
            totalRevenue += order.totalAmount;
            totalDiscountGiven += order.discountAmount;
        });

        return {
            totalItemsPurchased,
            totalRevenue,
            totalDiscountGiven,
            orders: orders.map((o: Order) => ({
                id: o.id,
                total: o.totalAmount,
                discount: o.discountAmount,
                items: o.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
                timestamp: o.createdAt.toISOString()
            })).reverse(),
            discountCodes: discountCodes.map(dc => ({
                code: dc.code,
                isUsed: dc.isUsed,
                percentage: dc.discountPercentage
            }))
        };
    }
};
