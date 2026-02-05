## checklist: implemented backend business logic features

### user features
- [x] **add to cart**: cart creation by id and quantity management.
- [x] **cart view**: cart retrieval by unique ID.
- [x] **checkout processing**:
    - [x] **subtotal calculation**: subTotal of items.
    - [x] **empty cart validation**: prevents invalid checkouts.
    - [x] **discount application**: 10% percentage-based logic on entire order.
    - [x] **order creation**: record generation with unique IDs and timestamps.
    - [x] **cart expiry**: immediate session cleanup post-checkout.
- [x] **dynamic coupon generation**: automated every 3rd order (nth order logic).

### admin features
- [x] **real-time statistics**: global aggregation of orders, items, revenue, and discounts.
- [x] **discount code management**: usage tracking for all generated codes.
- [x] **manual code generation**: generate code.
---
### Feature list: 
### For Customers
Add to Cart: Create cart, add items
View Cart: See cart contents
Checkout:
Calculates total 
Blocks empty carts
Applies 10% discount with valid code
Saves order, deletes cart
Auto-generates coupon every 3 orders

### For Admin
Metrics: Orders, items sold, money made, discounts given
Coupon Control: Track used/unused codes
Manual Coupon: Create coupons when needed

### How It Works
Core Features
Quick Data Store - Fast data saving/retrieval
Flexible Settings: Easy to change discount % and coupon rules
Unique IDs: Auto-generated for carts/orders
Type Safety: Prevents data errors

### Code Files
userServices.ts - Shopping features
adminServices.ts - Admin features
store.ts - Data storage & settings