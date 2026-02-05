import { Router, Request, Response } from 'express';
import { CartService } from '../services/cart.service';

const router = Router();
const DEFAULT_USER_ID = 'user_1';

router.get('/', (req: Request, res: Response) => {
    const cart = CartService.getCart(DEFAULT_USER_ID);
    res.json(cart);
});

router.post('/add', (req: Request, res: Response) => {
    const { productId, quantity } = req.body || {};

    if (!productId) {
        return res.status(400).json({ error: 'Missing productId in request body' });
    }

    if (quantity === undefined || quantity === null) {
        return res.status(400).json({ error: 'Missing quantity in request body' });
    }

    if (Number(quantity) <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }

    try {
        const updatedCart = CartService.addItem(DEFAULT_USER_ID, productId, Number(quantity));
        res.json({ message: 'Item added to cart', cart: updatedCart });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
