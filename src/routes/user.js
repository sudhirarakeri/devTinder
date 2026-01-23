const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photo skills about age gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const data = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // .populate('fromUserId', ['firstName', 'lastName']);

    res.send({
      message: "Data fetched successfully.",
      data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error?.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionData = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ toUserId: loggedInUser?._id }, { fromUserId: loggedInUser?._id }],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionData.map((ele) => {
      if (ele?.fromUserId?._id.toString() === loggedInUser?._id.toString()) {
        return ele?.toUserId;
      }
      return ele?.fromUserId;
    });

    res.send({ data });
  } catch (error) {
    res.status(400).send("Error : " + error?.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    let limit = parseInt(req?.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req?.user;
    const connectionData = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser?._id }, { fromUserId: loggedInUser?._id }],
    }).select("fromUserId toUserId");

    const hideUserData = new Set();
    connectionData.forEach((ele) => {
      hideUserData.add(ele?.fromUserId?._id);
      hideUserData.add(ele?.toUserId?._id);
    });

    const data = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUserData) },
        },
        {
          _id: { $ne: loggedInUser?._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
      
    res.send({ message: "Data fetched successfully", data });
  } catch (error) {
    res.status(500).send("Error: " + error?.message);
  }
});
module.exports = userRouter;
