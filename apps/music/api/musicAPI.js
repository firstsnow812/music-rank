'use strict';
// require한 것의 상수는 처음을 대문자로 하여 이후 객체 만든것을 좀 더 편하게 사용
const MusicAPIService = require("./musicAPIService");

exports.getMusicDetail = async (req, res) => {
    try {
        const musicAPIService = new MusicAPIService();
        const result= await musicAPIService.getMusicDetail(req.params.vendor, req.params.rank);

        res.status(200);
        return res.json(result);
    }
    catch (err){
        console.log(err);
        // Logger.error(err);
        // res.status(400);
        // return res.json(err);
    }
};

exports.getMusicRankList = async (req, res) => {
    try {
        const musicAPIService = new MusicAPIService();
        const results= await musicAPIService.getMusicRankList(req.params.vendor);

        res.status(200);
        return res.json(results);
    }
    catch (err){
        console.log(err);
        // Logger.error(err);
        // res.status(400);
        // return res.json(err);
    }
};

exports.getMusicRankDetailList = async (req, res) => {
    try {
        const musicAPIService = new MusicAPIService();
        const results= await musicAPIService.getMusicRankDetailList(req.params.vendor);

        res.status(200);
        return res.json(results);
    }
    catch (err){
        console.log(err);
        // Logger.error(err);
        // res.status(400);
        // return res.json(err);
    }
};


