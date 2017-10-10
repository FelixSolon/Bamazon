var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table')
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "7h3MY%QLru135",
  database: "bamazon"
});

/*connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  connection.end();
});*/

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var inquirerArray = [];
    console.table(res);
    //this might work
    for (var i = 0; i < res.length; i++) {
        inquirerArray.push(res[i].item_id);
        console.log(inquirerArray);
    }
    inquirer.prompt([
    {
        type: 'list',
        name: "idPrompt",
        message: 'What is the ID of the product you wish to buy?',
        choices: inquirerArray[3]
    }
    ]).then(function(answer){
        console.log(answer);
    });
    connection.end();
  });
}

afterConnection()
