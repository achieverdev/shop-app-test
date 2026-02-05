export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
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
    createdAt: string;
}

export interface AdminStats {
    totalItemsPurchased: number;
    totalRevenue: number;
    totalDiscountGiven: number;
    orders: Order[];
    discountCodes: {
        code: string;
        isUsed: boolean;
        percentage: number;
    }[];
}
