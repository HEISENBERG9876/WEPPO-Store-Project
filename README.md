# About
This is a simple e-commerce shop created as a final project for one of my university courses. The application uses Node.js, Express and PostgreSQL. EJS is also used here to simplify building the frontend and bootstrap to handle the visuals.

# Features

## Users that are not logged in
- [x] Browsing products
- [x] Searching for products using a searchbar
- [x] Creating an account and logging in
  
## Users that are logged in
- [x] Adding products to cart
- [x] Viewing the cart and the summary
- [x] Placing an order

## Administrator
- [x] Adding/modifying/deleting products
- [x] Viewing user list
- [x] Viewing order list

## Screenshots

## Home page
![Home page](/screens/index.PNG)

## Cart
![Cart](/screens/cart.PNG)

## Admin
![Admin](/screens/admin.PNG)


## How to run
- Download the project
- Create the database StoreAppDb2 in postgresql using the file StoreAppDb2.sql
- Install dependancies with npm install
- Run the project with node server.js in the command line (project root directory)
- In the browser, go to http://localhost:7800/