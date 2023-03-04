const express = require("express");
const router = express.Router();
const pool = require("../config.js");
const { authorization } = require("../middlewares/auth.js");
const default_limit = 10;
const default_page = 1;

router.get("/movies", (req, res, next) => {
  const { limit, page } = req.query;
  let resultLimit = limit ? +limit : default_limit;
  let resultPage = page ? +page : default_page;

  const findQuery = `
      SELECT 
          *
      FROM movies
      LIMIT ${resultLimit} OFFSET ${(resultPage - 1) * resultLimit}
      `;

  pool.query(findQuery, (err, result) => {
    if (err) next(err);

    res.status(200).json(result.rows);
  });
});

router.get("/movies/:id", (req, res, next) => {
  const { id } = req.params;
  const findQuery = `
        SELECT
        *
        FROM movies
        WHERE movies.id = $1
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

router.post("/movies", authorization, (req, res, next) => {
  const { title, genres, year } = req.body;
  const insertQuery = `
      INSERT INTO movies (title, genres, year)
          VALUES
              ($1, $2, $3)

      `;

  pool.query(insertQuery, [title, genres, year], (err, result) => {
    if (err) next(err);

    res.status(201).json({
      message: "New Movies Created Successfully",
    });
  });
});

router.put("/movies/:id", (req, res, next) => {
  const { id } = req.params;
  const { title, genres, year } = req.body;

  const updateQuery = `
          UPDATE movies
          SET title = $1
              genres = $2
              year = $3
          WHERE id = $4
      `;
  pool.query(updateQuery, [title, genres, year, id], (err, result) => {
    if (err) next(err);

    res.status(200).json({
      message: "Updated Successfully",
    });
  });
});

router.delete("/movies/:id", (req, res, next) => {
  const { id } = req.params;
  const findQuery = `
          SELECT
              *
          FROM movies
              WHERE id = $1
      `;
  pool.query(findQuery, [id], (err, result) => {
    if (err) next(err);

    if (result.rows[0]) {
      const deleteQuery = `
          DELETE FROM movies
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

// router.post("/register", async (req, res) => {
//   try {
//     const { email, gender, password, role } = req.body;
//     const hashedPassword = bcrypt.hash(password, 20);

//     const user = await pool.query(
//       `SELECT
//           *
//       FROM users
//       WHERE email= $1,
//             gender = $2,
//             password = $3,
//             role = $4
//       `,
//       [email, gender, password, role]
//     );

//     if (user.rows.length > 0) {
//       return res.status(400).json({ message: "email already exists" });
//     }

//     pool.query(
//       `INSERT INTO
//               users
//           (email, gender, password, role)
//           VALUES ($1, $2, $3, $4)`,
//       [email, gender, hashedPassword, role]
//     );

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $1", [email, password]);

//     if (user.rows.length === 0) {
//       return res.status(400).json({ message: "Invalid username or email" });
//     }

//     const validPassword = await bcrypt.compare(password, user.rows[0].password);

//     if (!validPassword) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign({ id: user.rows[0].id }, "your-jwt-secret", { expiresIn: "1d" });

//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

module.exports = router;
