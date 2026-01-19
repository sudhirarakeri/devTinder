const validator = require("validator");

const signupValidator = (req) => {
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

module.exports = { signupValidator };
