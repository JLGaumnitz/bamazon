const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

// Text and background colors (learned from this Stack Overflow post: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color)
const FgWhite = "\x1b[0m";
const FgCyan = "\x1b[36m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const BgRed = "\x1b[41m";
const BgBlue = "\x1b[44m";

const displayTable = new Table({
    head: ["Item ID", "Product", "Department", "Price", "Quantity Available"],
    colWidths: [10, 25, 25, 10, 25]
});

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);

    startManagerTasks()

});

function startManagerTasks() {
    inquirer
        .prompt([{
            name: "selection",
            message: "Manager Tasks \nWhat would you like to do?",
            type: "list",
            choices: ["View all products in inventory",
                "View low inventory",
                "Add to inventory",
                "Add a new product",
                "Exit"]
        }])
        .then(manager => {
            switch (manager.selection) {
                case 'View all products in inventory':
                    listProducts();
                    break;
                case 'View low inventory':
                    lowInventory(5);
                    break;
                case 'Add to inventory':
                    addInventory();
                    break;
                case 'Add a new product':
                    addProduct();
                    break;
                case 'Exit':
                    return connection.end();
                default:
                    break;
            }
        })
}

// Function to list all products and their quantities
function listProducts() {

    connection.query("Select * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());

        newCommandPrompt()
    });
}

// Function to view products with low inventory (fewer than 5 items in inventory)
function lowInventory() {
    var sql = `SELECT * FROM products GROUP BY item_id HAVING stock_quantity < 5`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        results.forEach(element => {
            displayTable.push(
                [element.item_id, element.product_name, element.department_name, "$" + element.price, element.stock_quantity]
            )
        });
        console.log(displayTable.toString())
        displayTable.splice(0, displayTable.length);

        newCommandPrompt()
    });
}

// Function to add more stock to a specific item in inventory
function addInventory() {
    connection.query("SELECT * FROM products", (err, res) => {
        inquirer
            .prompt([{
                name: "item",
                message: "Name of item to add?",
                type: "list",
                choices: () => {
                    var choiceArray = [];
                    res.forEach((element, i) => {
                        choiceArray.push(i + 1 + ": " + element.product_name)
                    });
                    return choiceArray;
                }
            },
            {
                name: "quantity",
                message: "Quantity to add?",
                validate: (value) => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }])
            .then(answer => {
                var itemToBeAdded;
                res.forEach(element => {
                    if (element.product_name === answer.item.split(": ").pop()) { // <- pops off the number and : from answer (Thanks to TA Tim Lukens for this tip!)
                        itemToBeAdded = element;
                    }
                });
                var currentStock = parseInt(itemToBeAdded.stock_quantity);
                var newStock = parseInt(currentStock) + parseInt(answer.quantity);
                connection.query("UPDATE products SET stock_quantity =" + newStock + " WHERE item_id = " + itemToBeAdded.item_id, (err, res) => {
                    if (err) throw err;
                    console.log(`Increased ${itemToBeAdded.product_name} stock by ${answer.quantity}. \nNew stock quantity: ${newStock}`)

                    newCommandPrompt();
                })
            })
    })
}

// Function to add a new product to the database
function addProduct() {
    inquirer
        .prompt([{
            name: "item",
            message: "New item to be added?",
            type: "input"
        },
        {
            name: "department",
            message: "Which department does the new item fall under?",
            type: "list",
            choices: ["Horse Tack", "Rider Gear", "Barn Equipment"]
        },
        {
            name: "price",
            message: "What is the price of the new item?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "initialStockOrder",
            type: "input",
            message: "Quantity of initial order for the new item?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "itemID",
            type: Number,
            message: "Assign a unique item number (1s are Horse Tack; 2s are Rider Gear; 3s are Barn Equipment):"
        }
        ])
        // Item is taken from the answers and inserted into the database
        .then(newProduct => {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    item_id: newProduct.itemID,
                    product_name: newProduct.item,
                    department_name: newProduct.department,
                    price: newProduct.price,
                    stock_quantity: newProduct.initialStockOrder
                },
                function (err) {
                    if (err) throw err;
                    console.log(BgBlue + `The following order has been placed: \n${newProduct.initialStockOrder} of ${newProduct.item}, under the department ${newProduct.department}, with a price of $ ${newProduct.price}` + FgWhite)

                    newCommandPrompt();
                }
            )
        });

    }

    // Take Manager back to list of tasks or exits
    function newCommandPrompt() {
        inquirer.
            prompt([{
                name: "choice",
                message: "Would you like to complete another task?",
                type: "confirm"
            }]).
            then(user => {
                if (user.choice) {
                    startManagerTasks();
                } else {
                    connection.end()
                }
            })
    }
