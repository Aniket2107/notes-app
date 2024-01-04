## :black_nib: Notes App

This project involves the development of a secure and scalable RESTful API for efficient note management. The API facilitates essential CRUD (Create, Read, Update, Delete) operations on user-generated notes. Additionally, it offers advanced features such as the ability to share notes with other users and perform keyword-based searches.

## Key features :

1.  Ensures secure user **authentication** by employing JWT tokens, complemented with refresh tokens for extended session management.
2.  Handles high traffic efficiently through the integration of a r**ate limiter**, optimizing performance and preventing abuse.
3.  Enhances notes search functionality with **indexing**, resulting in improved search efficiency.

## :baby: Requirements and Depedencies

- [NodeJs](https://nodejs.org/en/) - [ Express, Jest ]
- MongoDB - [ Mongoose (ODM) ]

## :hourglass_flowing_sand: Installation

1.Clone the repository
2.Create a new database for the project using MongoDB
3.Use the following command on the terminal to install dependencies.

    cd <repo_name>
     npm install

## :cyclone: Environment variables

There is a .env.template file copy the variables and replace it with actual values.

## :tada: Running the project

_Write the commands and run instructions for the project under the following headers_

        npm start

The server runs on port 8080 or a specified PORT

## :tada: Running unit tests

_Write the commands and run instructions for the project under the following headers_

        npm run test

We create a temporary mongoDb server using **mongodb-memory-server**, this creates a local memory for testing and deletes all the data once testing is done.
