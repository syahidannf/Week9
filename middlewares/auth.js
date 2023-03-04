const jwt = require("jsonwebtoken");
const secretKey = "Rahasia";
const pool = require("../config");

function authentication(req, res, next) {
  const { access_token } = req.headers;

  if (access_token) {
    try {
      const decoded = jwt.verify(access_token, secretKey);
      const { email, gender, role } = decoded;
      const findUser = `
            SELECT 
            * 
            FROM users
            WHERE id = $1;
        `;
      pool.query(findUser, [email, gender, role], (err, result) => {
        if (err) next(err);

        if (result.rows.length === 0) {
          next({ name: "ErrorNotFound" });
        } else {
          const user = result.rows[0];
          req.loggedUser = {
            email: user.email,
            gender: user.gender,
            role: user.role,
          };
          next();
        }
      });
    } catch (err) {
      next({ name: "JWTerror" });
    }
  } else {
    next({ name: "Unauthenticated" });
  }
}

function authorization(req, res, next) {
  const { email, gender, role } = req.loggedUser;

  if (role) {
    next();
  } else {
    next({ name: "Unathorized" });
  }
}

module.exports = {
  authentication,
  authorization,
};
