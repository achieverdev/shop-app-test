# Uniblox E-commerce API Documentation

This document defines the REST API endpoints and their associated TypeScript types for the Uniblox E-commerce Sample application.

## 1. Core Data Models

These types are shared across the application.

```typescript
/** Represents a product item in a cart or order */
interface Product {
    productId: string;
    quantity: number;
    price: number;
}

/** Represents a discount code status */
interface DiscountCode {
    code: string;
    isUsed: boolean;
}

/** Represents a finalized order */
interface Order {
    orderId: string;
    items: Product[];
    totalAmount: number;
    discountAmount: number;
    timestamp: Date;
}

/** Global statistics for the Admin Dashboard */
interface GlobalStats {
    totalOrders: number;
    totalItemsPurchased: number;
    totalRevenue: number;
    totalDiscountAmount: number;
    discountCodes: DiscountCode[];
}
```

---

## 2. User API (Public Flow)

### Add to Cart
**Path:** `POST /api/user/cart/add`

**Input Body:**
```typescript
interface AddToCartRequest {
    cartId?: string;    // Optional: Existing cart ID
    productId: string;  // Required
    quantity: number;   // Required
    price: number;      // Required
}
```

**Successful Output:**
```typescript
interface AddToCartResponse {
    cartId: string;
    cart: {
        items: Product[];
        subtotal: number;
    };
}
```

---

### Checkout
**Path:** `POST /api/user/checkout`

**Input Body:**
```typescript
interface CheckoutRequest {
    cartId: string;        // Required
    discountCode?: string; // Optional
}
```

**Successful Output:**
```typescript
interface CheckoutResponse {
    success: boolean;
    orderId: string;
    finalAmount: number;
    discountApplied: number;
    newCoupon?: string; // Presence indicates this was an Nth order
}
```

---

## 3. Admin API (Management Flow)

### Get Dashboard Stats
**Path:** `GET /api/admin/stats`

**Output:**
```typescript
interface AdminStatsResponse extends GlobalStats {
    totalOrdersPlaced: number;
}
```

---

### Manually Generate Discount Code
**Path:** `POST /api/admin/generate-code`

**Output:**
```typescript
interface ManualCodeGenResponse {
    success: boolean;
    code?: string;
    message?: string; // Error message if condition not satisfied
}
```
