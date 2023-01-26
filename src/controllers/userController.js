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

    const userExist = await userModel.findOne({ email: email });

    if (userExist)
      return res.status(400).send({
        status: false,
        msg: "Email already in use, please use different Email",
      });

    let userCreated = await userModel.create(userData);

    return res.status(201).send({ status: true, data: userCreated });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({ status: false, msg: error.message });
  }
};

module.exports = {createUser}
