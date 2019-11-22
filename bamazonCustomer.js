const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

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
});

var displayProducts = function () {
    var query = "Select * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var displayTable = new Table({
            head: ["Item ID", "Product", "Category", "Price", "Quantity Available"],
            colWidths: [10, 25, 25, 5, 25]
        });
        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        purchasePrompt();
    });
}

function purchasePrompt() {
    inquirer.prompt([
        {
            name: "ID",
            type: "input",
            message: "Enter Item ID you wish to purchase: ",
            filter: Number
        },
        {
            name: "Quantity",
            type: "input",
            message: "Enter number of items you wish to purchase: ",
            filter: Number
        },

    ]).then(function (userAnswer) {
        var requestedID = userAnswer.ID;
        var requestedQuantity = userAnswer.Quantity;
        purchaseOrder(requestedID, requestedQuantity);
    });
};

function purchaseOrder(ID, Quantity) {
    var query = "Select * FROM products WHERE item_id = " + ID
    connection.query(query, function (err, res) {
        if (err) throw err;

        if (Quantity <= res[0].stock_quantity) {
            var totalCost = res[0].price * Quantity;
            console.log("Good news! Your item is in stock." + "\nYour total cost for " + Quantity + " orders of " + res[0].product_name + " is $" + totalCost + ". Thank you for your purchase!");

            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + Quantity + "WHERE item_id = " + ID);

        } else {
            console.log("We are sorry, but our current inventory of " + res[0].product_name + " is insufficient to complete your order.");
        };
        displayProducts();
    });
};

displayProducts(); 