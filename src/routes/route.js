const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");
const middleWare = require("../middleware/auth");

//USER
router.post("/createUser", userController.createUser);
router.post("/loginUser", userController.loginUser);
router.get("/getUser/:userId", userController.getUser);

//COURSES
router.post(
  "/createCourse",
  middleWare.authenticate,
  middleWare.autherise,
  courseController.createCourse
);

router.put(
  "/updateCourse/:courseId",
  middleWare.authenticate,
  middleWare.autherise,
  courseController.updateCourse
);

router.put(
  "/approveCourse/:courseId",
  middleWare.authenticate,
  middleWare.superAuth,
  courseController.approveCourse
);

router.post(
  "/deleteCourse/:courseId",
  middleWare.authenticate,
  middleWare.autherise,
  courseController.deleteCourse
);

router.get("/getCourses", middleWare.authenticate, courseController.getCourses);

module.exports = router;
