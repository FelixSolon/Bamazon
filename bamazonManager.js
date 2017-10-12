//Require all necessary and fun packages.
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table')

//Hide the password from inquiring eyes
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
    });
}

function viewProducts(){
    //Select only the things in the spec from the products table
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;
    //log the result in a table.
    console.table(res);
    connection.end()
    });
};

function viewLowInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    //make an array to hold what proucts I need to display
    var productArray = [];
    for (i=0; i < res.length; i++){
        //If something in the products table has fewer than 5 on hand...
        if (parseInt(res[i].stock_quantity) < 5){
            //...add that to the productArray
            productArray.push(res[i]);
        };
    };
    //Log the product array as a table
    console.table(productArray);
    connection.end()
    });
};

function addToInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var inquirerArray = [];
        var result = res;
        //This is how I would do it in the Customer side if left to my own devices, where it lets you choose the actual product, not an ID.
        for (i=0; i < res.length; i++){
            inquirerArray.push(res[i].product_name);
        };
        inquirer.prompt([
        {
            name: "chosenProduct",
            type: "list",
            message: "What product would you like to add?",
            choices: inquirerArray
        }
        ]).then(function(answer){
            //create a holding variable so I can look back to this later.
            var holding = answer;
            //define a function inside a function because Scope or something
            //Not because I forgot to do it earlier and can't be bothered to refactor.
            function amountPrompt(answer){
                inquirer.prompt([
                {
                name: "productAmount",
                type: "input",
                message: "How many would you like to add?"
                }
                ]).then(function(answer){
                    //Make the input answer into a number, not a string, because Javascript does weird things when mixing the two.
                    var units=parseInt(answer.productAmount);
                    //Make really sure that it's actually a number, and yell at people if it isn't before making them try again.
                    if(isNaN(units)){
                        console.log("\nPlease enter a number\n");
                        amountPrompt();
                    } else {
                        //As with the customer file, find the chosen product object.
                        var unitsAvailable = result.find(x => x.product_name === holding.chosenProduct)
                        //Do math to the on-hands to update
                        var newTotal = unitsAvailable.stock_quantity + units
                        //Run the update
                        updateStock(newTotal, unitsAvailable.item_id)
                        //Give feedback
                        console.log("There are now " + newTotal + " " + unitsAvailable.product_name + " on hand.");
                        connection.end();
                    };
                });
            };
            //call the just-defined function
            amountPrompt(holding);      
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
        //ToDo: Figure out how inquirer validate functions work so I can make sure that productPrice and productStartingAmount are numbers
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
        var holding = answer;
        var query = connection.query("INSERT INTO products SET ?",
        {
            product_name: answer.productName,
            price: answer.productPrice,
            stock_quantity: answer.productStartingAmount,
            department_name: answer.productDepartment
        },
        function(err, res){
            console.log("Added " + holding.productName + " to the system!");
            connection.end();
        });
    });
};

//Actually run something in this whole gigantic file.
function start(){
    inquirer.prompt([
    {
        name: "menu",
        message: "Select your operation:",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
    ]).then(function(answer){
        //I feel like there ought to be a way in Inquirer to get it to return what number option was chosen
        //Rather than having to feed the entire string of the choice in
        //But I haven't figured it out yet.
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
            //It's a list. There's no way it can possibly go to the default option.
            //But just in case...
            default:
                console.log("I'm sorry, please try again.")
                start();
        };
    });
};

start();
