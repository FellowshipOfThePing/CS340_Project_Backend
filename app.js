// Require Modules
const express = require("express");
const cors = require("cors");
const mysql = require("./dbcon.js");

// Set up Express App
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))
app.use(cors());
app.use(express.json());

// ---- Queries Organized by Page on Frontend---- //

// Deal Queries

app.get("/deals/select", (req, res, next) => {
  mysql.pool.query(
    "SELECT * FROM deal ORDER BY deal_id",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/deals/add", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO deal (percent_discount) VALUES (?)",
    [req.query.percent_discount],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/deals/delete", (req, res, next) => {
  mysql.pool.query(
    "DELETE FROM deal WHERE deal_id=?",
    [req.query.deal_id],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

app.get("/deals/update", (req, res, next) => {
  mysql.pool.query(
    "UPDATE deal SET percent_discount=? WHERE deal_id=?",
    [req.query.percent_discount, req.query.deal_id],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

// Customer Queries

app.get("/customers/select", (req, res, next) => {
  mysql.pool.query(
    "SELECT * FROM customer ORDER BY discount_card_number",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/customers/add", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO customer (discount_card_number, last_name, first_name, birth_date) VALUES (?, ?, ?, ?);",
    [
      req.query.discount_card_number,
      req.query.last_name,
      req.query.first_name,
      req.query.birth_date,
    ],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/customers/delete", (req, res, next) => {
  mysql.pool.query(
    "DELETE FROM customer WHERE discount_card_number=?",
    [req.query.discount_card_number],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

app.get("/customers/update", (req, res, next) => {
  mysql.pool.query(
    "UPDATE customer SET discount_card_number=?, last_name=?, first_name=?, birth_date=? WHERE discount_card_number=?",
    [
      req.query.discount_card_number,
      req.query.last_name,
      req.query.first_name,
      req.query.birth_date,
      req.query.discount_card_number,
    ],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

// Location Queries

app.get("/locations/select", (req, res, next) => {
  mysql.pool.query(
    "SELECT * FROM restaurant_chain_location ORDER BY chain_location_id",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/locations/modal/chain_names", (req, res, next) => {
  // For Add Modal
  mysql.pool.query(
    "SELECT chain_name FROM restaurant_chain",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/locations/add", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO restaurant_chain_location (chain_name, city_name, state_name) VALUES (?, ?, ?);",
    [req.query.chain_name, req.query.city_name, req.query.state_name],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/locations/delete", (req, res, next) => {
  mysql.pool.query(
    "DELETE FROM restaurant_chain_location WHERE chain_location_id=?",
    [req.query.chain_location_id],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

app.get("/locations/update", (req, res, next) => {
  mysql.pool.query(
    "UPDATE restaurant_chain_location SET chain_name=?, city_name=?, state_name=? WHERE chain_location_id=?",
    [
      req.query.restaurant_chain_location,
      req.query.chain_name,
      req.query.city_name,
      req.query.state_name,
      req.query.restaurant_chain_location,
    ],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

// Location Deals Queries

app.get("/loc_deals/select", (req, res, next) => {
  mysql.pool.query(
    `SELECT d.deal_id AS Deal_ID, d.percent_discount AS Percent_Discount, cl.chain_name AS Chain, cl.city_name AS City, cl.state_name AS State
     FROM location_deal ld
        LEFT JOIN deal d ON ld.deal_id = d.deal_id
        LEFT JOIN restaurant_chain_location cl ON ld.chain_location_id = cl.chain_location_id
     ORDER BY cl.chain_location_id`,
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/loc_deals/add", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO location_deal (deal_id, chain_location_id) VALUES (?, ?);",
    [req.query.deal_id, req.query.chain_location_id],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/loc_deals/delete", (req, res, next) => {
  mysql.pool.query(
    "DELETE FROM location_deal WHERE chain_location_id=? AND deal_id=?;",
    [req.query.chain_location_id, req.query.deal_id],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

app.get("/loc_deals/update", (req, res, next) => {
  mysql.pool.query(
    "UPDATE location_deal SET chain_location_id=?, deal_id=? WHERE chain_location_id=? AND deal_id=?",
    [
      req.query.chain_location_id,
      req.query.deal_id,
      req.query.chain_location_id,
      req.query.deal_id,
    ],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

// Transaction Queries

app.get("/transactions/select", (req, res, next) => {
  mysql.pool.query(
    `SELECT t.transaction_id AS Transaction_ID, d.deal_id AS Deal_ID, cl.chain_location_id AS Chain_Location_ID, c.last_name AS last_name, c.first_name AS first_name, cl.chain_name AS Chain_Name, cl.city_name AS City, cl.state_name AS State, d.percent_discount AS Percent_Discount, t.Date
     FROM transaction t
        LEFT JOIN customer c ON c.discount_card_number = t.discount_card_number
        LEFT JOIN restaurant_chain_location cl ON cl.chain_location_id = t.chain_location_id
        LEFT JOIN deal d ON d.deal_id = t.deal_id
     ORDER BY t.transaction_id`,
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/transactions/modal/customers", (req, res, next) => {
  mysql.pool.query(
    "SELECT discount_card_number, first_name, last_name FROM customer;",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/transactions/modal/locations", (req, res, next) => {
  mysql.pool.query(
    "SELECT chain_location_id, chain_name, city_name, state_name FROM restaurant_chain_location;",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/transactions/add", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO transaction VALUES (?, ?, ?, ?);",
    [
      req.query.discount_card_number,
      req.query.chain_location_id,
      req.query.deal_id,
      req.query.date,
    ],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/transactions/delete", (req, res, next) => {
  mysql.pool.query(
    "DELETE FROM transaction WHERE transaction_id=?;",
    [req.query.transaction_id],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

app.get("/transactions/update", (req, res, next) => {
  mysql.pool.query(
    "UPDATE transaction SET discount_card_number=?, chain_location_id=?, deal_id=?, date=?;",
    [
      req.query.discount_card_number,
      req.query.chain_location_id,
      req.query.deal_id,
      req.query.date,
    ],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

// Error Handling
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type("plain/text");
  res.status(500);
  res.send("500 - Server Error");
});

// Start Express Server
app.listen(port, () => {
  console.log("App is running on port " + port);
});
