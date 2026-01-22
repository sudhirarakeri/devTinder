const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const connectionRequestSchema = new Schema({
  fromUserId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  toUserId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: {
      values: ["interested", "ignored", "accepted", "rejected"],
      messgae: `{VALUE} is not correct status`,
    },
    required: true,
  },
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // compounding index

connectionRequestSchema.pre("save", function (next) {
  const user = this;
  if (user.fromUserId.equals(user.toUserId)) {
    throw new Error("Cannot sent request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
