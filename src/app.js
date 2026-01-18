const express = require("express");

const app = express();

app.use("/user", (req, res) => {
    res.send("There is no users till now!");
});

app.use("/", (req, res) => {
  res.send("Welcome to dashboard!");
});

app.listen(7777, () => {
  console.log("Server is successfully running on PORT:", 7777);
});
