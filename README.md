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
- **Artisan Catalog**: 8 premium coffee products with high-resolution Unsplash imagery.
- **Discount Engine**: Automatically generates a 10% discount code for every 2nd order placed on the system.
- **Admin Dashboard**: Real-time analytics, order history tracking, and manual reward management.
- **Advanced Logging**: Conditional backend logging for tracking transaction flow and inventory logic.
- **Premium UI**: Dark-mode aesthetic with smooth hover animations and responsive layouts.

## 🛠️ Architecture Decisions
For detailed information on the design choices made for this project, see [DECISIONS.md](./DECISIONS.md).

## 🧪 Testing
Run the backend unit tests to verify the store logic:
```bash
cd backend
npm test
```
