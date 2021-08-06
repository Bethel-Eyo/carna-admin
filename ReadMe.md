## Overview

This is the web-based admin portion of the project. Creative Tim template was used for the admin dashboard due to the time required to finish all 3 projects and I got permission from Tevfican to proceed with it.

There are lots of components declared in the root folder. But I will point us to the functionalities that matter.

that provide the admin with the following functionalies.
1. Create User.
2. Update User.
3. Get All Users.
4. Delete User.
5. Create Course.
6. Update Course.
7. Get All Courses.
8. Delete Course.
9. Admin authentication using JWT.

1. The User CRUD.
This can be found in src/view/Users/User.js file - it contains methods that allows the admin Read, Update, Create and delete Users. other functionalites provided are:
a. Admin is able to search the User table by name, city or country.
b. Admin is able to export data in the user table to pdf.

2. The Course CRUD.
This can be found in src/view/Courses/Courses.js - contains method that allows the admin to Read, Update, Create and delete Courses.

In src/helpers/Utils.js the getAccessToken method is declared which helps to get the token that was stored in the browsers local storage in order to make calls to the admin authenticated routes in the api. if the token has expired, it logs the admin out.

## What was deliberately not Implemented:

Since we have api tests already from the be-carna-api, and all the 15 test cases passed, there was no dire need to implement mock tests for the api on the frontend because of time.