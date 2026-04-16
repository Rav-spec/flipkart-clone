# 🛒 Flipkart Clone — E-Commerce Web Application

A full-stack e-commerce platform replicating Flipkart's design and functionality, built as part of the SDE Intern Fullstack Assignment.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Hooks, Context API, React Router v6) |
| Backend | Node.js + Express.js (MVC architecture) |
| Database | MySQL 8/9 |
| Styling | Vanilla CSS (no frameworks) |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Icons | react-icons (Feather) |

---

## ✨ Features Implemented

### Core Features
- **Product Listing Page** — Grid layout, search by name/brand, filter by category, skeleton loaders
- **Product Detail Page** — Image carousel, specifications table, stock status, Add to Cart, Buy Now
- **Shopping Cart** — View/update/remove items, quantity controls, savings calculator, free delivery above ₹499
- **Order Placement** — Checkout form with address + payment, validation, order confirmation with ID

### Bonus Features
- **Order History** — View all past orders with expandable details
- **Responsive Design** — Mobile, tablet, and desktop layouts
- **URL-synced filters** — Search and category reflected in URL for shareability
- **Toast notifications** — Feedback on cart add, remove, errors

---

## 🗄️ Database Schema

```sql
categories     -- id, name, slug, icon
products       -- id, category_id (FK), name, description, specifications (JSON),
               --   price, discount_percent, discounted_price (generated), stock, brand,
               --   images (JSON), rating, review_count
cart           -- id (UUID), session_id
cart_items     -- id, cart_id (FK), product_id (FK), quantity
orders         -- id (UUID), cart_id, full_name, email, phone, address fields,
               --   total_amount, status, payment_method
order_items    -- id, order_id (FK), product_id (FK), product_name, product_image,
               --   quantity, unit_price, total_price
```

**Key design decisions:**
- `discounted_price` is a **generated/computed column** — always consistent with price + discount
- `images` and `specifications` stored as **JSON columns** for flexibility
- `cart` uses **UUID** so it works without user login
- `orders` uses a **MySQL transaction** (BEGIN → INSERT header → INSERT items → COMMIT) for atomicity
- Proper FK constraints with ON DELETE CASCADE/RESTRICT

---

## 📁 Project Structure

```
flipkart-clone/
├── backend/
│   ├── config/db.js              # MySQL connection pool (mysql2)
│   ├── controllers/              # Business logic layer
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── models/                   # Database query layer
│   │   ├── productModel.js
│   │   ├── categoryModel.js
│   │   ├── cartModel.js
│   │   └── orderModel.js
│   ├── routes/                   # Express routers
│   ├── middleware/
│   │   ├── validate.js           # express-validator results handler
│   │   └── errorHandler.js       # Global 404 + error handler
│   ├── database.sql              # Schema + seed data (12 products, 8 categories)
│   ├── setup-db.js               # One-command DB initialisation
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/index.js          # All Axios calls (single source of truth)
        ├── context/CartContext.js # Global cart state (useReducer + localStorage)
        ├── components/
        │   ├── Navbar.js         # Search bar + Cart/Orders badges
        │   ├── CategoryFilter.js # Horizontal scrollable chip bar
        │   ├── ProductCard.js    # Flipkart-style product card
        │   └── SkeletonGrid.js   # Shimmer loading placeholders
        └── pages/
            ├── Home.js           # Product listing with URL-synced filters
            ├── ProductDetail.js  # Detail page with image carousel
            ├── Cart.js           # Cart with quantity controls
            ├── Checkout.js       # Address form + payment selection
            ├── OrderConfirmation.js
            └── OrderHistory.js   # Past orders (expandable)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8.x or 9.x
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd flipkart-clone
```

### 2. Configure environment
Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flipkart_clone
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Set up database
```bash
cd backend
npm install
npm run setup
```
This creates the `flipkart_clone` database, all 6 tables, and seeds 12 products across 8 categories.

### 4. Start the backend
```bash
npm run dev
# → http://localhost:5000
# → ✅ MySQL Database connected successfully
```

### 5. Start the frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (search, category, pagination) |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/categories` | All categories |
| POST | `/api/cart` | Create cart |
| GET | `/api/cart/:id` | Get cart with items |
| POST | `/api/cart/:id/items` | Add item to cart |
| PUT | `/api/cart/:id/items/:itemId` | Update quantity |
| DELETE | `/api/cart/:id/items/:itemId` | Remove item |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/:id` | Get order detail |
| POST | `/api/orders/history` | Get multiple orders by IDs |

---

## 📝 Assumptions

1. **No authentication required** — A session-based cart UUID is created automatically on first visit and stored in `localStorage`. The system works for a single assumed user.
2. **Order history is client-side tracked** — Order IDs are saved in `localStorage` after placement, then fetched from the database. This avoids needing user accounts.
4. **Images** — Product images are sourced from Unsplash (free, no attribution required for development).
5. **Payment** — COD and Online Payment are UI options only. No actual payment gateway is integrated.
6. **Stock** — Stock count is checked on add-to-cart and order placement but not decremented (out of scope for MVP).

---

## 🧪 Sample Seed Data

8 categories: Electronics, Fashion, Home & Furniture, Appliances, Books, Toys & Games, Sports & Fitness, Grocery

12 products including:
- Samsung Galaxy S24 Ultra (₹1,06,249 — 15% off)
- Apple iPhone 15 Pro Max (₹1,43,910 — 10% off)
- OnePlus 12 5G (₹51,999 — 20% off)
- Sony WH-1000XM5 Headphones (₹22,492 — 25% off)
- Dell XPS 15 Laptop (₹1,75,991 — 12% off)
- Nike Air Max 270, Levi's 511 Jeans, Wakefit Mattress,
- LG 1.5 Ton AC, Samsung Refrigerator, Atomic Habits, Yonex Badminton Racket
