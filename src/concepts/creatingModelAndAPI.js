const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = 7777;
app.use(express.json()); // to make request body json object to readable

app.post("/signup", async (req, res) => {
  // creating new instance of user model
  const user = new User(req?.body);
  try {
    await user.save();
    res.send("User created successfully..");
  } catch (err) {
    res.status(400).send("Error occurs while creating user" + err);
  }
});

app.post("/user", async (req, res) => {
  try {
    const userEmail = req?.body?.emailId;
    const user = await User.find({ emailId: userEmail });

    if (!user?.length) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req?.body?.userId;

    // await User.findByIdAndDelete({ _id: userId });
    await User.findByIdAndDelete(userId); // this shortHand of { _id: userId }

    res.send("User deleted successfully.");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req?.params?.userId;
    const data = req?.body;

    const ALLOWED_FIELDS = ["gender", "skills", "age", "lastName", "photo"];

    const isAllFieldEligible = Object.keys(data).every((key) =>
      ALLOWED_FIELDS.includes(key),
    );

    if (!isAllFieldEligible) {
      throw new Error("All field are not valid to update");
    }

    if (data?.skills?.length > 10) {
      throw new Error("skills not more than 10");
    }

    // const result = await User.findOneAndUpdate(userId, data);
    // findOneAndUpdate and findByIdAndUpdate both are same.
    const result = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before", // return value before update
      runValidators: true, // validate model level schema
      upsert: true, // if user not present then insert
    });
    console.log(result);

    res.send("User updated successfully.");
  } catch (err) {
    console.log(err);
    res.status(500).send(err?.message || "Something went wrong");
  }
});

app.post("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (!users.length) res.status(404).send("User Not Found");
    res.send(users);
  } catch (err) {
    res.status(500).send("Something went wrong");
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
