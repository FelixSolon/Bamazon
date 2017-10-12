//set up all my requirements
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table')
//You don't get to see my password. Get your own dang MySql table :-p
var password = require("./password.js");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",

  //Ok, yes, this is dumb, but it works.
  password: password.password,
  database: "bamazon"
});

//Write my functions early
//ToDo: Throw this into a file and require it
function updateStock(unitsRemaining, id, totalSales){
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

    }
  );

}

//The master function that runs everything on the Customer side.
function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    //Stock code.
    if (err) throw err;
    
    //create an array to give customers choices later
    var inquirerArray = [];

    //Throw my result into a separate variable, just to make sure the wrong thing doesn't get called later.
    //Pretty sure I'm not using this any more after some refactoring but don't want to change all the references to it.
    var result = res;

    //Create an array to hold the things the customer will actually see
    var customerView = [];

    //Programatically generate ID choices for Inquirer
    for (var i = 0; i < result.length; i++) {
        
        //Left to my own devices, I'd do result[i].product_name for UX reasons and change code as necessary later
        //But the spec says to let them pick the ID.
        //So they can pick a number.
        inquirerArray.push(String(result[i].item_id));
        
        //Up next, generate an array that doesn't show total sales, as the customers don't need to know that.
        //This took more time than I'd like to admit.

        //Creates an empty object in position "i" because of the for loop
        customerView.push({});

        //Sets the properties of that object to the properties of result
        //Because trying to strip out the "product_sales" field from the result object meant my SQL wouldn't update it later.
        //Also this lets me make the table look fancier by having actual strings, not item_id or whatever as the title.
        customerView[i]["Item ID"] = result[i].item_id;
        customerView[i]["Product Name"] = result[i].product_name;
        customerView[i].Price = result[i].price;
        //There used to be a "total in stock" number here, but the spec doesn't call for it
        //So I took it out, even though as a customer I'd like to know if there's only like 1 left available.
    }

    //leave an extra space so it's pretty, then log the table.
    console.log("");
    console.table(customerView);

    //Start asking questions
    inquirer.prompt([
    {
        type: 'list',
        name: "idPrompt",
        message: 'What is the ID of the product you wish to buy?',
        //Honestly, I can't believe this worked but I'm quite happy that it did.
        //This way, I don't have to update the "choices" property every time the table updates.
        choices: inquirerArray
    }
    ]).then(function(answer){
        //for ease of reference, throw the prompt into a variable.
        var itemId = answer.idPrompt;

        //for recursion purposes.
        //I should really define this outside the .then, but I don't want to refactor that much at the moment.
        //ToDo: Find motivation to refactor.
        function unitInput(){
            inquirer.prompt([
            {
                type: 'input',
                name: "units",
                message: "How many would you like to buy?"
            }
            ]).then(function(answer){

                //Make sure that it's actually a number
                var units=parseInt(answer.units);

                //If someone types in something that isn't a number, yell at them then ask again.
                //I'm sure there's a library that can turn "Thirty Four" into 34, but I haven't gone looking yet.
                if(isNaN(units)){
                    console.log("\nPlease enter a number\n");
                    unitInput();
                } else {
                    //I am so glad I randomly looked up arrow functions earlier
                    //Sets a badly-named variable (left over from previous versions) that is an object which, somewhere in it, has a property item_id the value of which matches itemId parsed as a number
                    //There probably should be some kind of validation to make sure it doesn't select multiple things
                    //But it's looking for the primary key
                    //So if it finds multiple results I have larger issues.
                    var unitsAvailable = result.find(x => x.item_id === parseInt(itemId));

                    //Find the price of the item, make sure it's acting like a number, and that it's not $5.98000000000004
                    var unitPrice = parseFloat(unitsAvailable.price).toFixed(2);

                    //Figure out the cost of this transaction to display for the user
                    var transactionSales = units * unitPrice;

                    //Figure out the total sales to update the database
                    var totalSales = transactionSales + unitsAvailable.product_sales;

                    //Pop an error if someone tries to buy things into negative numbers.
                    if(units > unitsAvailable.stock_quantity){
                        console.log("\nInsufficient Quantity!\n");

                        //And no, you don't get to leave until you buy something or use CTRL-C.
                        unitInput();
                    } else {
                        //Figure out the new total on hand to update the DB.
                        var newTotal = unitsAvailable.stock_quantity - units

                        //Run the update function.
                        updateStock(newTotal, parseInt(itemId), totalSales)

                        //Give some feedback
                        console.log("Order Placed!");
                        console.log("Your total is $" + transactionSales.toFixed(2))
                        
                        //Make sure the connection ends.
                        connection.end();
                    };
                };
                
            })
            };
        //Actually run the unitInput function
        unitInput();
    });
  });
};

//Run the master function
afterConnection();
