import { Router, Request, Response } from 'express';
import { globalStore } from '../store';

const router = Router();
const DEFAULT_USER_ID = 'user_1';

router.get('/', (req: Request, res: Response) => {
    const cart = globalStore.getCart(DEFAULT_USER_ID);
    res.json(cart);
});

router.post('/add', (req: Request, res: Response) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid productId or quantity' });
    }

    try {
        globalStore.addToCart(DEFAULT_USER_ID, productId, quantity);
        res.json({ message: 'Item added to cart', cart: globalStore.getCart(DEFAULT_USER_ID) });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
