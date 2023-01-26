const express = require("express");
const router = express.Router();
const userController=require("../controllers/userController")
const courseController=require("../controllers/courseController")
const middleWare=require('../middleware/auth')

//USER
router.post('/createUser', userController.createUser)
router.post('/loginUser', userController.loginUser)
router.get('/getUser/:userId', userController.getUser)

//COURSES
router.post('/createCourse/:userId', middleWare.authenticate, middleWare.autherise, courseController.createCourse)


module.exports = router;
