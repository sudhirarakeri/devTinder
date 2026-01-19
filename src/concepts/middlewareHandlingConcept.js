const express = require("express");
const { adminAuth, userAuth } = require('../middlewares/auth');
const app = express();

app.use('/admin', adminAuth);

app.use("/user/deleteAllData", userAuth, (req, res) => {
  res.send("Deleted all data");
});

app.use("/admin/getAllData", (req, res) => {
  res.send("All data fetched");
});

app.use("/admin/deleteAllData", (req, res) => {
  res.send("Deleted all data");
});

app.listen(7777, () => {
  console.log("Server is successfully running on PORT:", 7777);
});
