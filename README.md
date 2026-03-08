# SmartBiz

**SmartBiz** is a full-stack web application designed as a comprehensive Business Management / ERP (Enterprise Resource Planning) or Point-of-Sale (POS) system. It is built to handle multiple business operations including inventory, sales, expenses, and user management.

## Project Structure

### 1. Backend (`SmartBiz_backend`)
The backend is a RESTful API built with **Node.js** and **Express.js**.
- **Database:** It uses **MySQL** (via the `mysql2` package) to store and manage data.
- **Authentication & Security:** It secures user access using `bcrypt` for password hashing and `jsonwebtoken` (JWT) for secure authentication.
- **Core Modules (Routes):** Based on the `index.js` file, the backend is organized into several key operational areas:
  - **Auth:** For login, registration, and session management.
  - **Products & Suppliers:** For inventory management, tracking items, and managing the supply chain.
  - **Sales & Customers:** For processing transactions, recording sales, and managing a customer database.
  - **Expenses:** For tracking business costs and financial outflows.
  - **Admin:** Likely for role-based access control and system-wide configurations.

### 2. Frontend (`SmartBiz_frontend`)
The frontend is a modern Single Page Application (SPA) built using **React**.
- **Build Tool:** It is bootstrapped using **Vite**, ensuring fast development server startup and optimized production builds.
- **Routing:** Uses **React Router** (`react-router-dom`) to handle client-side page navigation without reloading the browser.
- **API Integration:** Uses **Axios** to securely communicate with the Express backend to fetch and submit business data.
- **Code Quality:** It includes a pre-configured ESLint setup to maintain clean and consistent code standards.

In summary, it's a strongly decoupled, modern web application where the React frontend serves as the user interface and interacts dynamically with a secured Node.js/MySQL API that centralizes the core business logic.
