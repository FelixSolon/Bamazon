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

function updateStock(unitsRemaining, id){
    console.log("Updating all item quantities...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
        {
            stock_quantity: unitsRemaining
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
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var inquirerArray = [];
    console.table(res);
    var result = res;
    //this might work
    for (var i = 0; i < res.length; i++) {
        //Programatically generate ID choices
        inquirerArray.push(String(res[i].item_id));
    }
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
                    var unitsAvailable = result.find(x => x.item_id === parseInt(itemId))
                    if(units > unitsAvailable.stock_quantity){
                        console.log("Insufficient Quantity!");
                    } else {
                        var newTotal = unitsAvailable.stock_quantity - units
                        updateStock(newTotal, parseInt(itemId))
                        console.log(newTotal);
                        connection.end();
                    }
                };
                //I am so glad I randomly looked up arrow functions earlier today
                
            })
            };
        unitInput();
    });
    
  });
}

afterConnection()
