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
VALUES (101, "Saddle", "Horse Tack", 600.00, 20),
	   (102, "Head Stall", "Horse Tack", 100.00, 20),
	   (103, "Snaffle Bit", "Horse Tack", 30.00, 20),
	   (104, "Saddle Pad", "Horse Tack", 150.00, 20),
	   (105, "Girth", "Horse Tack", 100.00, 20),
	   (201, "Riding Boots", "Rider Gear", 150.00, 15),
	   (202, "Breeches", "Rider Gear", 100.00, 15),
	   (203, "Helmet", "Rider Gear", 150.00, 15),
	   (204, "Riding Gloves", "Rider Gear", 20.00, 15),
	   (205, "Half Chaps", "Rider Gear", 50.00, 10),
        (301, "Muck Rake", "Barn Equipment", 30.00, 10),
        (302, "Push Broom", "Barn Equipment", 30.00, 10),
        (303, "50-lb Bag of Horse Feed", "Barn Equipment", 20.00, 10),
        (304, "Feed Bucket", "Barn Equipment", 20.00, 10),
        (305, "Water Bucket", "Barn Equipment", 20.00, 10)