const courseModel = require("../models/courseModel.js");
// const validation=require("../validation/validation")

const createCourse = async (req, res) => {
  try {
    let courseData = req.body;

    let { name, email, password, role } = courseData;

    if (!name)
      return res.status(400).send({ status: false, msg: "Please send name" });
    if (!email)
      return res.status(400).send({ status: false, msg: "Please send email" });
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "Please send password" });

    const courseExist = await courseModel.findOne({ email: email });

    if (courseExist)
      return res.status(400).send({
        status: false,
        msg: "Email already in use, please use different Email",
      });

    let courseCreated = await courseModel.create(courseData);

    return res.status(201).send({ status: true, data: courseCreated });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({ status: false, msg: error.message });
  }
};

module.exports = {createCourse}
