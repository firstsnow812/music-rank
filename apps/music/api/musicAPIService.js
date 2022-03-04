'use strict';

const low = require('lowdb');
const lodash = require('lodash');
const fileSync = require('lowdb/adapters/FileSync');
const appRoot = require('app-root-path'); // app root 경로 간단히 사용하기 위한 모듈
const logger = require(appRoot + '/config/winston');
const vendorList = ["melon", "genie", "vibe"];

// 이 파일은 API 비지니스 로직들의 클래스 역할로 사용, musicAPI.js에서 관련 주석들이 있으므로 따로 함수 내 주석은 중복되는 느낌이라 넣지 않음
class musicAPIService{
    async getMusicDetail(vendor, rank){
            // reject 발생시 앞단 API의 catch문에 걸려 error 처리가 공통적으로 진행됨
            return new Promise(function(resolve, reject) {
                rank = Number(rank);
                if(vendorList.indexOf(vendor) < 0 || !Number.isInteger(rank) || rank < 1){
                    throw new Error("function:getMusicDetail, 필수 인자가 잘못됨");
                }

                const fileDbPath = './file_db/' + vendor + '_detail.json';
                const adapter = new fileSync(fileDbPath);
                const db = low(adapter);

                // https://github.com/typicode/lowdb/tree/v1.0.0 을 통해 RDB의 WHERE과 같은 조건을 걸어, 해당하는 rank값만 가져오려고 guide 대로 했으나 안됨
                // 시간 관계상 주석 처리 하고, 임시 방편으로 아래 부분에 매칭되는 결과만을 반환 시키는 로직 처리
                //return db.get(vendor).find({rank: rank}).value();

                const result = db.get(vendor).value();
                const resultCnt = result[0].length;

                if(resultCnt > 0){
                    // 매칭 되는 rank값의 object 반환
                    for(let i =0; i < resultCnt; i++){
                        if(result[0][i].rank == rank){
                            //return result[0][i];
                            resolve(result[0][i]);
                        }
                    }
                }

                resolve({});
            });
    }

    async getMusicRankList(vendor){
        // reject 발생시 앞단 API의 catch문에 걸려 error 처리가 공통적으로 진행됨
        return new Promise(function(resolve, reject) {
            if(vendorList.indexOf(vendor) < 0){
                throw new Error("function:getMusicRankList, 필수 인자가 잘못됨");
            }            
            const fileDbPath = './file_db/' + vendor + '.json';
            const adapter = new fileSync(fileDbPath);
            const db = low(adapter);

            resolve(db.get(vendor).value());
        });
    }

    async getMusicRankDetailList(vendor){
        // reject 발생시 앞단 API의 catch문에 걸려 error 처리가 공통적으로 진행됨
        return new Promise(function(resolve, reject) {
            if(vendorList.indexOf(vendor) < 0){
                throw new Error("function:getMusicRankDetailList, 필수 인자가 잘못됨");
            }
            const fileDbPath = './file_db/' + vendor + '_detail.json';
            const adapter = new fileSync(fileDbPath);
            const db = low(adapter);

            resolve(db.get(vendor).value());
        });
    }
}

module.exports = musicAPIService;