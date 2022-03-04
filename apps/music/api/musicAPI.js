'use strict';

// 객체로 만들어 사용할 것의 경우 처음을 대문자로 하여 이후 객체 만든것의 네이밍은 좀 더 익숙하고 편하게 사용
const MusicAPIService = require("./musicAPIService");
const appRoot = require('app-root-path'); // app root 경로 간단히 사용하기 위한 모듈
const logger = require(appRoot + '/config/winston');

/** 
 * @api {get} /:vendor/song/:rank 특정 음원의 상세 데이터 by vendor, rank
 * @apiName getMusicDetail
 * @apiGroup music
 *
 * @apiParam {String} vendor 음악사이트 회사
 * @apiParam {Number} rank 랭킹
 *
 * @apiSuccess {Number} rank 랭킹
 * @apiSuccess {String} title 음원제목
 * @apiSuccess {String} singer 가수명
 * @apiSuccess {String} album 앨범명
 * @apiSuccess {String} publishing 발매사
 * @apiSuccess {String} agency 기획사
 */
exports.getMusicDetail = async (req, res) => {
    try {
        const musicAPIService = new MusicAPIService();
        const result = await musicAPIService.getMusicDetail(req.params.vendor, req.params.rank);

        res.status(200);
        return res.json(result);
    }
    catch (err){
        logger.error(err);
        res.status(400);
        return res.json(err);
    }
};

/** 
 * @api {get} /:vendor/summary 음원 순위 데이터 by vendor
 * @apiName getMusicRankList
 * @apiGroup music
 *
 * @apiParam {String} vendor 음악사이트 회사
 *
 * @apiSuccess {Number} rank 랭킹
 * @apiSuccess {String} title 음원제목
 * @apiSuccess {String} singer 가수명
 * @apiSuccess {String} album 앨범명
 */
exports.getMusicRankList = async (req, res) => {
    try {
        const musicAPIService = new MusicAPIService();
        const results = await musicAPIService.getMusicRankList(req.params.vendor);

        res.status(200);
        return res.json(results);
    }
    catch (err){
        logger.error(err);
        res.status(400);
        return res.json(err);
    }
};

/** 
 * @api {get} /:vendor/songs 음원의 순위 상세 데이터 by vendor
 * @apiName getMusicRankDetailList
 * @apiGroup music
 *
 * @apiParam {String} vendor 음악사이트 회사
 *
 * @apiSuccess {Number} rank 랭킹
 * @apiSuccess {String} title 음원제목
 * @apiSuccess {String} singer 가수명
 * @apiSuccess {String} album 앨범명
 * @apiSuccess {String} publishing 발매사
 * @apiSuccess {String} agency 기획사* 
 */
exports.getMusicRankDetailList = async (req, res) => {
    try {
        const musicAPIService = new MusicAPIService();
        const results = await musicAPIService.getMusicRankDetailList(req.params.vendor);

        res.status(200);
        return res.json(results);
    }
    catch (err){
        logger.error(err);
        res.status(400);
        return res.json(err);
    }
};


