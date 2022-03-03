'use strict';

exports.test = async (req, res) => {
    try {
        console.log("test");
        res.send("xxx");
        res.status(200);

        // const itemAPIService = new ItemAPIService();

        // //프리뷰 상태 확인 및 처리
        // const reviewItem = await itemAPIService.getPreviewItem()

        // //미디어 정보 전송
        // res.status(200);
        // return res.json(reviewItem);
    }
    catch (err){
        // Logger.error(err);
        // res.status(400);
        // return res.json(err);
    }
};

