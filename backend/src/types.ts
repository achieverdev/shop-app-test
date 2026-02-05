export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
}

/**
 * Represents an item within a shopping cart or order.
 */
export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
}

/**
 * Represents a completed purchase.
 */
export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;    // Original price before discount
    discountAmount: number; // Value of discount applied
    finalAmount: number;    // Amount actually charged
    discountCode?: string;
    createdAt: Date;
}

/**
 * Represents a discount code that can be applied to an order.
 */
export interface DiscountCode {
    code: string;
    discountPercentage: number;
    isUsed: boolean;
    orderIdGeneratedFrom: string; // The order ID that triggered the generation (e.g., every 2nd order)
}

/**
 * The global state of the application.
 */
export interface StoreState {
    products: Product[];
    orders: Order[];
    discountCodes: DiscountCode[];
    carts: Record<string, CartItem[]>; // Keyed by userId
    nthOrderCount: number;             // Frequency of reward generation (e.g., set to 2)
    discountPercentage: number;        // Reward percentage (e.g., 10%)
    nextOrderNumber: number;           // Sequential counter for order IDs
    enableLogging: boolean;            // Global flag to toggle backend console logs
}
