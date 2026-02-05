/**
 * @file product.service.ts
 * @description Service for managing product data retrieval.
 */

import { globalStore } from '../store';
import { Product } from '../types';
import { Logger } from '../utils/logger';

export const ProductService = {
    /**
     * Retrieves all available products from the store.
     */
    getAllProducts(): Product[] {
        const products = globalStore.getProducts();
        Logger.trace('PRODUCT_SERVICE', 'Fetched all products', { count: products.length });
        return products;
    },

    /**
     * Finds a specific product by its ID.
     */
    getProductById(id: string): Product | undefined {
        const product = globalStore.getProducts().find(p => p.id === id);
        if (product) {
            Logger.trace('PRODUCT_SERVICE', 'Product found', { id, name: product.name });
        } else {
            Logger.trace('PRODUCT_SERVICE', 'Product not found', { id });
        }
        return product;
    }
};
