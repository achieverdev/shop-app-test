/**
 * @file cart.service.ts
 * @description Service for managing user shopping carts.
 */

import { globalStore } from '../store';
import { CartItem } from '../types';
import { Logger } from '../utils/logger';

export const CartService = {
    /**
     * Retrieves the cart for a specific user.
     */
    getCart(userId: string): CartItem[] {
        return globalStore.getCart(userId);
    },

    /**
     * Adds an item to a user's cart.
     */
    addItem(userId: string, productId: string, quantity: number) {
        Logger.trace('CART_SERVICE', 'Adding item to cart', { userId, productId, quantity });
        globalStore.addToCart(userId, productId, quantity);
        return this.getCart(userId);
    },

    /**
     * Removes all items from a user's cart.
     */
    clearCart(userId: string) {
        Logger.trace('CART_SERVICE', 'Clearing user cart', { userId });
        globalStore.clearCart(userId);
    }
};
