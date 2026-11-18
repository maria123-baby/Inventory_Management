
CREATE TABLE  IF NOT EXISTS  users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  IF NOT EXISTS products(product_id INT PRIMARY KEY, product_code VARCHAR(30) NOT NULL UNIQUE,
sku_barcode VARCHAR(30), product_name VARCHAR(50) NOT NULL, category VARCHAR(50),brand VARCHAR(30), unit VARCHAR(30),
display_order INT DEFAULT 0, display_group VARCHAR(50), active BOOLEAN DEFAULT TRUE,
display_in_pos BOOLEAN DEFAULT TRUE, customer_card BOOLEAN DEFAULT FALSE, price DECIMAL(10,2), selling_price DECIMAL(10,2),
tax_inclusive BOOLEAN DEFAULT FALSE, sellable BOOLEAN DEFAULT TRUE, redeemable BOOLEAN DEFAULT FALSE,
point_value DECIMAL(10,2), cost_per_point DECIMAL(10,2), barcode VARCHAR(50), minimum_stock INT DEFAULT 0,
tax_category VARCHAR(50), tax_percentage DECIMAL(5,2), tax DECIMAL(10,2), price_no_tax DECIMAL(10,2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);