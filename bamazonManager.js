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

//Directly stolen from the customer one.
//ToDo: Export this so I can require it
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

function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var inquirerArray = [];
    console.table(res);
    connection.end()
    });
};

function viewLowInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var inquirerArray = [];
    for (i=0; i < res.length; i++){
        if (parseInt(res[i].stock_quantity) < 5){
            inquirerArray.push(res[i]);
        };
    };
    console.table(inquirerArray);
    connection.end()
    });
};

function addToInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var inquirerArray = [];
    var result = res;
    for (i=0; i < res.length; i++){
        inquirerArray.push(res[i].product_name);
    };
    inquirer.prompt([
    {
        name: "chosenProduct",
        type: "list",
        message: "What product would you like to add?",
        choices: inquirerArray
    },
    {
        name: "productAmount",
        type: "input",
        message: "How many would you like to add?"
    }
    ]).then(function(answer){
        var units=parseInt(answer.productAmount);
        console.log(units)
                if(isNaN(units)){
                    console.log("\nPlease enter a number\n");
                    addToInventory();
                } else {
                    var unitsAvailable = result.find(x => x.product_name === answer.chosenProduct)
                    console.log("UA " + unitsAvailable)
                    var newTotal = unitsAvailable.stock_quantity + units
                    updateStock(newTotal, unitsAvailable.item_id)
                    console.log(newTotal);
                    connection.end();
                };
    });
    });
};

function addNewProduct(){
    inquirer.prompt([
    {
        name: "productName",
        type: "input",
        message: "What is the name of the product you want to add?"
    },
    {
        name: "productPrice",
        type: "input",
        message: "How much does it cost?"
    },
    {
        name: "productStartingAmount",
        type: "input",
        message: "How many do you have?"
    },
    {
        name: "productDepartment",
        type: "input",
        message: "Which department does it belong in?"
    }
    ]).then(function(answer){
        var query = connection.query("INSERT INTO products SET ?",
        {
            product_name: answer.productName,
            price: answer.productPrice,
            stock_quantity: answer.productStartingAmount,
            department_name: answer.productDepartment
        },
        function(err, res){
            console.log(err);
            console.log(res);
            connection.end();
        });
    });
};

function start(){
    inquirer.prompt([
    {
        name: "menu",
        message: "Select your operation:",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
    ]).then(function(answer){
        console.log(answer);
        switch (answer.menu){
            case "View Products for Sale":
            viewProducts();
            break;
            case "View Low Inventory":
            viewLowInventory();
            break;
            case "Add to Inventory":
            addToInventory();
            break;
            case "Add New Product":
            addNewProduct();
            break;
            default:
                console.log("I'm sorry, please try again.")
                start();
        }
    });
};

start();
