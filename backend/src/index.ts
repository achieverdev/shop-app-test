import express from 'express';
import { globalStore } from './store';
import cartRoutes from './routes/cart';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Routes
app.get('/api/products', (req, res) => {
    res.json(globalStore.getProducts());
});

app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
