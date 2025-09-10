
-- 1. users (เก็บข้อมูลผู้ใช้)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer'
);

INSERT INTO users (name, email, password, role) VALUES
('Alice', 'alice@example.com', 'hashed_password1', 'customer'),
('Bob', 'bob@example.com', 'hashed_password2', 'customer'),
('Admin', 'admin@example.com', 'hashed_password3', 'admin');

-- 2. categories (หมวดหมู่เครป)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO categories (name) VALUES
('Sweet Crepes'),
('Savory Crepes'),
('Special Menu');

-- 3. products (เก็บข้อมูลเครป)
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO products (name, description, price, image_url, category_id) VALUES
('Strawberry Crepe', 'Crepe with fresh strawberries and cream', 89.00, 'strawberry.jpg', 1),
('Banana Nutella Crepe', 'Crepe with banana and Nutella', 99.00, 'banana_nutella.jpg', 1),
('Ham & Cheese Crepe', 'Savory crepe with ham and cheese', 109.00, 'ham_cheese.jpg', 2);

-- 4. orders (ออเดอร์)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','paid','preparing','completed','cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO orders (user_id, total_price, status) VALUES
(1, 188.00, 'paid'),
(2, 109.00, 'pending');

-- 5. order_items (รายละเอียดสินค้าในออเดอร์)
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 89.00),   -- Alice สั่ง Strawberry Crepe 1 ชิ้น
(1, 2, 1, 99.00),   -- Alice สั่ง Banana Nutella Crepe 1 ชิ้น
(2, 3, 1, 109.00);  -- Bob สั่ง Ham & Cheese Crepe 1 ชิ้น

-- 6. toppings (ท็อปปิ้งเพิ่ม)
CREATE TABLE toppings (
    topping_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

INSERT INTO toppings (name, price) VALUES
('Whipped Cream', 10.00),
('Chocolate Sauce', 15.00),
('Almonds', 20.00);

-- 7. order_toppings (ท็อปปิ้งที่เลือกในออเดอร์)
CREATE TABLE order_toppings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    topping_id INT NOT NULL,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (topping_id) REFERENCES toppings(topping_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO toppings (name, price) VALUES
('Whipped Cream', 10.00),
('Chocolate Sauce', 15.00),
('Almonds', 20.00);