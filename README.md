# Uniblox Store ☕

A premium, modern e-commerce prototype for an artisan coffee shop. Featuring a dynamic discount engine, a singleton-powered backend, and a glassmorphic React frontend.

## 🚀 Quick Start

Follow these steps to get the environment running locally.

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Server will start on [http://localhost:3001](http://localhost:3001)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*App will start on [http://localhost:5174](http://localhost:5174)*

---

## ✨ Key Features
Product List: A catalog of items with clear photos and descriptions.

Automatic Rewards: The system gives a 10% discount code to every 2nd order completed.

Admin Tools: A private page to view sales stats, see previous orders, and manage discount codes.

Order Tracking: Backend logs that record exactly how items move from the cart to a finished order.

## 🛠️ Architecture Decisions
For detailed information on the design choices made for this project, see [DECISIONS.md](./DECISIONS.md).

## 🧪 Testing
Run the backend unit tests to verify the store logic:
```bash
cd backend
npm test
```
