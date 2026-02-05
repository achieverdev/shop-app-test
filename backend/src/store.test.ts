import { globalStore } from './store';

describe('Store System', () => {
    beforeEach(() => {
        // Reset store state before each test
        const state = globalStore.getState();
        state.orders = [];
        state.carts = {};
        state.discountCodes = [];
    });

    test('should add items to cart', () => {
        globalStore.addToCart('user_1', '1', 2);
        const cart = globalStore.getCart('user_1');
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(2);
    });

    test('should calculate total correctly on checkout', () => {
        globalStore.addToCart('user_1', '1', 1); // 25
        globalStore.addToCart('user_1', '2', 2); // 15 * 2 = 30

        const { order } = globalStore.placeOrder('user_1');
        expect(order.totalAmount).toBe(55);
    });

    test('should generate discount code on every 5th order', () => {
        // Mock 4 orders
        for (let i = 0; i < 4; i++) {
            globalStore.addToCart('user_1', '1', 1);
            globalStore.placeOrder('user_1');
        }

        // The 5th order
        globalStore.addToCart('user_1', '1', 1);
        const { generatedCode } = globalStore.placeOrder('user_1');

        expect(generatedCode).not.toBeNull();
        expect(globalStore.getDiscountCodes()).toHaveLength(1);
    });

    test('should apply valid discount code correctly', () => {
        // First generate a code
        const state = globalStore.getState();
        state.nthOrderCount = 1; // Generate on every order for testing

        globalStore.addToCart('user_1', '1', 1);
        const { generatedCode } = globalStore.placeOrder('user_1');

        // Use the code (order total 25, 10% discount = 2.5)
        globalStore.addToCart('user_1', '1', 1);
        const { order } = globalStore.placeOrder('user_1', generatedCode!);

        expect(order.discountAmount).toBe(2.5);
        expect(order.finalAmount).toBe(22.5);
    });
});
