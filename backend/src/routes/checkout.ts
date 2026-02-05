/**
 * @file checkout.ts
 * @description API endpoint for processing orders and generating rewards.
 */

import { Router, Request, Response } from 'express';
import { OrderService } from '../services/order.service';

const router = Router();

// FIXME: Using a hardcoded user ID for the simplified prototype.
// For production, this should be extracted from a JWT token or session.
const DEFAULT_USER_ID = 'user_1';

router.post('/', (req: Request, res: Response) => {
    const { discountCode } = req.body;

    try {
        const { order, rewardCode } = OrderService.processCheckout(DEFAULT_USER_ID, discountCode);
        res.status(201).json({
            message: 'Checkout successful',
            order,
            reward: rewardCode ? {
                message: `Congratulations! You've received a discount code for being our nth customer!`,
                code: rewardCode
            } : null
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
