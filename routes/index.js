const express = require("express");
const router = express.Router();
const movieRouter = require("./movies.js");
const userRouter = require("./user.js");
const pool = require("../config");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secretKey = "Rahasia";
const { authentication } = require("../middlewares/auth.js");

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  const findUser = `
        SELECT 
        *
        FROM users
        WHERE email = $1
    `;
  pool.query(findUser, [email], (err, result) => {
    if (err) next(err);

    if (result.rows.length === 0) {
      next({ erorr: "ErrorNotFound" });
    } else {
      const data = result.rows[0];
      const comparPassword = bcrypt.compareSync(password, data.password);

      if (comparPassword) {
        const accessToken = jwt.sign(
          {
            email: data.email,
            id: data.id,
          },
          secretKey
        );

        res.status(200).json({
          email: data.email,
          id: data.id,
          accessToken: accessToken,
        });
      } else {
        next({ name: "WrongPassword" });
      }
    }
  });
});

router.post("/register", (req, res, next) => {
  const { email, gender, password, role } = req.body;

  const hash = bcrypt.hashSync(password, salt);
  try {
    const insertUser = `
    INSERT INTO users (email, gender, password, role)
        VALUES
            ($1, $2, $3, $4);
  `;
    pool.query(insertUser, [email, gender, hash, role], (err, result) => {
      if (err) next(err);
      res.status(201).json({
        messag: "User Registered",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

router.use(authentication);

router.use("/", movieRouter);

router.use("/", userRouter);

module.exports = router;
