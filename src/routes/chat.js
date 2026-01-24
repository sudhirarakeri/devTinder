const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req?.params;
    const userId = req.user._id;
    const chat = await Chat.findOne({
      participent: { $all: [userId, targetUserId] },
    }).populate({
      path: "message.senderId",
      select: "firstName lastName photo",
    });

    if (!chat) {
      chat = new Chat({
        participent: [userId, targetUserId],
        message: [],
      });
      await chat.save();
    }

    res.json({ message: "Data fetched successfully.", data: chat });
  } catch (err) {
    console.log(err);
  }
});

module.exports = chatRouter;
