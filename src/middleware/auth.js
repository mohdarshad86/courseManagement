const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { isValidObjectId } = require("mongoose");

//AUTHENTICATE
const authenticate = async (req, res, next) => {
  try {
    let token = req.headers["x-auth-token"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "Token must be present" });

    jwt.verify(token, "Batsys SecretKey", async function (err, decoded) {
      if (err) {
        return res.status(400).send({ status: false, msg: "Invalid Token" });
      } else {
        req.userId = decoded.userId;
        req.role = decoded.role;

        let userData = await userModel.findById(req.userId);

        console.log(userData);
        if (!userData || userData.isDeleted == true) {
          return res
            .status(404)
            .send({ status: false, msg: "User not exist for this id." });
        }

        return next();
      }
    });
  } catch (error) {
    console.log("authenticate error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

//AUTHERISE
const autherise = async (req, res, next) => {
  try {
    // let userId = req.params.userId;

    // if (!userId)
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "Please provide valid user ID" });

    // if (!isValidObjectId(userId))
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "Please provide valid user ID" });

    console.log(req.userId);
    if (req.role == "Employee") {
      return res.status(403).send({
        status: false,
        msg: "You are not autharised to perform this operation",
      });
    }

    next();
  } catch (error) {
    console.log("autherise error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const superAuth = async (req, res, next) => {
  if (req.role != "Super Admin") {
    return res.status(403).send({
      status: false,
      msg: "You are not autharised to perform this operation",
    });
  }
  next();
};

module.exports = { authenticate, autherise, superAuth };
