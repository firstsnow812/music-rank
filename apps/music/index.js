'use strict';

const express = require('express');
const router = express.Router();
const musicAPI = require("./api/musicAPI");
const musicBatch = require("./batch/musicBatch");

router.get("/:vendor/summary", musicAPI.test);
router.get("/test", musicAPI.test);
router.get("/crawl-melon", musicBatch.crawlMelon); // 이거 나중에 musicBatch 라는 파일을 만들어서 거기로 옮길 예정

// router.get('/test', function(req, res) {
//     console.log("test");
//     res.send("test");
//   });

module.exports = router;