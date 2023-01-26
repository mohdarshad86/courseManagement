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

    const emailExist = await userModel.findOne({ email: email });

    if (emailExist)
      return res.status(400).send({
        status: false,
        msg: "Email already in use, please send different Email",
      });

    let userCreated = await userModel.create(userData);

    return res.status(201).send({ status: true, data: userCreated });
  } catch (error) {
    console.log("Create user Error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).send({ status: false, msg: "Please send email" });
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "Please send password" });

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
    console.log("Login error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getUser = async function (req, res) {
  try {
    let token = req.headers["x-Auth-token"];

    if (!token) token = req.headers["x-auth-token"];

    //If no token is present in the request header return error
    if (!token)
      return res.send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "Batsys SecretKey");
    if (!decodedToken)
      return res.send({ status: false, msg: "token is invalid" });

    console.log(decodedToken);

    let userId = req.params.userId;

    if (!userId)
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid user ID" });

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid user ID" });

    let userDetails = await userModel.findById(userId);

    if (!userDetails)
      return res.send({ status: false, msg: "No such user exists" });

    return res.send({ status: true, data: userDetails });
  } catch (error) {
    console.log("get User error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createUser, loginUser, getUser };
