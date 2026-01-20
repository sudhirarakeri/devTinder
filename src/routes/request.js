const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(`${req.user?.firstName} sent to connection request`);
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

module.exports = requestRouter;
