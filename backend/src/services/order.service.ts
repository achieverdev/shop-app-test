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
        const { order, generatedCode } = globalStore.placeOrder(userId, discountCode);
        return { order, rewardCode: generatedCode };
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

        orders.forEach(order => {
            totalItemsPurchased += order.items.reduce((sum, item) => sum + item.quantity, 0);
            totalRevenue += order.totalAmount;
            totalDiscountGiven += order.discountAmount;
        });

        return {
            totalItemsPurchased,
            totalRevenue,
            totalDiscountGiven,
            orders: orders.map(o => ({
                id: o.id,
                total: o.totalAmount,
                discount: o.discountAmount,
                items: o.items.reduce((sum, item) => sum + item.quantity, 0),
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
