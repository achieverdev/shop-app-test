import express, { Request, Response } from 'express';
import { globalStore } from './store';
import cartRoutes from './routes/cart';
import checkoutRoutes from './routes/checkout';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Routes
app.get('/api/products', (req: Request, res: Response) => {
    res.json(globalStore.getProducts());
});

app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
