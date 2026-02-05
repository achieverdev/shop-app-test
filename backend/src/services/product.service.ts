/**
 * @file product.service.ts
 * @description Service for managing product data retrieval.
 */

import { globalStore } from '../store';
import { Product } from '../types';

export const ProductService = {
    /**
     * Retrieves all available products from the store.
     */
    getAllProducts(): Product[] {
        return globalStore.getProducts();
    },

    /**
     * Finds a specific product by its ID.
     */
    getProductById(id: string): Product | undefined {
        return globalStore.getProducts().find(p => p.id === id);
    }
};
