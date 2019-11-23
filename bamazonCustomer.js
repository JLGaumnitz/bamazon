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

    bamazon()
});

// Begin Display Inventory Table
function bamazon() {

    connection.query("Select * FROM products", function (err, res) {
        if (err) throw err;

        var displayTable = new Table({
            head: ["Item ID", "Product", "Department", "Price", "Quantity Available"],
            colWidths: [10, 25, 25, 10, 25]
        });

        for (var i = 0; i < res.length; i++) {
            displayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }

        console.log(displayTable.toString());
        // End Display Inventory Table

        // Prompt Customer's Input
        inquirer
            .prompt([
                {
                    name: "ID",
                    type: "input",
                    message: "Enter Item ID you wish to purchase: ",
                    filter: Number,
                },
                {
                    name: "Quantity",
                    type: "input",
                    message: "Enter number of items you wish to purchase: ",
                    filter: Number
                },

            ])
            .then(function (userAnswer) {
                var itemID = userAnswer.ID;
                var quantity = userAnswer.Quantity;

                connection.query("SELECT * FROM products WHERE item_id=" + itemID, function (err, res) {
                    if (err) throw err;

                    if (res[0].stock_quantity - quantity >= 0) {

                        var totalCost = (res[0].price * quantity).toFixed(2);

                        console.log("Good news! Your item is in stock." + "\nYour total cost for " + FgYellow + quantity + FgWhite + " order(s) of '" + res[0].product_name + "' is " + FgGreen + "$" + totalCost + FgWhite + ". " + BgBlue + "Thank you for your purchase!" + FgWhite);

                        // Query to remove purchased item(s) from database
                        connection.query("UPDATE products SET stock_quantity=? WHERE item_id = ?", [res[0].stock_quantity - quantity, itemID]);

                        // Runs the function again, so the customer can continue shopping
                        newPurchasePrompt()

                    }

                    else {
                        console.log(BgRed + "We are sorry, but our current inventory of '" + res[0].product_name + "' is insufficient to complete your order. \nPlease make a different selection or reduce your quantity." + FgWhite),

                            // Runs the function again, so the customer can continue shopping
                            newPurchasePrompt()

                    }

                });
            });
    });
}

function newPurchasePrompt() {
    inquirer.
        prompt([{
            message: "Would you like to make another purchase?",
            name: "choice",
            type: "confirm"
        }]).
        then(user => {
            if (user.choice) {
                bamazon();
            } else {
                connection.end()
            }
        })
}
