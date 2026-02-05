/**
 * @file cart.service.ts
 * @description Service for managing user shopping carts.
 */

import { globalStore } from '../store';
import { CartItem } from '../types';

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
        globalStore.addToCart(userId, productId, quantity);
        return this.getCart(userId);
    },

    /**
     * Removes all items from a user's cart.
     */
    clearCart(userId: string) {
        globalStore.clearCart(userId);
    }
};
