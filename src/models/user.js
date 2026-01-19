const moongose = require("mongoose");
const validator = require("validator");

const userSchema = new moongose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator?.isEmail(value)) {
          throw new Error("Email is not is correct format:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator?.isStrongPassword(value)) {
          throw new Error("Password is not is correct format:" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(data) {
        if (!["male", "female", "others"].includes(data)) {
          throw new Error("In valid gender");
        }
      },
    },
    photo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      validate(value) {
        if (!validator?.isURL(value)) {
          throw new Error("URL is not in correct format:" + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = moongose.model("User", userSchema);
