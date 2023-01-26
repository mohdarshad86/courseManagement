const express = require("express");
const router = express.Router();
const userController=require("../controllers/userController")
const courseController=require("../controllers/bookController")

router.post('createUser', userController.createUser)

module.exports = router;
