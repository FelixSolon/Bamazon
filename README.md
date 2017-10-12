# Bamazon
The MySQL Storefront App

## Walkthrough

### Bamazon Customer View

To run the customer program, navigate to the directory where the files have been installed and type node "bamazonCustomer.js" without the quotes.
![Inital View, Customer](/Walkthrough/bamazonCustomer.JPG)

This provides you with a list of all available products, with their ID and price, and prompts the customer to select the Item ID of the item they wish to order by using the arrow keys. Upon navigating to the ID of their choice, they press Enter to select it.
![Product Listing](/Walkthrough/customer1.JPG)

Upon selecting the ID, it prompts the customer to enter how many they wish to buy.
![Select order amount](/Walkthrough/customer2.JPG)

If the customer enters anything other than the digits 0-9, or enters a quantity more than is available in the store, they are shown an error message and prompted to enter a new number.
![Error handling](/Walkthrough/customerError.JPG)

Upon placing a valid order with sufficient quantities on hand, a confirmation is shown that the order was placed, and the total dollar amount of the purchase is displayed.
![Order confirmation](/Walkthrough/customer3.JPG)

### Bamazon Manager View

To run the manager program, navigate to the directory where the files have been installed and type "node bamazonManager.js" without the quotes.
![Inital View, Manager](/Walkthrough/bamazonManager.JPG)

This provides you with a list of various options. Choose with the arrow keys, and press Enter to select.
![Choices, Manager](/Walkthrough/manager1.JPG)

If 'View Products for Sale' is selected, it returns a table of all items in the store, with their ID number, name, price, and the amount on hand.
![View Products](/Walkthrough/manager2.JPG)

If 'View Low Inventory' is selected, a similar screen is displayed as before, but this time only displaying items with fewer than 3 units on hant, and including the department the product belongs to and total product sales.
![View Low Inventory](/Walkthrough/manager3.JPG)

If 'Add to Inventory' is selected, a list of all available products is generated, which can be scrolled through with arrow keys and selected with Enter.
![Add to Inventory](/Walkthrough/manager4.JPG)

When a product is selected, the manager is prompted for the quantity they wish to add to the on hand count. If anything other than the digits 0-9 are input, it asks them to enter a number and regenerates the prompt. Upon entering a number it gives feedback that the item quantites are updating and provides the new total.
![Quantity added and error handling](/Walkthrough/manager5.JPG)

When 'Add New Product' is selected, the program will ask the name of the product, the price of the product, the inital on hand quantity, and what department the product belongs to. It will then add the new product to the database and provide feedback that the product was added.
![Add Product](/Walkthrough/manager6.JPG)


### Bamazon Supervisor View


To run the manager program, navigate to the directory where the files have been installed and type "node bamazonManager.js" without the quotes.
![Inital View, Supervisor](/Walkthrough/bamazonSupervisor.JPG)

Two options are presented: View Product Sales by Department and Create New Department
![Choices, Supervisor](/Walkthrough/supervisor1.JPG)

If 'View Sales by Department' is chosen, a table is generated that shows department IDs, department names, overhead by department, total sales by department, and total profit.
![View Sales by Department](/Walkthrough/supervisor2.JPG)

If 'Create New Department' is chosen, the Supervisor is prompted for the name of the department, and the overhead cost of the department. If a non-numeric overhead cost is specified, they are asked to enter a number and prompted again. Once this is done, the database is updated and feedback is given that the department was created.
![Create New Department](/Walkthrough/supervisor3.JPG)