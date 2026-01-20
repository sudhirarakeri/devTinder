const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/:status/:userId", userAuth, async (req, res) => {
  try {
    const toUserId = req.params?.userId;
    const fromUserId = req?.user?._id;
    const status = req?.params?.status;

    // validate status
    if (!["interested", "ignored"].includes(status)) {
      return res.status(404).json({ message: "Status is not valid" });
    }

    // Validate is exist connection request
    const isConnectionRequestExist = await ConnectionRequest.findOne({
      $or: [
        {
          toUserId,
          fromUserId,
        },
        {
          toUserId: fromUserId,
          fromUserId: toUserId,
        },
      ],
    });

    if (isConnectionRequestExist) {
      throw new Error("Connection request has been already sent");
    }

    // validate toUserId is exist
    const isUserExits = await User.findById(toUserId);
    if (!isUserExits) {
      throw new Error("Sending request to User is not exist");
    }

    const data = await new ConnectionRequest({
      toUserId,
      fromUserId,
      status,
    }).save();

    res.send({
      message: `${req?.user?.firstName} ${status == "interested" ? "has sent request to the" : "has ignored to"} ${isUserExits?.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error?.message);
  }
});

module.exports = requestRouter;
