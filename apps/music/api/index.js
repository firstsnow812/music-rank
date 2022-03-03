'use strict';

console.log("api on");

const express = require('express');
const router = express.Router();
const musicAPI = require("./musicAPI");
const musicBatch = require("../batch/musicBatch");

router.get("/:vendor/song/:rank", musicAPI.getMusicDetail);
router.get("/:vendor/summary", musicAPI.getMusicRankList);
router.get("/:vendor/songs", musicAPI.getMusicRankDetailList);
router.get("/test", musicBatch.crawlMelon);

module.exports = router;