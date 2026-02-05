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
        discountCodes: discountCodes.map(dc => ({
            code: dc.code,
            isUsed: dc.isUsed,
            percentage: dc.discountPercentage
        }))
    });
});

// 2. Generate a discount code if the condition is satisfied (manual trigger/validation)
router.post('/generate-code', (req: Request, res: Response) => {
    const orders = globalStore.getOrders();
    const nth = globalStore.getState().nthOrderCount;

    // Check if we are exactly at an nth order milestone and hasn't generated for it yet?
    // Actually, the requirement says "if the condition above is satisfied".
    // Our 'placeOrder' already generates it automatically.
    // This API can serve as a "status check" or a way to see if the NEXT order will be a discount.

    const currentCount = orders.length;
    const isSatisfied = currentCount > 0 && currentCount % nth === 0;

    res.json({
        currentOrderCount: currentCount,
        nthMilestone: nth,
        isConditionSatisfied: isSatisfied,
        message: isSatisfied
            ? "Condition is satisfied. Records show a code should have been generated."
            : `Condition not satisfied. ${nth - (currentCount % nth)} more orders needed.`
    });
});

export default router;
