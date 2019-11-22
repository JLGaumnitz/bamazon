DROP DATABASE IF EXISTS bamazon_db;

CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INT(4) NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(20) NOT NULL,
	PRIMARY KEY (item_id)
);

Select * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (101, "saddle", "horse tack", 600.00, 20),
	   (102, "head stall", "horse tack", 100.00, 20),
	   (103, "snaffle bit", "horse tack", 30.00, 20),
	   (104, "saddle pad", "horse tack", 150.00, 20),
	   (105, "girth", "horse tack", 100.00, 20),
	   (201, "riding boots", "rider gear", 150.00, 15),
	   (202, "breeches", "rider gear", 100.00, 15),
	   (203, "helmet", "rider gear", 150.00, 15),
	   (204, "riding gloves", "rider gear", 20.00, 15),
	   (205, "half chaps", "rider gear", 50.00, 10),
        (301, "muck rake", "barn equipment", 30.00, 10),
        (302, "push broom", "barn equipment", 30.00, 10),
        (303, "horse feed", "barn equipment", 20.00, 10),
        (304, "feed bucket", "barn equipment", 20.00, 10),
        (305, "water bucket", "barn equipment", 20.00, 10)