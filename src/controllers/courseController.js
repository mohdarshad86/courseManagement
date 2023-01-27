const courseModel = require("../models/courseModel.js");
const usereModel = require("../models/userModel");
const router = require("../routes/route.js");
// const validation=require("../validation/validation")

const createCourse = async (req, res) => {
  try {
    let courseData = req.body;

    let { title, description, videoUrl, topics, duration, category } =
      courseData;

    if (!title)
      return res.status(400).send({ status: false, msg: "Please send name" });
    if (!description)
      return res.status(400).send({ status: false, msg: "Please send email" });
    if (!videoUrl)
      return res
        .status(400)
        .send({ status: false, msg: "Please send videoUrl" });

    if (req.role == "Super Admin") {
      courseData.superApproved = true;
    }
    //put autharisation here and check if it is admin/superadmin
    let courseCreated = await courseModel.create(courseData);

    return res.status(201).send({ status: true, data: courseCreated });
  } catch (error) {
    console.log("create user error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    let courseId = req.params.courseId;
    let putData = req.body;
    let courseExist = await courseModel.findById(courseId);

    if (!courseExist || courseExist.isDeleted == true) {
      return res.status(404).send({
        status: false,
        msg: "Course Not Exist for this id",
      });
    }
    if (req.role == "Super Admin") {
      putData.superApproved = true;
    } else {
      putData.superApproved = false;
    }

    let updateCourse = await courseModel.findOneAndUpdate(
      { _id: courseId },
      { $set: putData }
    );

    return res.status(201).send({ status: true, data: updateCourse });
  } catch (error) {
    console.log("create user error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const approveCourse = async (req, res) => {
  try {

    //Putting this authorisation here only for this project
    //but super admin have more powers than just to approve course

    // if (req.role != "Super Admin") {
    //   return res.status(403).send({
    //     status: false,
    //     msg: "You are not autharised to perform this operation",
    //   });
    // }

    let courseId = req.params.courseId;

    let courseExist = await courseModel.findById(courseId);

    if (!courseExist || courseExist.isDeleted == true) {
      return res.status(404).send({
        status: false,
        msg: "Course Not Exist for this id",
      });
    }

    let updateCourse = await courseModel.findOneAndUpdate(
      { _id: courseId },
      { $set: { superApproved: true } }
    );

    return res.status(201).send({ status: true, data: updateCourse });
  } catch (error) {
    console.log("create user error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    let courseId = req.params.courseId;

    let courseExist = await courseModel.findById(courseId);

    if (!courseExist || courseExist.isDeleted == true) {
      return res.status(404).send({
        status: false,
        msg: "Course is already deleted",
      });
    }

    let deleteCourse = await courseModel.findOneAndUpdate(
      { _id: courseId },
      { $set: { isDeleted: true } }
    );

    return res
      .status(201)
      .send({ status: true, msg: "Course Deleted", data: deleteCourse });
  } catch (error) {
    console.log("create user error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    let condition = { isDeleted: false };
    if (req.role == "Employee") condition.superApproved = true;

    let coursesData = await courseModel.find(condition);

    if (coursesData.length == 0) {
      return res.status(404).send({
        status: false,
        msg: "No Course Available",
      });
    }
    return res.status(201).send({ status: true, data: coursesData });
  } catch (error) {
    console.log("create user error", error.message);
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  approveCourse,
};
