const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { isValidObjectId } = require("mongoose");

//AUTHENTICATE
const authenticate = async (req, res) => {
  try {
    let token = req.headers["x-auth-token"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "Token must be present" });

    jwt.verify(token, "Batsys SecretKey", function (err, decoded) {
      if (err) {
        return res.status(400).send({ status: false, msg: "Invalid Token" });
      } else {
        req.userId = decoded.userId;
        req.role = decoded.role;
        return next();
      }
    });
  } catch (error) {
    console.log("authenticate error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const autherise = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (!userId)
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid user ID" });

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid user ID" });

    let userData = await userModel.findById(userId);

    if (!userData || userData.isDeleted == true) {
      return res.status(404).send({ msg: "user not exist for this id." });
    }

    if (userData._id.toString() !== req.userId || userData.role == "Employee") {
      return res.status(403).send({
        status: false,
        msg: "You are not autharised to do this operation",
      });
    }
  } catch (error) {
    console.log("autherise error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports={authenticate, autherise}
