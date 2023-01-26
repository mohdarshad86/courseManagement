const userModel = require("../models/userModel.js");
// const validation=require("../validation/validation")
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    let userData = req.body;

    let { name, email, password, role } = userData;

    if (!name)
      return res.status(400).send({ status: false, msg: "Please send name" });
    if (!email)
      return res.status(400).send({ status: false, msg: "Please send email" });
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "Please send password" });

    const emailExist = await emailModel.findOne({ email: email });

    if (emailExist)
      return res.status(400).send({
        status: false,
        msg: "Email already in use, please use different Email",
      });

    let userCreated = await userModel.create(userData);

    return res.status(201).send({ status: true, data: userCreated });
  } catch (error) {
    console.log('Create user Error',error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

  if (!email)
    return res.status(400).send({ status: false, msg: "Please send email" });
  if (!password)
    return res.status(400).send({ status: false, msg: "Please send password" });

  const userExist = await userModel.findOne({
    email: email,
    password: password,
    isDeleted: false,
  });

  if (!userExist) {
    return res.status(404).send({
      status: false,
      msg: "User Not Exist for this Email and Password",
    });
  }

  let token = jwt.sign(
    {
      userId: userExist._id.toString(),
      role: userExist.role,
    },
    "Batsys SecretKey"
  );

  res.setHeader("x-auth-token", token);

  return res.status(201).send({ status: true, data: token });
  } catch (error) {
    console.log('Login error', error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createUser, login };
