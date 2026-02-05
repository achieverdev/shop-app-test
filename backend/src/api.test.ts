import request from 'supertest';
import app from './index';
import { globalStore } from './store';

describe('API Endpoints', () => {
    beforeEach(() => {
        const state = globalStore.getState();
        state.orders = [];
        state.carts = {};
        state.discountCodes = [];
    });

    test('GET /api/products should return product list', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
    });

    test('POST /api/cart/add should add item', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .send({ productId: '1', quantity: 2 });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Item added to cart');
    });

    test('POST /api/checkout should create order', async () => {
        // Add item first
        await request(app).post('/api/cart/add').send({ productId: '1', quantity: 1 });

        const res = await request(app).post('/api/checkout').send({});
        expect(res.status).toBe(201);
        expect(res.body.order).toBeDefined();
    });

    test('GET /api/admin/stats should return analytics', async () => {
        const res = await request(app).get('/api/admin/stats');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalRevenue');
    });

    test('404 on unknown route', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Endpoint not found');
    });
});
