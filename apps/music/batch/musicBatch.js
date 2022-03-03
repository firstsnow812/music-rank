'use strict';
// require한 것의 상수는 처음을 대문자로 하여 이후 객체 만든것을 좀 더 편하게 사용
const MusicBatchService = require("./musicBatchService");


// 파라미터나 요소들에 따라 분기 넣어서 깔끔히 처리 되게 변경 하면 더 좋을듯
// 모듈화 시켜 만들려 했으나가 아니라 모듈화 시키는게 낫긴 할듯?
exports.crawlMelon = async (req, res) => {
    try {
        const melonRankUrl = "https://www.melon.com/chart/index.htm";
        const melonDetailUrl = "https://www.melon.com/album/detail.htm";
        const musicBatchService = new MusicBatchService();
        const html = await musicBatchService.getHTML(melonRankUrl); 
        const rankInfo = await musicBatchService.getMelonRankInfo(html.data, elementInfo);
        // 반복문에서 매번 length 수행하지 않도록 처리
        const musicCnt = rankInfo.length;
        let melonDetailParamUrl = '';
        let result = [];

        // if(musicCnt > 0){
        //     for(let i =0; i < musicCnt; i++){
        //         melonDetailParamUrl = melonDetailUrl + "?albumId=" + rankInfo[i].albumKey;
        //         const detailHtml = await musicBatchService.getHTML(melonDetailParamUrl);
        //         const detailInfo = await musicBatchService.getMelonDetailInfo(detailHtml.data);
        //         const rankDetailInfo = Object.assign(rankInfo[i], detailInfo);
        //         result.push(rankDetailInfo);
        //         // 계속 접근하게 되니까 일단 break; 처리
        //         break;
        //     }
        // }

        // 결과를 db에 저장
        //await musicBatchService.createFileDb('melon',rankInfo); // 나중에 result 를 넣게 바꿔줘야함
    }
    catch (err){

    }
};

