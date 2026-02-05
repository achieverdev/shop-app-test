import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Product, CartItem, Order, AdminStats } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const ProductService = {
    getProducts: () => api.get<Product[]>('/products').then((res: AxiosResponse<Product[]>) => res.data),
};

export const CartService = {
    getCart: () => api.get<CartItem[]>('/cart').then((res: AxiosResponse<CartItem[]>) => res.data),
    addToCart: (productId: string, quantity: number) =>
        api.post('/cart/add', { productId, quantity }).then((res: AxiosResponse) => res.data),
};

export const CheckoutService = {
    checkout: (discountCode?: string) =>
        api.post<{ message: string; order: Order; reward: any }>('/checkout', { discountCode })
            .then((res: AxiosResponse<{ message: string; order: Order; reward: any }>) => res.data),
};

export const AdminService = {
    getStats: () => api.get<AdminStats>('/admin/stats').then((res: AxiosResponse<AdminStats>) => res.data),
    generateCode: () => api.post('/admin/generate-code').then((res: AxiosResponse) => res.data),
};

export const DiscountService = {
    validate: (code: string) =>
        api.post<{ valid: boolean; percentage: number; message: string }>('/discount/validate', { code })
            .then((res: AxiosResponse<{ valid: boolean; percentage: number; message: string }>) => res.data),
};
