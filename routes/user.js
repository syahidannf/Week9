const express = require("express");
const router = express.Router();
const pool = require("../config.js");

router.get("/users", (req, res, next) => {
  const findQuery = `
          SELECT 
              *
          FROM users;
          `;

  pool.query(findQuery, (err, result) => {
    if (err) next(err);
    res.status(200).json(result.rows);
  });
});

router.get("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const findQuery = `
          SELECT
          *
          FROM users
          WHERE users.id = $1
      `;

  pool.query(findQuery, [id], (err, result) => {
    if (err) next(err);
    if (result.rows.length === 0) {
      next({ title: "ErrorNotFound" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});

router.post("/users", (req, res, next) => {
  const { email, gender, password, role } = req.body;
  const insertQuery = `
        INSERT INTO users (email, gender, password, role)
            VALUES
                ($1, $2, $3, $4)
  
        `;

  pool.query(insertQuery, [email, gender, password, role], (err, result) => {
    if (err) next(err);

    res.status(201).json({
      message: "New User Created Successfully",
    });
  });
});

router.put("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const { email, gender, password, role } = req.body;

  const updateQuery = `
            UPDATE users
            SET email = $1
                gender = $2
                password = $3
                role = $4
            WHERE id = $5
        `;
  pool.query(updateQuery, [email, gender, password, role, id], (err, result) => {
    if (err) next(err);

    res.status(200).json({
      message: "Updated Successfully",
    });
  });
});

router.delete("/users/:id", (req, res, next) => {
  const { id } = req.params;
  const findQuery = `
            SELECT
                *
            FROM users
                WHERE id = $1
        `;
  pool.query(findQuery, [id], (err, result) => {
    if (err) next(err);

    if (result.rows[0]) {
      const deleteQuery = `
            DELETE FROM users
            WHERE id = $1;
            `;

      pool.query(deleteQuery, [id], (err, result) => {
        if (err) next(err);
        res.status(200).json({
          message: "Deleted Successfully",
        });
      });
    } else {
      res.status(404).json({
        message: "User Not Found",
      });
    }
  });
});

module.exports = router;
