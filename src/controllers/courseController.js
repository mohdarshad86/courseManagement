const courseModel = require("../models/courseModel.js");
const usereModel = require("../models/userModel");
// const validation=require("../validation/validation")

const createCourse = async (req, res) => {
  try {
    let courseData = req.body;

    let { title, description, videoUrl, topics, duration, category } = courseData;

    if (!title)
      return res.status(400).send({ status: false, msg: "Please send name" });
    if (!description)
      return res.status(400).send({ status: false, msg: "Please send email" });
    if (!videoUrl)
      return res
        .status(400)
        .send({ status: false, msg: "Please send videoUrl" });

    //put autharisation here and check if it is admion/superadmin
    let courseCreated = await courseModel.create(courseData);

    return res.status(201).send({ status: true, data: courseCreated });
  } catch (error) {
    console.log('create user error',error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {createCourse}
