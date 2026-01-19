const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { signupValidator } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 7777;
app.use(express.json()); // to make request body json object to readable
app.use(cookies()); // to make cookies object to readable

app.post("/signup", async (req, res) => {
  try {
    // validate body
    signupValidator(req);

    let { firstName, lastName, password, emailId } = req?.body;

    // encrpty password
    const hashPassword = await bcrypt.hash(password, 10);

    // creating new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("User created successfully..");
  } catch (err) {
    res.status(400).send("Error occurs while creating user" + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;

    const userInfo = await User.findOne({ emailId });

    if (!userInfo) {
      throw new Error("Invalid email or password");
    }

    const checkPassword = await userInfo.validatePassword(password);
    if (checkPassword) {
      const token = await userInfo.getJwt();

      res.cookie("token", token); // set in cookie
      res.send("Login successfully..!");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(500).send(error?.message || "Something went wrong");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(`${req.user?.firstName} sent to connection request`);
  } catch (error) {
    res.status(400).send(error?.message);
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
