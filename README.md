Home Decor API
This Home Decor API is designed to manage a catalog of home decor items, such as furniture, lighting, and accessories. Built with Node.js, Express, and MongoDB, it allows CRUD operations for managing items by category, location, price, and other details. It’s ideal for e-commerce platforms and inventory management.

Features
Create a new decor item (POST)
Read all decor items or by ID (GET)
Update an existing decor item by ID (PUT)
Delete a decor item by ID (DELETE)
Technologies
Node.js and Express for backend logic
MongoDB with Mongoose for database management
RESTful API for easy integration
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/home-decor-api.git
Navigate to the project directory:

bash
Copy code
cd home-decor-api
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory and add the following:
env
Copy code
MONGODB_URI=<your_mongodb_uri>
PORT=3000
Run the server:

bash
Copy code
npm start
The API will be accessible at http://localhost:3000.

API Endpoints
Create a New Item
POST /houses
Request Body:
json
Copy code
{
  "title": "Modern Table Lamp",
  "category": "Lamp",
  "location": "New York, USA",
  "price": 120,
  "image": "https://example.com/image.jpg",
  "description": "A stylish table lamp with a minimalist design."
}
Get All Items
GET /houses
Get an Item by ID
GET /houses/:id
Update an Item by ID
PUT /houses/:id
Request Body: (Update fields as needed)
json
Copy code
{
  "title": "Updated Table Lamp",
  "price": 130
}
Delete an Item by ID
DELETE /houses/:id
Data Model
Each decor item in the database has the following fields:

Field	Type	Description
id	String	Unique identifier for the item
title	String	Name or title of the item
category	String	Category, e.g., "Lamp", "Chair"
location	String	Location of the item
price	Number	Price of the item in USD
image	String	URL to an image of the item
description	String	Short description of the item
Example Usage
Creating a New Item with Postman

Open Postman.
Set the request to POST.
Enter http://localhost:3000/houses as the URL.
In the Body tab, select raw and JSON, then enter the item details.
Send the request to create a new item.
Contributing
Feel free to submit pull requests and suggest features or improvements! Make sure to fork the repo and make your changes in a new branch.

License
This project is licensed under the MIT License.

This README file provides clear instructions on installation, usage, and endpoints, making it easy for others to understand and use the API. Adjust details as needed based on your specific project structure and requirements.






