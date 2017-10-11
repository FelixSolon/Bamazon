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
            inquirerArray.push(res[i])
        };
    };
    console.table(inquirerArray);
    connection.end()
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

            break;
            case "Add New Product":

            break;
            default:
                console.log("I'm sorry, please try again.")
                start();
        }
    });
};

start();
