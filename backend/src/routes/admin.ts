/**
 * @file admin.ts
 * @description Admin-only routes for system analytics and manual intervention.
 */

import { Router, Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { DiscountService } from '../services/discount.service';

const router = Router();

// 1. AGGREGATE ANALYTICS
// This route calculates revenue and discounts across all historical orders.
// SECURITY NOTE: This endpoint should ideally be restricted to admin users via middleware.
// FIXME: Currently open for development simplified access. Add Auth middleware for production.
router.get('/stats', (req: Request, res: Response) => {
    const stats = OrderService.getStoreStats();
    res.json(stats);
});

// 2. Generate a discount code if the condition is satisfied (manual trigger/validation)
router.post('/generate-code', (req: Request, res: Response) => {
    const generatedCode = DiscountService.manualGenerate();

    if (generatedCode) {
        res.status(201).json({
            message: "Discount code generated successfully.",
            code: generatedCode
        });
    } else {
        const { currentCount, nth } = DiscountService.getMilestoneInfo();

        res.status(400).json({
            error: "Condition not satisfied or code already exists for this milestone.",
            currentOrderCount: currentCount,
            nextMilestone: (Math.floor(currentCount / nth) + 1) * nth
        });
    }
});

export default router;
