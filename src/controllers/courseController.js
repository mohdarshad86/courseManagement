const courseModel = require("../models/courseModel.js");
const { isValidObjectId } = require("mongoose");
const validation = require("../validation/validation");
var validUrl = require("valid-url");

const createCourse = async (req, res) => {
  try {
    let courseData = req.body;

    let { title, description, videoUrl, category, topics, duration } =
      courseData;

    if (!title || title == "")
      return res
        .status(400)
        .send({ status: false, message: "title is mandatory" });
    if (typeof title != "string")
      return res
        .status(400)
        .send({ status: false, message: "Invalid title format" });
    if (!validation.validateTitle(title))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid title" });

    if (!description || description == "")
      return res
        .status(400)
        .send({ status: false, message: "Description is mandatory" });
    if (typeof description != "string")
      return res
        .status(400)
        .send({ status: false, message: "Invalid description format" });
    if (!validation.validateTitle(description))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid description" });

    if (!videoUrl || videoUrl == "")
      return res
        .status(400)
        .send({ status: false, msg: "Please send videoUrl" });
    if (typeof videoUrl != "string")
      return res
        .status(400)
        .send({ status: false, message: "Invalid videoUrl format" });
    if (!validUrl.isUri(videoUrl))
      return res
        .status(400)
        .send({ status: false, msg: "Please send valid videoUrl" });

    if (!category || category == "") {
      return res
        .status(400)
        .send({ status: false, msg: "Please send category" });
    }
    if (typeof category != "string")
      return res
        .status(400)
        .send({ status: false, message: "Invalid category format" });

    if (!topics || topics.length == 0) {
      return res.status(400).send({ status: false, msg: "Please send topics" });
    }

    if (!duration) {
      return res
        .status(400)
        .send({ status: false, msg: "Please send duration" });
    }
    if (typeof duration != "string")
      return res
        .status(400)
        .send({ status: false, message: "Invalid duration format" });

    //Since Super Admin has all the powers I'm making Approved true while Super Admin
    //creating a course, for Admin it should be false so that SAuper Admin can Approve it
    if (req.role == "Super Admin") {
      courseData.superApproved = true;
    }

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

    if (!courseId || courseId == "")
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid user ID" });

    if (!isValidObjectId(courseId))
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid user ID" });
    let courseExist = await courseModel.findById(courseId);

    if (!courseExist || courseExist.isDeleted == true) {
      return res.status(404).send({
        status: false,
        msg: "Course is already deleted",
      });
    }

    let deleteCourse = await courseModel.findOneAndUpdate(
      { _id: courseId },
      { $set: { isDeleted: true } },
      { new: true }
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

    let coursesData = await courseModel.find(condition).sort({ category: 1 });

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
