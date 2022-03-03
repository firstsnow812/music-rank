'use strict';
// require한 것의 상수는 처음을 대문자로 하여 이후 객체 만든것을 좀 더 편하게 사용
const MusicBatchService = require("./musicBatchService");


// 파라미터나 요소들에 따라 분기 넣어서 깔끔히 처리 되게 변경 하면 더 좋을듯
// 모듈화 시켜 만들려 했으나가 각 음원 사이트당 예외처리 요소들이 생각보다 많아서 따로 공통 함수화 시키지는 않음
exports.crawlMelon = async () => {
    try {
        console.log("melon on");

        const url = "https://www.melon.com/chart/index.htm";
        const detailUrl = "https://www.melon.com/album/detail.htm";
        const musicBatchService = new MusicBatchService();
        const html = await musicBatchService.getHTML(url); 
        let rankInfo = await musicBatchService.getMelonRankInfo(html.data);
        // 반복문에서 매번 length 수행하지 않도록 처리
        const musicCnt = rankInfo.length;
        let detailParamUrl = '';
        let result = [];

        if(musicCnt > 0){
            for(let i =0; i < musicCnt; i++){
                detailParamUrl = detailUrl + "?albumId=" + rankInfo[i].albumKey;
                // 사용된 albumKey값은 data를 깔끔하게 하기 위해 delete
                delete rankInfo[i].albumKey;
                const detailHtml = await musicBatchService.getHTML(detailParamUrl);
                const detailInfo = await musicBatchService.getMelonDetailInfo(detailHtml.data);
                const rankDetailInfo = Object.assign({}, rankInfo[i], detailInfo);
                result.push(rankDetailInfo);
            }
        }
        //음원 순위 결과를 file db에 저장
        await musicBatchService.createFileDb('melon',rankInfo);

        //음원 상세 결과를 file db에 저장
        await musicBatchService.createFileDb('melon',result, '_detail');
    }
    catch (err){

    }
};

exports.crawlGenie = async () => {
    try {
        console.log("genie on");

        const url = "https://www.genie.co.kr/chart/top200";
        const detailUrl = "https://www.genie.co.kr/detail/albumInfo";
        const musicBatchService = new MusicBatchService();
        const html = await musicBatchService.getHTML(url); 
        let rankInfo = await musicBatchService.getGenieRankInfo(html.data);
        // 반복문에서 매번 length 수행하지 않도록 처리
        const musicCnt = rankInfo.length;
        let detailParamUrl = '';
        let result = [];

        if(musicCnt > 0){
            for(let i =0; i < musicCnt; i++){
                detailParamUrl = detailUrl + "?axnm=" + rankInfo[i].albumKey;
                // 사용된 albumKey값은 data를 깔끔하게 하기 위해 delete
                delete rankInfo[i].albumKey;
                const detailHtml = await musicBatchService.getHTML(detailParamUrl);
                const detailInfo = await musicBatchService.getGenieDetailInfo(detailHtml.data);
                const rankDetailInfo = Object.assign(rankInfo[i], detailInfo);
                result.push(rankDetailInfo);
            }
        }

        //음원 순위 결과를 file db에 저장
        await musicBatchService.createFileDb('genie',rankInfo);

        //음원 상세 결과를 file db에 저장
        await musicBatchService.createFileDb('genie',result, '_detail');
    }
    catch (err){
        console.log(err);

    }
};

// vibe의 경우 크롤링 안되게 사이트 내에서 막아놨음
exports.crawlVibe = async () => {
    try {
        const url = "https://vibe.naver.com/chart/total";
        const detailUrl = "https://vibe.naver.com/album";
        const musicBatchService = new MusicBatchService();
        const html = await musicBatchService.getHTML(url);
        let rankInfo = await musicBatchService.getVibeRankInfo(html.data);
        // 반복문에서 매번 length 수행하지 않도록 처리
        const musicCnt = rankInfo.length;
        let detailParamUrl = '';
        let result = [];

        if(musicCnt > 0){
            for(let i =0; i < musicCnt; i++){
                detailParamUrl = detailUrl + "/" + rankInfo[i].albumKey;
                // 사용된 albumKey값은 data를 깔끔하게 하기 위해 delete
                delete rankInfo[i].albumKey;                
                const detailHtml = await musicBatchService.getHTML(detailParamUrl);
                const detailInfo = await musicBatchService.getVibeDetailInfo(detailHtml.data);
                const rankDetailInfo = Object.assign(rankInfo[i], detailInfo);
                result.push(rankDetailInfo);
            }
        }

        //음원 순위 결과를 file db에 저장
        await musicBatchService.createFileDb('vibe',rankInfo);

        //음원 상세 결과를 file db에 저장
        await musicBatchService.createFileDb('vibe',result, '_detail');
    }
    catch (err){
        console.log(err);
    }
};



