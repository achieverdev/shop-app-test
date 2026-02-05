# design decisions

## decision: in-memory store for persistence

**context:** The instructions say we don't need a permanent database, keeping data in memory is okay

**options considered:**
- option a: file-based storage (json files)
- option b: javascript object storage (in-memory)

**choice:** option b

**why:** 
It's quick to make
Testing is easier
We don't need to save data permanently

---

## decision: service layer separation (admin vs user)

**context:** logic for users (shopping) and admins (stats/management) can grow complex.

**options considered:**
- option a: single service file for all logic
- option b: separate `userServices.js` and `adminServices.js`

**choice:** option b

**why:** separating concerns improves maintainability and readability. a developer can easily find logic related to their specific task without wading through irrelevant code.

---

## decision: global variable for quick calculation

**context:** the user specifically requested a global variable for quick calculations on stats.

**options considered:**
- option a: calculate totals on-the-fly from the `orders` array every time
- option b: maintain a running total in a global `stats` object

**choice:** option b

**why:** it optimizes performance (o(1) access to stats) and directly fulfills the user's architectural request.

---

## decision: discount generation at checkout

**context:** when should a discount code be generated for the nth order?

**options considered:**
- option a: generate at start of next session
- option b: generate immediately upon completion of the nth order (checkout)

**choice:** option b

**why:** it provides immediate feedback to the nth customer. the response can include the new code, enhancing user experience.

---

## decision: simple random id generation

**context:** need unique ids for carts, orders, and codes.

**options considered:**
- option a: install external library like `uuid` or `nanoid`
- option b: use `Math.random().toString(36)`

**choice:** option b

**why:** keeps the codebase lighter and dependency-free for a simple test assignment.

---

## decision: full typescript implementation

**context:** the user asked if the entire application could be written in typescript for better safety and documentation.

**options considered:**
- option a: keep javascript with jsdoc
- option b: migrate both backend and frontend to typescript

**choice:** option b

**why:** typescript provides superior developer experience through autocompletion and compile-time error checking. by defining shared interfaces for api bodies, we ensure the frontend and backend are always in sync, reducing runtime bugs.

---

## decision: react context for global shopping state

**context:** Managing cart count and session state across multiple components (Shop, Cart, Admin).

**options considered:**
- option a: prop-drilling state from `App.tsx`
- option b: `React.createContext` and `useContext`

**choice:** option b

**why:** avoids prop-drilling and provides a centralized way to update UI elements like the header cart badge from any component.

---

## decision: axios for api communication

**context:** Choosing a method for frontend-to-backend communication.

**options considered:**
- option a: native `fetch` API
- option b: `axios` library

**choice:** option b

**why:** provides a more ergonomic API than native `fetch`, with automatic JSON parsing and better error handling consistency.

---

## decision: localstorage for cart persistence

**context:** How to maintain the shopping session without a user login system.

**options considered:**
- option a: memory only (reset on refresh)
- option b: store `cartId` in browser `localStorage`

**choice:** option b

**why:** allows the user to refresh the page or return later while keeping their specific in-memory cart active, improving UX with minimal complexity.

---

## decision: express middleware for standardization

**context:** Handling common requirements like CORS and JSON parsing.

**options considered:**
- option a: manual header and stream handling
- option b: `cors` and `body-parser`

**choice:** option b

**why:** simplifies route handlers by abstracting away the boilerplate of header management and stream parsing.

---

## decision: route-to-service mapping pattern

**context:** Organizing backend logic.

**options considered:**
- option a: logic directly in route handlers
- option b: separate `Router` objects calling dedicated `Service` functions

**choice:** option b

**why:** keeps routes thin (declarative mapping) and services focused on business logic, making the code easier to test and navigate.

---



