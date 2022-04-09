"use strict";

const express = require("express");
const home = require("./home");
const router = express.Router();

//route front page
router.get("/", home.home);

module.exports = router;
