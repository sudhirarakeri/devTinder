const moongose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      unique: true, // acts like index so for searching is very fast
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
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user?._id }, "DEV@TINDER", {
    expiresIn: "7d",
  }); // create jwt token

  return token;
};

userSchema.methods.validatePassword = async function (passwordByInput) {
  const user = this;
  const hashPassword = user?.password;

  const isValidPassword = await bcrypt.compare(passwordByInput, hashPassword);

  return isValidPassword;
};

module.exports = moongose.model("User", userSchema);
