/**
 * @file product.ts
 * @description Route for product-related operations.
 */

import { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const router = Router();

/**
 * GET /api/products
 * Retrieves all products for the shop.
 */
router.get('/', (req: Request, res: Response) => {
    res.json(ProductService.getAllProducts());
});

export default router;
