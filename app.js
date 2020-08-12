// Require Modules
const express = require("express");
const cors = require("cors");
const mysql = require("./dbcon.js");

// Set up Express App
const app = express();
app.set("port", process.env.PORT || 3000);

// Middleware
app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));
app.use(cors());
app.use(express.json());

// ---- Queries Organized by Page on Frontend---- //

// Deal Queries

app.get("/deals", (req, res, next) => {
  mysql.pool.query(
    "SELECT * FROM deal ORDER BY deal_id",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/deals", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO deal (percent_discount) VALUES (?)",
    [req.query.percent_discount],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/deals", (req, res, next) => {
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

app.put("/deals", (req, res, next) => {
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

app.get("/customers", (req, res, next) => {
  mysql.pool.query(
    "SELECT * FROM customer ORDER BY discount_card_number",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/customers", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO customer (discount_card_number, last_name, first_name, birth_date) VALUES (?, ?, ?, ?);",
    [
      req.body.discount_card_number,
      req.body.last_name,
      req.body.first_name,
      req.body.birth_date,
    ],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/customers", (req, res, next) => {
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

app.put("/customers", (req, res, next) => {
  mysql.pool.query(
    "UPDATE customer SET discount_card_number=?, last_name=?, first_name=?, birth_date=? WHERE discount_card_number=?",
    [
      req.body.discount_card_number,
      req.body.last_name,
      req.body.first_name,
      req.body.birth_date,
      req.body.discount_card_number,
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

// Chain Queries

app.get("/chains", (req, res, next) => {
  // For Add Modal
  mysql.pool.query(
    "SELECT chain_name FROM restaurant_chain",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/chains/filter", (req, res, next) => {
  mysql.pool.query(
    "SELECT * FROM restaurant_chain WHERE chain_name LIKE CONCAT('%', ?, '%');",
    [req.query.chain_name],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.send(result);
    }
  );
});

app.post("/chains", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO restaurant_chain (chain_name) VALUES(?)",
    [req.body.chain_name],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/chains", (req, res, next) => {
  mysql.pool.query(
    "DELETE FROM restaurant_chain WHERE chain_name=?",
    [req.query.chain_name],
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

app.get("/locations", (req, res, next) => {
  mysql.pool.query(
    "SELECT chain_location_id, chain_name, city_name AS city, state_name AS state FROM restaurant_chain_location ORDER BY chain_location_id",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/locations", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO restaurant_chain_location (chain_name, city_name, state_name) VALUES (?, ?, ?);",
    [req.body.chain_name, req.body.city, req.body.state],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/locations", (req, res, next) => {
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

app.put("/locations", (req, res, next) => {
  mysql.pool.query(
    "UPDATE restaurant_chain_location SET chain_name=?, city_name=?, state_name=? WHERE chain_location_id=?",
    [
      req.body.chain_name,
      req.body.city,
      req.body.state,
      req.body.chain_location_id,
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

app.get("/loc_deals", (req, res, next) => {
  mysql.pool.query(
    `SELECT CONCAT(d.deal_id, cl.chain_location_id) AS table_key, d.deal_id AS deal_id, cl.chain_location_id AS chain_location_id, d.percent_discount AS percent_discount, cl.chain_name AS chain_name, cl.city_name AS city, cl.state_name AS state
     FROM location_deal ld
        LEFT JOIN deal d ON ld.deal_id = d.deal_id
        LEFT JOIN restaurant_chain_location cl ON ld.chain_location_id = cl.chain_location_id
     ORDER BY cl.chain_location_id`,
    (err, results, fields) => {
      if (err) throw err;
      results.table_key = `${results.deal_id}${results.chain_location_id}`;
      console.log("results", results);
      res.send(results);
    }
  );
});

app.post("/loc_deals", (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO location_deal (deal_id, chain_location_id) VALUES (?, ?);",
    [req.body.deal_id, req.body.chain_location_id],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/loc_deals", (req, res, next) => {
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

//I don't think we need this. Never should update, should just create a new composite entity
app.put("/loc_deals", (req, res, next) => {
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

app.get("/transactions", (req, res, next) => {
  mysql.pool.query(
    `SELECT t.transaction_id AS transaction_id, d.deal_id AS deal_id, cl.chain_location_id AS chain_location_id, c.discount_card_number AS discount_card_number, c.last_name AS last_name, c.first_name AS first_name, cl.chain_name AS chain_name, cl.city_name AS city, cl.state_name AS state, d.percent_discount AS percent_discount, t.Date AS date
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
    "SELECT chain_location_id, chain_name, city_name AS city, state_name AS state FROM restaurant_chain_location;",
    (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post(`/transactions/`, (req, res, next) => {
  mysql.pool.query(
    "INSERT INTO transaction (discount_card_number, chain_location_id, deal_id, date) VALUES (?, ?, ?, ?);",
    [
      req.body.discount_card_number,
      req.body.chain_location_id,
      req.body.deal_id,
      req.body.date,
    ],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/transactions/", (req, res, next) => {
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

app.put("/transactions", (req, res, next) => {
  mysql.pool.query(
    "UPDATE transaction SET discount_card_number=?, chain_location_id=?, deal_id=?, date=? WHERE transaction_id=?;",
    [
      req.body.discount_card_number,
      req.body.chain_location_id,
      req.body.deal_id,
      req.body.date,
      req.body.transaction_id,
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
app.listen(app.get("port"), () => {
  console.log("Express started on Port " + app.get("port"));
});
