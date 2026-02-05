export interface Product {
    id: string;
    name: string;
    price: number;
}

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    discountCode?: string;
    createdAt: Date;
}

export interface DiscountCode {
    code: string;
    discountPercentage: number;
    isUsed: boolean;
    orderIdGeneratedFrom: string; // The order ID that triggered the generation
}

export interface StoreState {
    products: Product[];
    orders: Order[];
    discountCodes: DiscountCode[];
    carts: Record<string, CartItem[]>; // itemId -> quantity mapped by userId
    nthOrderCount: number;
    discountPercentage: number;
    nextOrderNumber: number;
}
