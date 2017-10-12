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
    //I feel simultaneously like a bad person for writing a query like this
    //And *super* accomplished that I actually got it working.
    connection.query("SELECT departments.department_id AS 'ID#', departments.department_name AS 'Department Name', departments.over_head_costs AS Overhead, COALESCE(sum(products.product_sales), '0.00') AS 'Total Sales', COALESCE(products.product_sales- departments.over_head_costs, 0.00- departments.over_head_costs) AS 'Total Profit' FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_id;", 
    function(err, res) {
    if (err) throw err;
    console.table(res);
    connection.end()
    });
};

function addNewDepartment(){
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What is the name of the department you want to add?"
        }
        ]).then(function(answer){
            function overheadPrompt(){
                var deptName = answer.departmentName;
                inquirer.prompt([
                {
                    name: "overhead",
                    type: "input",
                    message: "How much is the overhead?"
                }
            ]).then(function(answer){
                var overhead=parseFloat(answer.overhead).toFixed(2);
                //If someone types in something that isn't a number, yell at them then ask again.
                //I'm sure there's a library that can turn "Thirty Four" into 34, but I haven't gone looking yet.
                if(isNaN(overhead)){
                    console.log("\nPlease enter a number\n");
                    overheadPrompt();
                } else {
                    var query = connection.query("INSERT INTO departments SET ?",
                    {
                        department_name: deptName,
                        over_head_costs: answer.overhead
                    },
                    function(err, res){
                        console.log("New Department " + deptName + " added!");
                        connection.end();
                    });
                };
            });
        };
        overheadPrompt();
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
        addNewDepartment();

    }

});