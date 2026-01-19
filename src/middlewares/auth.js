const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

const userAuth = async (req, res, next) => {
  try {
    const { token } = req?.cookies;
    if (!token) {
      throw new Error("Invalid token!");
    }
    const tokenObj = await jwt.verify(token, "DEV@TINDER");

    const { _id } = tokenObj;

    const userInfo = await User.findOne({ _id });
    if (!userInfo) {
      throw new Error("User not found.");
    }
    req.user = userInfo;
    next();
  } catch (err) {
    res.status(400).send(err?.message);
  }
};

module.exports = { adminAuth, userAuth };
