const express = require('express');
const mysql = require('mysql');
const app = express();
const session = require('express-session');
const methodOverride = require('method-override');
const moment = require('moment-timezone');
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: 'saggasasgasgas1251',
    resave: false,
    saveUninitialized: false
  }));
  
const db = mysql.createConnection({
  host: 'db4free.net',
  user: 'root2524',
  password: 'SefikBaba12345#',
  database: 'lagerlista_baza1',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database');
});

app.post('/products', (req, res) => {
  const { name, quantity } = req.body;

  const newProduct = { name, quantity };

  const sql = 'INSERT INTO products SET ?';

  db.query(sql, newProduct, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Product added to the inventory');
    res.redirect('/products');
  });
});


function provjeraSesije(req, res, next) {
    if (req.session.loginanJel) {
      next();
    } else {
      res.redirect('/')
    }
}
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    });
  });
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
      if (err) {
        throw err;
      }
  
      if (results.length > 0) {
        req.session.loginanJel = true;
        req.session.username = username;
        res.redirect('/products');
      } else {
        res.redirect('/');
      }
    });
  });

app.get('/products', provjeraSesije, (req, res) => {
    const sql = 'SELECT * FROM products';
  
    db.query(sql, (err, results) => {
      if (err) {
        throw err;
      }
      res.render('products', { products: results });
    });
  });
  
app.post('/add-quantity', provjeraSesije,(req, res) => {
  const { productId, quantity, password } = req.body;

  const sql = 'SELECT * FROM products WHERE id = ?';

  db.query(sql, [productId], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length > 0) {
      const product = results[0];

      if (password === 'Nargila123.') {
        const updatedQuantity = product.quantity + parseInt(quantity);

        const updateSql = 'UPDATE products SET quantity = ? WHERE id = ?';

        db.query(updateSql, [updatedQuantity, productId], (err, result) => {
          if (err) {
            throw err;
          }
          res.redirect('/products');
        });
      } else {
        res.redirect('/products');
      }
    } else {
      res.redirect('/products');
    }
  });
});

// Ruta za trebovanje količine proizvoda
app.post('/trebovanje', provjeraSesije, (req, res) => {
  const { productId, quantity, password } = req.body;

  const sqlSelect = 'SELECT * FROM products WHERE id = ?';

  db.query(sqlSelect, [productId], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length > 0) {
      const product = results[0];

        if (product.quantity >= quantity) {
          const updatedQuantity = product.quantity - parseInt(quantity);
          const currentDate = moment().tz('Europe/Zagreb').format('YYYY-MM-DD HH:mm:ss');
          const updateSql = 'UPDATE products SET quantity = ?, last_request_date = ?, request_quantity = ? WHERE id = ?';

          db.query(updateSql, [updatedQuantity, currentDate, quantity, productId], (err, result) => {
            if (err) {
              throw err;
            }
            res.redirect('/products');
          });
        } else {
          res.redirect('/products');
        }
    } else {
      res.redirect('/products');
    }
  });
});




app.get('/inventory', provjeraSesije, (req, res) => {
  const inventorySql = 'SELECT * FROM products';
  const totalQuantitySql = 'SELECT SUM(quantity) AS totalQuantity FROM products';
  const totalReqQuantitySql = 'SELECT SUM(request_quantity) AS totalReqQuantity FROM products';

  db.query(inventorySql, (err, inventoryResults) => {
    if (err) {
      throw err;
    }

    db.query(totalQuantitySql, (err, totalQuantityResult) => {
      if (err) {
        throw err;
      }
      db.query(totalReqQuantitySql, (err, totalReqQuantityResult) => {
        if (err) {
          throw err;
        }
      const totalQuantity = totalQuantityResult[0].totalQuantity || 0;
      const totalReqQuantity = totalReqQuantityResult[0].totalReqQuantity || 0;

      res.render('stanje', { inventory: inventoryResults, totalQuantity, totalReqQuantity });
    });
  });
  });
});


const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
