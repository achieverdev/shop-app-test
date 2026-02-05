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

export interface AdminOrderSummary {
    id: string;
    total: number;
    discount: number;
    items: number;
    timestamp: string;
}

export interface AdminStats {
    totalItemsPurchased: number;
    totalRevenue: number;
    totalDiscountGiven: number;
    orders: AdminOrderSummary[];
    discountCodes: {
        code: string;
        isUsed: boolean;
        percentage: number;
    }[];
}
