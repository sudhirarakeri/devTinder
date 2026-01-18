const express = require("express");

const app = express();

// path-to-regexp version 6 or below
// app.get("/ab+c", (req, res)=>{
//   res.send("Data Fetched successfully..")
// })

app.get("/users/:userId/:age", (req, res) => { // http://localhost:7777/users?userId=2
  console.log(req?.params)
  res.send({ username: "sudhir", age: 26 });
});

app.get("/users", (req, res) => { // http://localhost:7777/users?userId=2
  console.log(req?.query)
  res.send({ username: "sudhir", age: 26 });
});

app.get("/user", (req, res) => {
  res.send({ username: "sudhir", age: 26 });
});

app.post("/user", (req, res) => {
  res.send("Data Added Successfully!");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully!");
});

// This method match all the HTTP methods (GET, POST, DELETE, etc)
app.use("/", (req, res) => {
  res.send("Welcome to dashboard!");
});

app.listen(7777, () => {
  console.log("Server is successfully running on PORT:", 7777);
});
