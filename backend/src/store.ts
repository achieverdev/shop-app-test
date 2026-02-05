import { StoreState, Product, Order } from './types';

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
        carts: {},
        nthOrderCount: 5,
        discountPercentage: 10,
        nextOrderNumber: 1,
    };

    getProducts() {
        return this.state.products;
    }

    getCart(userId: string) {
        return this.state.carts[userId] || [];
    }

    addToCart(userId: string, productId: string, quantity: number) {
        if (!this.state.carts[userId]) {
            this.state.carts[userId] = [];
        }

        const product = this.state.products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');

        const existingItem = this.state.carts[userId].find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.state.carts[userId].push({
                productId,
                quantity,
                price: product.price
            });
        }
    }

    clearCart(userId: string) {
        this.state.carts[userId] = [];
    }

    placeOrder(userId: string, discountCode?: string): { order: Order; generatedCode: string | null } {
        const cartItems = this.getCart(userId);
        if (cartItems.length === 0) throw new Error('Cart is empty');

        let totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmount = 0;

        // 1. Validate and Apply Discount Code
        if (discountCode) {
            const validCode = this.state.discountCodes.find(
                dc => dc.code === discountCode && !dc.isUsed
            );

            if (!validCode) {
                throw new Error('Invalid or already used discount code');
            }

            discountAmount = (totalAmount * validCode.discountPercentage) / 100;
            validCode.isUsed = true;
        }

        const finalAmount = totalAmount - discountAmount;

        const order: Order = {
            id: `ord_${Math.random().toString(36).substring(2, 9)}`,
            items: [...cartItems],
            totalAmount,
            discountAmount,
            finalAmount,
            discountCode,
            createdAt: new Date()
        };

        this.state.orders.push(order);
        this.clearCart(userId);

        // 2. nth Order Discount Generation Logic
        let generatedCode: string | null = null;
        if (this.state.orders.length % this.state.nthOrderCount === 0) {
            generatedCode = `DISCOUNT_${Math.random().toString(36).toUpperCase().substring(2, 8)}`;
            this.addDiscountCode(generatedCode, order.id);
        }

        return { order, generatedCode };
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
