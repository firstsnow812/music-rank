'use strict';

// 객체로 만들어 사용할 것의 경우 처음을 대문자로 하여 이후 객체 만든것의 네이밍은 좀 더 익숙하고 편하게 사용
const MusicBatchService = require("./musicBatchService");
const appRoot = require('app-root-path'); // app root 경로 간단히 사용하기 위한 모듈
const logger = require(appRoot + '/config/winston');


/** 
 * @api {} 멜론 음원 순위 상세 정보 DB file 저장
 * @apiName crawlMelon
 * @apiGroup music
 */
exports.crawlMelon = async (crawlCnt) => {
    try {
        const url = "https://www.melon.com/chart/index.htm";
        const detailUrl = "https://www.melon.com/album/detail.htm";
        logger.info('melon crawling 시작 호출 횟수-> ' + crawlCnt);
        const musicBatchService = new MusicBatchService();
        const html = await musicBatchService.getHTML(url); 
        let rankInfo = await musicBatchService.getMelonRankInfo(html.data);
        // 반복문에서 매번 length 수행하지 않도록 처리
        const musicCnt = rankInfo.length;
        let detailParamUrl = '';
        let result = [];

        // 음원 순위 기본 정보 추출 실패
        if(musicCnt == 0){
            throw new Error("melon 음원 순위 기본 정보 crawling 실패");
        }

        // 모든 음원의 상세 정보까지 보여줘야 될 경우가 있고 이 경우를 위해 특정 음악의 앨범 페이지까지 크롤링 해줘야 함(발매사, 기획사 정보를 위해), 음원순위 페이지에는 없는 정보임
        // 몇번의 실행이 되면 음원 사이트에서 IP BLOCK 시킴 조심히 사용해야함
        for(let i =0; i < musicCnt; i++){
            detailParamUrl = detailUrl + "?albumId=" + rankInfo[i].albumKey;
            // 사용된 albumKey값은 data를 깔끔하게 하기 위해 delete
            delete rankInfo[i].albumKey;
            const detailHtml = await musicBatchService.getHTML(detailParamUrl);
            const detailInfo = await musicBatchService.getMelonDetailInfo(detailHtml.data);
            if(detailInfo.publishing == '' || detailInfo.agency == ''){
                throw new Error("melon 음원 상세 정보 crawling 실패");
            }
            const rankDetailInfo = Object.assign({}, rankInfo[i], detailInfo);
            result.push(rankDetailInfo);
        }      

        //음원 순위 결과를 file db에 저장
        musicBatchService.createFileDb('melon',rankInfo);

        //음원 상세 결과를 file db에 저장
        musicBatchService.createFileDb('melon',result, '_detail');
        logger.info('melon crawling 성공');
    }
    catch (err){
        logger.info('melon crawling 실패');
        logger.error(err);
    }
};

/** 
 * @api {} 지니 음원 순위 상세 정보 DB file 저장
 * @apiName crawlGenie
 * @apiGroup music
 */
exports.crawlGenie = async (crawlCnt) => {
    try {
        const url = "https://www.genie.co.kr/chart/top200";
        const detailUrl = "https://www.genie.co.kr/detail/albumInfo";
        logger.info('genie crawling 시작 호출 횟수-> ' + crawlCnt);
        const musicBatchService = new MusicBatchService();
        const html = await musicBatchService.getHTML(url); 
        let rankInfo = await musicBatchService.getGenieRankInfo(html.data);
        // 반복문에서 매번 length 수행하지 않도록 처리
        const musicCnt = rankInfo.length;
        let detailParamUrl = '';
        let result = [];

        // 음원 순위 기본 정보 추출 실패
        if(musicCnt == 0){
            throw new Error("genie 음원 순위 기본 정보 crawling 실패");
        }        

        // 모든 음원의 상세 정보까지 보여줘야 될 경우가 있고 이 경우를 위해 특정 음악의 앨범 페이지까지 크롤링 해줘야 함(발매사, 기획사 정보를 위해), 음원순위 페이지에는 없는 정보임
        // 몇번의 실행이 되면 음원 사이트에서 IP BLOCK 시킴 조심히 사용해야함            
        for(let i =0; i < musicCnt; i++){
            detailParamUrl = detailUrl + "?axnm=" + rankInfo[i].albumKey;
            // 사용된 albumKey값은 data를 깔끔하게 하기 위해 delete
            delete rankInfo[i].albumKey;
            const detailHtml = await musicBatchService.getHTML(detailParamUrl);
            const detailInfo = await musicBatchService.getGenieDetailInfo(detailHtml.data);
            if(detailInfo.publishing == '' || detailInfo.agency == ''){
                throw new Error("genie 음원 상세 정보 crawling 실패");
            }            
            const rankDetailInfo = Object.assign({}, rankInfo[i], detailInfo);
            result.push(rankDetailInfo);
        }

        //음원 순위 결과를 file db에 저장
        await musicBatchService.createFileDb('genie',rankInfo);

        //음원 상세 결과를 file db에 저장
        await musicBatchService.createFileDb('genie',result, '_detail');
        logger.info('genie crawling 성공');
    }
    catch (err){
        logger.info('genie crawling 실패');
        logger.error(err);
    }
};

/** 
 * @api {} Vibe 음원 순위 상세 정보 DB file 저장
 * @apiName crawlVibe
 * @apiGroup music
 */
exports.crawlVibe = async (crawlCnt) => {
    try {
        const url = "https://vibe.naver.com/chart/total";
        const detailUrl = "https://vibe.naver.com/album";
        logger.info('vibe crawling 시작 호출 횟수-> ' + crawlCnt);
        const musicBatchService = new MusicBatchService();
        const html = await musicBatchService.getHTML(url);
        let rankInfo = await musicBatchService.getVibeRankInfo(html.data);
        // 반복문에서 매번 length 수행하지 않도록 처리
        const musicCnt = rankInfo.length;
        let detailParamUrl = '';
        let result = [];
        // 음원 순위 기본 정보 추출 실패
        if(musicCnt == 0){
            throw new Error("vibe 음원 순위 기본 정보 crawling 실패");
        }

        // 모든 음원의 상세 정보까지 보여줘야 될 경우가 있고 이 경우를 위해 특정 음악의 앨범 페이지까지 크롤링 해줘야 함(발매사, 기획사 정보를 위해), 음원순위 페이지에는 없는 정보임
        // 몇번의 실행이 되면 음원 사이트에서 IP BLOCK 시킴 조심히 사용해야함            
        for(let i =0; i < musicCnt; i++){
            detailParamUrl = detailUrl + "/" + rankInfo[i].albumKey;
            // 사용된 albumKey값은 data를 깔끔하게 하기 위해 delete
            delete rankInfo[i].albumKey;                
            const detailHtml = await musicBatchService.getHTML(detailParamUrl);
            const detailInfo = await musicBatchService.getVibeDetailInfo(detailHtml.data);
            if(detailInfo.publishing == '' || detailInfo.agency == ''){
                throw new Error("vibe 음원 상세 정보 crawling 실패");
            }            
            const rankDetailInfo = Object.assign({}, rankInfo[i], detailInfo);
            result.push(rankDetailInfo);
        }

        //음원 순위 결과를 file db에 저장
        await musicBatchService.createFileDb('vibe',rankInfo);

        //음원 상세 결과를 file db에 저장
        await musicBatchService.createFileDb('vibe',result, '_detail');
        logger.info('vibe crawling 성공');
    }
    catch (err){
        logger.info('vibe crawling 실패');
        logger.error(err);
    }
};



