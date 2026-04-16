-- ============================================================
-- Flipkart Clone - MySQL Database Schema + Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS flipkart_clone;
USE flipkart_clone;

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  specifications JSON,
  price DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discounted_price DECIMAL(10, 2) GENERATED ALWAYS AS (
    ROUND(price - (price * discount_percent / 100), 2)
  ) STORED,
  stock INT NOT NULL DEFAULT 0,
  brand VARCHAR(100),
  images JSON,          -- JSON array of image URLs
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Performance indexes for fast product listing
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_name_brand ON products (name, brand);

-- ============================================================
-- TABLE: cart
-- ============================================================
CREATE TABLE IF NOT EXISTS cart (
  id VARCHAR(36) PRIMARY KEY,   -- UUID
  session_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: cart_items
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id VARCHAR(36) NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_product (cart_id, product_id)
);

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,   -- UUID
  cart_id VARCHAR(36),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'confirmed',
  payment_method ENUM('cod', 'online') DEFAULT 'cod',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- ============================================================
-- SEED: categories
-- ============================================================
INSERT IGNORE INTO categories (name, slug, icon) VALUES
('Electronics', 'electronics', '📱'),
('Fashion', 'fashion', '👕'),
('Home & Furniture', 'home-furniture', '🛋️'),
('Appliances', 'appliances', '🏠'),
('Books', 'books', '📚'),
('Toys & Games', 'toys-games', '🎮'),
('Sports & Fitness', 'sports-fitness', '⚽'),
('Grocery', 'grocery', '🛒');

-- ============================================================
-- SEED: products
-- ============================================================
INSERT IGNORE INTO products (category_id, name, description, specifications, price, discount_percent, stock, brand, images, rating, review_count) VALUES

-- Electronics
(1, 'Samsung Galaxy S24 Ultra',
 'Experience the next generation of Galaxy with the most powerful Galaxy ever. Embedded S Pen, advanced AI features, and a stunning 6.8-inch display.',
 '{"Display": "6.8 inch Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "RAM": "12GB", "Storage": "256GB", "Battery": "5000mAh", "Camera": "200MP + 12MP + 10MP + 10MP", "OS": "Android 14"}',
 124999, 15, 50, 'Samsung',
 '["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600", "https://images.unsplash.com/photo-1598327105854-c8674faddf79?w=600"]',
 4.5, 2847),

(1, 'Apple iPhone 15 Pro Max',
 'iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system ever.',
 '{"Display": "6.7 inch Super Retina XDR", "Processor": "A17 Pro", "RAM": "8GB", "Storage": "256GB", "Battery": "4422mAh", "Camera": "48MP + 12MP + 12MP", "OS": "iOS 17"}',
 159900, 10, 35, 'Apple',
 '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600", "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600"]',
 4.7, 5123),

(1, 'OnePlus 12 5G',
 'OnePlus 12 with Snapdragon 8 Gen 3 processor, 50MP Hasselblad camera, and 100W SUPERVOOC fast charging.',
 '{"Display": "6.82 inch LTPO AMOLED", "Processor": "Snapdragon 8 Gen 3", "RAM": "12GB", "Storage": "256GB", "Battery": "5400mAh", "Camera": "50MP + 48MP + 64MP", "OS": "OxygenOS 14"}',
 64999, 20, 80, 'OnePlus',
 '["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600"]',
 4.4, 1893),

(1, 'Sony WH-1000XM5 Headphones',
 'Industry Leading Noise Canceling Headphones with exceptional sound quality, 30-hour battery life, and multipoint connection.',
 '{"Driver": "30mm", "Frequency": "4Hz-40,000Hz", "Battery": "30 hours", "Connectivity": "Bluetooth 5.2", "Weight": "250g", "Noise Cancelling": "Yes"}',
 29990, 25, 120, 'Sony',
 '["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"]',
 4.6, 3210),

(1, 'Dell XPS 15 Laptop',
 'Dell XPS 15 with 13th Gen Intel Core i9, NVIDIA GeForce RTX 4070, 32GB RAM and a gorgeous OLED display.',
 '{"Display": "15.6 inch 3.5K OLED", "Processor": "Intel Core i9-13900H", "RAM": "32GB DDR5", "Storage": "1TB NVMe SSD", "GPU": "NVIDIA RTX 4070", "OS": "Windows 11 Home"}',
 199990, 12, 20, 'Dell',
 '["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"]',
 4.5, 987),

-- Fashion
(2, 'Nike Air Max 270',
 'The Nike Air Max 270 delivers visible cushioning under every step with its large Air unit and Max heel cushion.',
 '{"Material": "Mesh + Synthetic", "Sole": "Rubber", "Closure": "Lace-up", "Occasion": "Casual", "Care": "Machine Washable"}',
 12995, 30, 200, 'Nike',
 '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600"]',
 4.3, 4521),

(2, 'Levi''s 511 Slim Fit Jeans',
 'Levi''s 511 Slim Jeans sit below the waist with a slim fit through the seat and thigh, straight leg opening.',
 '{"Fit": "Slim", "Material": "99% Cotton, 1% Elastane", "Wash": "Dark Blue", "Occasion": "Casual", "Care": "Machine Wash"}',
 3999, 40, 300, 'Levis',
 '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"]',
 4.2, 2150),

-- Home & Furniture
(3, 'Wakefit Orthopaedic Memory Foam Mattress',
 'Experience a deep, comfortable sleep with Wakefit''s Orthopaedic Memory Foam Mattress, designed to support your spine perfectly.',
 '{"Size": "Queen (78x60 inches)", "Thickness": "6 inches", "Material": "Memory Foam", "Cover": "Quilted Fabric", "Warranty": "10 Years"}',
 15999, 45, 60, 'Wakefit',
 '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"]',
 4.4, 8920),

-- Appliances
(4, 'LG 1.5 Ton 5 Star Inverter AC',
 'LG 5-Star Dual Inverter Air Conditioner with HD filter and auto clean function for a cool and healthy environment.',
 '{"Capacity": "1.5 Ton", "Star Rating": "5 Star", "Type": "Split AC", "Compressor": "Dual Inverter", "Refrigerant": "R32", "Coverage": "150 sq. ft."}',
 49990, 22, 40, 'LG',
 '["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"]',
 4.3, 3421),

(4, 'Samsung 253L Double Door Refrigerator',
 'Samsung 253L frost-free double door refrigerator with digital inverter technology for energy savings.',
 '{"Capacity": "253 Litres", "Type": "Frost Free", "Star Rating": "3 Star", "Compressor": "Digital Inverter", "Warranty": "10 Year Compressor"}',
 28990, 18, 30, 'Samsung',
 '["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600"]',
 4.2, 2100),

-- Books
(5, 'Atomic Habits by James Clear',
 'An Easy and Proven Way to Build Good Habits and Break Bad Ones. Tiny Changes, Remarkable Results.',
 '{"Author": "James Clear", "Publisher": "Penguin Random House", "Pages": "320", "Language": "English", "ISBN": "9780735211292"}',
 699, 35, 500, 'Penguin',
 '["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600"]',
 4.8, 12450),

-- Sports
(7, 'Yonex Badminton Racket Astrox 88D',
 'Yonex Astrox 88D Pro - the benchmark for doubles play. Exceptional control and speed in one professional racket.',
 '{"Weight": "83g", "Balance": "Head Heavy", "Flexibility": "Stiff", "Material": "High Modulus Graphite", "String Tension": "Up to 35 lbs"}',
 8990, 15, 75, 'Yonex',
 '["https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=600"]',
 4.5, 890);
