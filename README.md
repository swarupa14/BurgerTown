# BurgerTown Website

BurgerTown is a functional website for a burger chain that lets people order food off the menu online, and allows them to get a hold of menu information, trending offers, locations, contact information and much more, creating a close community among its customers.

The following assets are present in every page:

### Navbar

The Navigation Bar houses the BurgerTown logo, quick links to the home page, menu, location, contact info, order page. It also includes the signin module which presents as dropdown form, and once signed in, it converts into a dropdown menu including the user account, order history page, and signout option.

### Signin module

The signin module is a dropdown form, where the user provides their phone number and password to login to the system. It also includes the link to the signup page for new users.

### Sliding cart

The sliding cart houses all the orders placed by a user, where it shows the quantity and name of each item along with their addons and price. The quantity can be increased or decreased and any item can be removed from the cart using the cross button. The total price shows up at the bottom, and a link to the checkout page is also present.

BurgerTown website contains the following pages, along with their features:

### Home Page

This is the starting page of the website which houses our tagline, a small description about BurgerTown, trending offers in a carousel. 

### Menu Page

This the page which gives you the entire menu of BurgerTown,including names,prices, and ingredients of all the items, with all the information coming directly from the database.

### Location Page

This page holds live maps which shows the location of all the branches of BurgerTown.

### Contact Information Page

This is a static page showing all the contact information of BurgerTown, including phone numbers and emails, and also our operating hours.

### Signup Form Page

Users use this page to signup to our website, by filling up a simple form providing their name, email, phone number, address, and password. Users must agree to the terms and conditions of BurgerTown.

### Order Page

This is the main page of this website where users can order any item off the menu just by clicking on the add to cart button, which will prompt a modal to open up where they can choose the spice level of the burger (Regular, Spicy, Extra Spicy), and can select any addon-ons (Patty, Cheese, Pepperoni, BBQ Sauce, Beef Bacon) available for the burger. Users can also choose the size of fries (Regular or Large). Once selected, the order information along with its price is added to the sliding cart. 

### Checkout Page

The checkout page shows the information of the user if the user has logged in, otherwise the fields are empty where a person who hasn't logged in can just give their information, like name, phone number and address to order their food. The page also includes the order summary, and payment options, and a confirm order button.

### Order Confirmation Page

The order confirmation page is shown to the user after they have confirmed their order. It shows the order ID for that particular order, the date when it was issued, the name, phone number and address of the issuer, the order details including all the items along with addons, spice level and price, the time at which delivery can be expected, and finally the total price including delivery charge.

### Order History Page

This page shows all the orders placed by a particular user over the course of time. Each order has the information about the user, the status of the order, the date when order was issued, the order details, and the total price. This page can only be accessed by those who created an account.

### User Account Page

This page contains all the user information, including their name, email, phone number and address, which they can also update and save. This will be reflected in the database accordingly.

### Admin Page

The admin page is accessed by a specific extension with the site link, which is only known to the BurgerTown admin. Once inside, the admin can add items to the menu with a simple form where they need to fill up the item name, which section it belongs to (Burger, Fries, or Shakes), the ingredients, the price, and image of the item. The admin can also check the order details according to the date on which the order was placed and the status of the order (Pending, Dispatched, Delivered). Finally, the admin can update the order status of a particular order just by searching for the order ID and then changing the order's status once it is dispatched or delivered (All orders are considered Pending once order is placed).

