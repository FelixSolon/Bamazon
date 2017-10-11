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

inquirer.prompt([
{
    name: "menu",
    message: "Select your operation:",
    type: "list",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
}
]).then(function(answer){

});