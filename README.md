**Store API**

This store API is built with javascript using node.js on the Express.js framework. I'm using `mongo` as my NoSQL database.

This project does require you to have Docker in order to run locally.

**Running the project locally**

 1. Run `yarn install` in the home directory to pull all npm packages.
 2. Open a new terminal window and run `docker-compose up`. This will start the local mongodb server at `localhost:27017`.
 3. Go back your previous terminal window from step 1 and run `yarn start`

**Endpoints**
There are 3 endpoints in this app. `/products/:id` , `/auth/login`, and `/auth/register`. **NOTE**: *All calls made with data in the body of the request must use the **Content-Type: application/x-www-form-urlencoded***

 1. `/products/:id` - This endpoint has two verbs, GET and PUT. Placing a *GET* request with the `:id` param will pull the product from the database with the `id`, `name`, and `current_price` properties. Placing a *PUT* **without** the 	`price` connected to the body will result in the price being updated from the redsky api. Placing a PUT **with** the `price` in the body will result in the price in the database being updated with the value sent. In order to place a PUT request you will need to pass the `auth-token` header. The `auth-token` can be retrieved from the `/auth/login` endpoint response.
 2. `/auth/register` - This endpoint allows users to register for the service. You will place a *POST* request with `username` and `password` in the body. Once this call is made successfully, a new user will be created in the database.
 3. `/auth/login` - This endpoint will allow a registered user to login. You will place a *POST* request with `username` and `password` in the body. Once this call is made successfully, you will receive a confirmation message in the response as well as an `auth-token` JWT. You will use this JWT to authenticate yourself for the `/products/:id` PUT request.

*NOTE - The only ID that returned data from the document shared was ID 13860428 (The Big Lebowski). As a result, this is the only data I am working with in the app currently.*