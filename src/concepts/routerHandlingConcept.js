const express = require("express");

const app = express();

// sequence is matter wheather it's an array or simple object. it will goes always next.
// app.use("/router", r1, [r2, r3], r4); 
// next() -> Moves to the next function/middleware. OR pass-off mechanism.

// -> 1ST WAY route handler
app.use("/user", (req, res, next) => {
  next(); // middleware
})

app.use("/user", (req, res, next) => {
  res.send("Response sended"); // request handler
})

// -> 2ND WAY route handler
app.use(
  "/user",
  (req, res, next) => {
    console.log("!st response printed");
    // res.send("1st Response.");
    next(); // middleware
  },
  [
    (req, res, next) => {
      console.log("2nd response printed");
      next(); // middleware
      // res.send("2nd Response.");
    },
    (req, res, next) => {
      console.log("3rd response printed");
      res.send("3rd Response."); // request handler
    },
  ],
);

app.listen(7777, () => {
  console.log("Server is successfully running on PORT:", 7777);
});
