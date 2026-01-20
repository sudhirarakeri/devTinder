const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Request");
    }

    let loggedInUser = req.user;

    Object.keys(req?.body).forEach(
      (key) => (loggedInUser[key] = req?.body?.[key]),
    );

    await loggedInUser.save();

    res.send({ message: "Data updated successfully.", data: loggedInUser });
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

module.exports = profileRouter;
