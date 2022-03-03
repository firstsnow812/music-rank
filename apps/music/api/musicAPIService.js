'use strict';
const low = require('lowdb');
const lodash = require('lodash');
const fileSync = require('lowdb/adapters/FileSync');

class musicAPIService{
    async getMusicDetail(vendor, rank){
        try{
            const fileDbPath = './file_db/' + vendor + '_detail.json';
            const adapter = new fileSync(fileDbPath);
            const db = low(adapter);

            // https://github.com/typicode/lowdb/tree/v1.0.0 을 통해 guide 대로 했으나 안됨, 시간 관계상 임시 방편으로 맞는 결과를 위한 로직 처리
            //return db.get(vendor).find({rank: rank}).value();

            const result = db.get(vendor).value();
            const resultCnt = result[0].length;

            if(resultCnt > 0){
                for(let i =0; i < resultCnt; i++){
                    if(result[0][i].rank == rank){
                        return result[0][i];
                    }
                }
            }

            // 이 위치까지 return 된게 없다면, 데이터 없음 처리
            return {};
        }catch(err){
            console.log(err);

        }


    }

    async getMusicRankList(vendor){
        try{
            const fileDbPath = './file_db/' + vendor + '.json';
            const adapter = new fileSync(fileDbPath);
            const db = low(adapter);

            return db.get(vendor).value();
        }catch(err){

        }


    }

    async getMusicRankDetailList(vendor){
        try{
            const fileDbPath = './file_db/' + vendor + '_detail.json';
            const adapter = new fileSync(fileDbPath);
            const db = low(adapter);

            return db.get(vendor).value();
        }catch(err){

        }


    }    

}

module.exports = musicAPIService;