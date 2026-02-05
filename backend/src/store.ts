import { StoreState, Product } from './types';

const INITIAL_PRODUCTS: Product[] = [
    { id: '1', name: 'Premium Coffee Beans', price: 25 },
    { id: '2', name: 'Artisan Mug', price: 15 },
    { id: '3', name: 'French Press', price: 45 },
];

class Store {
    private state: StoreState = {
        products: INITIAL_PRODUCTS,
        orders: [],
        discountCodes: [],
        nthOrderCount: 5, // Every 5th order generates a coupon
        discountPercentage: 10, // 10% discount
        nextOrderNumber: 1,
    };

    getProducts() {
        return this.state.products;
    }

    getOrders() {
        return this.state.orders;
    }

    addOrder(order: any) {
        this.state.orders.push(order);
        this.state.nextOrderNumber++;
    }

    getDiscountCodes() {
        return this.state.discountCodes;
    }

    addDiscountCode(code: string, orderId: string) {
        this.state.discountCodes.push({
            code,
            discountPercentage: this.state.discountPercentage,
            isUsed: false,
            orderIdGeneratedFrom: orderId
        });
    }

    getState() {
        return this.state;
    }
}

export const globalStore = new Store();
