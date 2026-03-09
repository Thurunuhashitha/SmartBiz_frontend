# SmartBiz Frontend

The frontend for SmartBiz is a modern, responsive Single Page Application (SPA) built using React and Vite, designed to provide a seamless user experience for business management.

## Key Technologies
- **React**: Component-based UI library.
- **Vite**: Rapid development build tool.
- **React Router**: Client-side navigation Handling.
- **Axios**: HTTP client for API communication.
- **CSS**: Custom vanilla CSS for high-performance styling.

## Folder Structure
- `src/app/`: Core application setup including the main [App.jsx](file:///d:/Runing Projects/SmartBiz/SmartBiz_frontend/src/app/App.jsx).
- `src/components/`: Reusable UI components.
- `src/pages/`: Page-level components organized by feature:
    - `admin/`: System management controls.
    - `ai/`: AI insights and reporting interface.
    - `customer/`: Customer management and sales entry.
    - `expenses/`: Financial tracking UI.
    - `login/` / `register/`: Authentication views.
    - `product and stock/`: Inventory management dashboard.
    - `sales/`: Transaction history and processing.
    - `sapplier/`: Supplier management.
- `src/assets/`: Static assets like images and icons.
- `src/styles/`: Global and component-specific stylesheets.

## API Integration
The frontend communicates with the backend API (running on port 3000 by default) using Axios. All requests are routed through a central base configuration to ensure consistency and easy proxy management.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Features
- **Interactive Dashboards**: Real-time view of business performance.
- **Dynamic Forms**: Easy entry for sales, inventory, and expenses.
- **Responsive Design**: Accessible from desktops, tablets, and mobile devices.
- **AI Sidebar/Reporting**: Direct access to AI-powered business intelligence.
