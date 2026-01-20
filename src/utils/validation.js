const validator = require("validator");

const validateSignup = (req) => {
  let { firstName, lastName, emailId, password } = req?.body;
  console.log(req?.body);
  if (!firstName?.length || !lastName?.length) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email id is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is too week");
  }
};

const validateEditProfile = (req) => {
  let ALLOWED_EDIT_FILEDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photo",
    "skills",
    "about"
  ];

  const isValidFiels = Object.keys(req?.body).every((key) =>
    ALLOWED_EDIT_FILEDS.includes(key),
  );

  if (req?.body?.photo && !validator.isURL(req?.body?.photo)) {
    throw new Error("Url is not in correct format");
  }

  return isValidFiels;
};

module.exports = { validateSignup, validateEditProfile };
