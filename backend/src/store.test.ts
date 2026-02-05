import { globalStore } from './store';
import { OrderService } from './services/order.service';
import { CartService } from './services/cart.service';
import { DiscountService } from './services/discount.service';

describe('Service System (Refactored)', () => {
    beforeEach(() => {
        // Reset store state before each test
        const state = globalStore.getState();
        state.orders = [];
        state.carts = {};
        state.discountCodes = [];
        state.nthOrderCount = 2; // Default
    });

    test('should add items to cart via CartService', () => {
        CartService.addItem('user_1', '1', 2);
        const cart = CartService.getCart('user_1');
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(2);
    });

    test('should calculate total correctly on checkout via OrderService', () => {
        CartService.addItem('user_1', '1', 1); // 25
        CartService.addItem('user_1', '2', 2); // 15 * 2 = 30

        const { order } = OrderService.processCheckout('user_1');
        expect(order.totalAmount).toBe(55);
    });

    test('should generate discount code on every nth order milestone', () => {
        // Mock 1 order
        CartService.addItem('user_1', '1', 1);
        OrderService.processCheckout('user_1');

        // The 2nd order (milestone)
        CartService.addItem('user_1', '1', 1);
        const { rewardCode } = OrderService.processCheckout('user_1');

        expect(rewardCode).not.toBeNull();
        expect(globalStore.getDiscountCodes()).toHaveLength(1);
    });

    test('should apply valid discount code correctly via DiscountService integration', () => {
        // Setup milestone to 1 for quick test
        const state = globalStore.getState();
        state.nthOrderCount = 1;

        CartService.addItem('user_1', '1', 1);
        const { rewardCode } = OrderService.processCheckout('user_1');

        // Use the code (order total 25, 10% discount = 2.5)
        CartService.addItem('user_1', '1', 1);
        const { order } = OrderService.processCheckout('user_1', rewardCode!);

        expect(order.discountAmount).toBe(2.5);
        expect(order.finalAmount).toBe(22.5);
    });
});
