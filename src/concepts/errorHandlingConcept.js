const express = require("express");
const app = express();

app.use("/getAllData", (req, res) => {
  throw new Error("Some Errors");
});

// wildcard-error-handling
app.use("/", (err, req, res, next) => { // 4 parameters handles for errors. but first one is err.
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

// try-catch-error-handling
app.use("/deleteAllData", (req, res) => {
  try {
    throw new Error("Some Errors");
  } catch (Error) {
    res.status(500).send("Internal server error");
  }
});

app.listen(7777, () => {
  console.log("Server is successfully running on PORT:", 7777);
});
