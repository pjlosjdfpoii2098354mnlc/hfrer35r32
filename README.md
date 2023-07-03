# Web application for inventory of products

Before starting the application, it is necessary to install the resources required for the node app, the installation is started with the `npm install` command
#
The application is started with the `node server.js` or `nodemon server.js` command
#
Database installation required, you have a database.sql file with data
#
Login information:
- Username: test
- Password: 123

#
The password for adding the product quantity is `test', it can be changed in the code
#

  # CONNECT DATABASE
In `server.js` there is a part where you need to enter the data of the mysql database because without it the application cannot be used

```js
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'databaseName',
});
```
