const express = require("express");
const connectDB = require("./config/database");
const cookies = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();
const PORT = 7777;
app.use(express.json()); // to make request body json object to readable
app.use(cookies()); // to make cookies object to readable

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
