function errorHandler(err, req, res, next) {
  if (err.title === "ErrorNotFound") {
    res.status(404).json({
      message: "Not Found",
    });
  } else if (err.name === "WrongPassword") {
    res.status(400).json({
      message: "Wrong Passwornd or email",
    });
  } else if (err.name === "Unauthenticated") {
    res.status(400).json({
      message: "Unauthenticated",
    });
  } else if (err.name === "JWTerror") {
    res.status(400).json({
      message: "JWT error",
    });
  } else if (err.name === "Unauthorized") {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }

  console.log(err);
}

module.exports = errorHandler;
