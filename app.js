'use strict';

const express = require('express');
const app = express();
const port = 3000;
// 확장성을 위해 apps라고 명칭
const appPath = "./apps";

// 음악 순위 서비스 라우팅 파일, 따로 routes 폴더를 만들수도 있으나 API서비스들과 같은 폴더 내에 위치 하는게 사용 경험상 더 효율적이라 생각되어 처리
const musicApiRouter = require(appPath + "/music/api/index");
// 음악 서비스 batch index 실행
const musicBatchRouter = require(appPath + '/music/batch/index');

// 음악 순위 서비스 API prefix
app.use('/music-chart', musicApiRouter);

function startServer() {
    app.listen(port, err => {
        if(err){ // 추가로 LOG 를 남겨야 됨
            console.log("error");
            process.exit(1); // 비정상 종료
            return ;
        }
        console.log(port + " port server on");
    });
}

startServer();