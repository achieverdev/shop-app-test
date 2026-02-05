import { Router } from 'express';
import { globalStore } from '../store';

const router = Router();

// For simplicity, we'll use a hardcoded userId "user_1"
// In a real app, this would come from auth middleware
const DEFAULT_USER_ID = 'user_1';

router.get('/', (req, res) => {
    const cart = globalStore.getCart(DEFAULT_USER_ID);
    res.json(cart);
});

router.post('/add', (req, res) => {
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
