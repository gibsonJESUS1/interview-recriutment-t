const express = require("express");
const { Signup } = require("../controller/user.auth.js");
// const  { Signup } =  require("../controller/user.auth");
const router  =  express.Router();


router.get("/", Signup);

module.exports = router;