import { Router, Request, Response } from 'express';
import { globalStore } from '../store';

const router = Router();

// 1. Lists count of items purchased, revenue, discount codes and total discounts given.
router.get('/stats', (req: Request, res: Response) => {
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

    res.json({
        totalItemsPurchased,
        totalRevenue,
        totalDiscountGiven,
        orders: orders.map(o => ({
            id: o.id,
            total: o.totalAmount,
            discount: o.discountAmount,
            items: o.items.length,
            timestamp: new Date().toISOString() // Placeholder for timestamp
        })).reverse(),
        discountCodes: discountCodes.map(dc => ({
            code: dc.code,
            isUsed: dc.isUsed,
            percentage: dc.discountPercentage
        }))
    });
});

// 2. Generate a discount code if the condition is satisfied (manual trigger/validation)
router.post('/generate-code', (req: Request, res: Response) => {
    const generatedCode = globalStore.manualDiscountGeneration();

    if (generatedCode) {
        res.status(201).json({
            message: "Discount code generated successfully.",
            code: generatedCode
        });
    } else {
        const state = globalStore.getState();
        const currentCount = state.orders.length;
        const nth = state.nthOrderCount;

        res.status(400).json({
            error: "Condition not satisfied or code already exists for this milestone.",
            currentOrderCount: currentCount,
            nextMilestone: (Math.floor(currentCount / nth) + 1) * nth
        });
    }
});

export default router;
