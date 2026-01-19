const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = 7777;

app.post("/signup", async (req, res) => {
  // creating instance of user object
  const user = new User({
    firstName: "Harshad",
    lastName: "nanaware",
    emailId: "harshad@123",
    password: "harshad",
  });
  try {
    await user.save();
    res.send("User created successfully..");
  } catch (err) {
    res.status(400).send("Error occurs while creating user", err);
  }
});

connectDB()
  .then(() => {
    console.log("Moongose Connection estibalised");
    app.listen(PORT, () =>
      console.log(`Server is started on this PORT: ${PORT}`),
    );
  })
  .catch(() => {
    console.log("Moongose is not connected");
  });
