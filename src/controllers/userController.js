const userModel = require("../models/userModel.js");
const validation = require("../validation/validation");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function encryptPass(password) {
  return crypto.pbkdf2Sync(password, "key", 100, 32, `sha512`).toString(`hex`);
}

const createUser = async (req, res) => {
  try {
    let userData = req.body;

    let { name, email, password, role } = userData;

    if (!name || name == "")
      return res.status(400).send({ status: false, msg: "Please send name" });
    if (typeof name != "string")
      return res
        .status(400)
        .send({ status: false, message: "Wrong format of name" });
    if (!validation.validate(name))
      return res.status(400).send({ status: false, message: "Invalid name" });

    if (!email || email == "")
      return res.status(400).send({ status: false, msg: "Please send email" });
    if (typeof email !== "string")
      return res
        .status(400)
        .send({ status: false, message: "wrong format of email" });
    if (!validation.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Invalid email address" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is mandatory" });
    if (typeof password !== "string")
      return res
        .status(400)
        .send({ status: false, message: "Wrong format of password" });
    if (!validation.validatePassword(password))
      return res.status(400).send({
        status: false,
        message:
          "Please input correct Alphanumeric password of length 8 to 15 characters",
      });

    if (role) {
      if (typeof role !== "string")
        return res
          .status(400)
          .send({ status: false, message: "wrong format of Role" });
      if (!["Super Admin", "Admin", "Employee"].includes(role))
        return res.status(400).send({
          status: false,
          message: "Role can only contain Super Admin, Admin, Employee",
        });
    }

    userData.password = encryptPass(password);

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
    let { email, password } = req.body;

    if (!email || email == "")
      return res.status(400).send({ status: false, msg: "Please send email" });
    if (typeof email !== "string")
      return res
        .status(400)
        .send({ status: false, message: "wrong format of email" });
    if (!validation.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Invalid email address" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is mandatory" });
    if (typeof password !== "string")
      return res
        .status(400)
        .send({ status: false, message: "Wrong format of password" });
    if (!validation.validatePassword(password))
      return res.status(400).send({
        status: false,
        message:
          "Please input correct Alphanumeric password of length 8 to 15 characters",
      });

    password = encryptPass(password);

    // console.log(password);

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
      return res
        .status(404)
        .send({ status: false, msg: "No such user exists" });

    return res.status(200).send({ status: true, data: userDetails });
  } catch (error) {
    console.log("get User error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createUser, loginUser, getUser };
