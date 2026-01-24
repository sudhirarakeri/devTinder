const socket = require("socket.io");
const Crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => { // creating hash for roomId
  return Crypto.createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  }); // Allowing to this client-side base path URL

  // actual socket live connection is started here
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ name, userId, targetUserId }) => { // every unique creates rooms for identifier
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(name + " joining in this room :" + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ name, userId, targetUserId, text, photo, time }) => {
        try {
          //   const roomId = [userId, targetUserId].sort().join("_");
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(name + " : " + text);

          let chatData = await Chat.findOne({
            participent: { $all: [userId, targetUserId] },
          });

          if (!chatData) {
            chatData = new Chat({
              participent: [userId, targetUserId],
              message: [],
            });
          }
          chatData.message.push({ senderId: userId, text });
          await chatData.save();

          // add and to send message to receiver
          io.to(roomId).emit("messageReceived", {
            name,
            text,
            userId,
            photo,
            time,
          });
        } catch (err) {
          console.log(err);
        }
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
