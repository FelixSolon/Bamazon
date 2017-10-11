var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table')
var password = require("./password.js");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: password.password,
  database: "bamazon"
});

function updateStock(unitsRemaining, id, totalSales){
    console.log("Updating all item quantities...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
        {
            stock_quantity: unitsRemaining,
            product_sales: totalSales
        },
        {
            item_id: id
        }
        ],
        function(err, res) {
            console.log("Order Placed!");
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function afterConnection() {
    //originally was SELECT * etc.
    //But working on the bamazonSupervisor.js, I figure customers don't need to see *all* the data.
  connection.query("SELECT item_id, product_name, price, stock_quantity, product_sales FROM products", function(err, res) {
    if (err) throw err;
    var inquirerArray = [];
    var result = res;
    var customerView = [];
    //this might work
    for (var i = 0; i < result.length; i++) {
        //Programatically generate ID choices
        inquirerArray.push(String(result[i].item_id));
        //Generate an array that doesn't show total sales, as the customers don't need to know that.
        //This took more time than I'd like to admit.
        //Creates an empty object in position "i"
        customerView.push({});
        //sets the properties of that object to the properties of result
        //Because trying to strip out the "product_sales" field from the result object meant my SQL wouldn't update it later.
        customerView[i].item_id = result[i].item_id;
        customerView[i].product_name = result[i].product_name;
        customerView[i].price = result[i].price;
        customerView[i].stock_quantity = result[i].stock_quantity;
    }
    console.table(customerView);
    inquirer.prompt([
    {
        type: 'list',
        name: "idPrompt",
        message: 'What is the ID of the product you wish to buy?',
        //Honestly, I can't believe this worked.
        choices: inquirerArray
    }
    ]).then(function(answer){
        var itemId = answer.idPrompt;
        //for recursion purposes
        function unitInput(){
            inquirer.prompt([
            {
                type: 'input',
                name: "units",
                message: "How many would you like to buy?"
            }
            ]).then(function(answer){
                var units=parseInt(answer.units);
                if(isNaN(units)){
                    console.log("\nPlease enter a number\n");
                    unitInput();
                } else {
                    //I am so glad I randomly looked up arrow functions earlier
                    var unitsAvailable = result.find(x => x.item_id === parseInt(itemId));
                    var unitPrice = parseFloat(unitsAvailable.price);
                    console.log("Unit Price: " + unitPrice);
                    var transactionSales = units * unitPrice;
                    var totalSales = transactionSales + unitsAvailable.product_sales;
                    if(units > unitsAvailable.stock_quantity){
                        console.log("Insufficient Quantity!");
                    } else {
                        var newTotal = unitsAvailable.stock_quantity - units
                        updateStock(newTotal, parseInt(itemId), totalSales)
                        console.log(newTotal);
                        connection.end();
                    }
                };
                
            })
            };
        unitInput();
    });
    
  });
}

afterConnection()
