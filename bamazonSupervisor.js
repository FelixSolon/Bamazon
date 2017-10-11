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

function viewSales(){
    connection.query("SELECT departments.department_id AS 'ID#', departments.department_name AS 'Department Name', departments.over_head_costs AS Overhead, sum(products.product_sales) AS 'Total Sales', products.product_sales- departments.over_head_costs AS 'Total Profit' FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_id;", 
    function(err, res) {
    if (err) throw err;
    console.table(res);
    connection.end()
    });
};

inquirer.prompt([
{
    type: 'list',
    name: 'supervisorChoice',
    message: "Choose your option",
    choices: ["View Product Sales by Department", "Create New Department"]
}
]).then(function(answer){
    //You can have my switch statements when you pry them from my cold, dead hands.
    switch (answer.supervisorChoice){
        case "View Product Sales by Department":
        viewSales();
        break;
        case "Create New Department":


    }

});