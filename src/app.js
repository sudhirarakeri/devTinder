const express = require("express");
const connectDB = require("./config/database");
const cookies = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json()); // to make request body json object to readable
app.use(cookies()); // to make cookies object to readable

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app); // this used for web socket, for 2 way opening socket

initializeSocket(server); // used for web socket

connectDB()
  .then(() => {
    console.log("Moongose Connection estibalised");
    server.listen(PORT, () =>
      console.log(`Server is started on this PORT: ${PORT}`),
    );
  })
  .catch(() => {
    console.log("Moongose is not connected");
  });
