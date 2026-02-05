import { Router, Request, Response } from 'express';
import { globalStore } from '../store';

const router = Router();

router.post('/validate', (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Discount code is required' });
    }

    const result = globalStore.validateDiscount(code);

    if (result.valid) {
        res.json({
            valid: true,
            percentage: result.percentage,
            message: `Success! ${result.percentage}% discount applied.`
        });
    } else {
        res.status(400).json({
            valid: false,
            error: 'Invalid or already used discount code'
        });
    }
});

export default router;
