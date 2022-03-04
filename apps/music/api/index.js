'use strict';

const express = require('express');
const router = express.Router();
const musicAPI = require("./musicAPI");

// 특정 음원의 상세 데이터
router.get("/:vendor/song/:rank", musicAPI.getMusicDetail);

// 음원 순위 데이터
router.get("/:vendor/summary", musicAPI.getMusicRankList);

// 음원의 순위 상세 데이터
router.get("/:vendor/songs", musicAPI.getMusicRankDetailList);

module.exports = router;