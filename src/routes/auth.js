const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req); // validate body

    let { password } = req?.body;
    const hashPassword = await bcrypt.hash(password, 10); // encrpty password

    // creating new instance of user model
    const user = new User({
      ...req?.body,
      password: hashPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJwt();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000)
    }); // set in cookie

    res.json({ message: "User created successfully..", data: savedUser });
  } catch (err) {
    res.status(400).send("Error occurs while creating user" + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;

    const userInfo = await User.findOne({ emailId });

    if (!userInfo) {
      throw new Error("Invalid email or password");
    }

    const checkPassword = await userInfo.validatePassword(password);
    if (checkPassword) {
      const token = await userInfo.getJwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000)
      }); // set in cookie
      res.send({ message: "Login successfully..!", data: userInfo });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(500).send(error?.message || "Something went wrong");
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged successfully.");
});

authRouter.patch("/forgotPassword", async (req, res) => {
  try {
    const { emailId, updatedPassword } = req?.body;

    const hashPassword = await bcrypt.hash(updatedPassword, 10);

    const userInfo = await User.findOne({ emailId });
    console.log(userInfo);
    if (!userInfo) {
      res.status(404).send("User not found");
    }

    await User.updateOne({ emailId }, { $set: { password: hashPassword } });
    res.cookie("token", null, { expiresIn: new Date(new Date().now) });
    res.send("Password updated successfully.");
  } catch (error) {
    res.status(400).send(error?.message || "Something went wrong");
  }
});

module.exports = authRouter;
