const adminAuth = (req, res, next) => {
  console.log("Inside Admin auth checking function");

  const JWTToken = "xyzs";
  const isAuthorized = JWTToken === "xyz";

  if (!isAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("Inside User auth checking function");

  const JWTToken = "xyz";
  const isAuthorized = JWTToken === "xyz";

  if (!isAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
