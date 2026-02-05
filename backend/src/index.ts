import express from 'express';
import { globalStore } from './store';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/products', (req, res) => {
    res.json(globalStore.getProducts());
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
