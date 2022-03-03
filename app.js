'use strict';

const express = require('express');
const app = express();
// .env로 구성하면 확인 할때 과정이 복잡하기 때문에 dotenv 활용하지 않고 이렇게 사용
const port = 3000;
// 확장성을 위해 apps라고 명칭
const appPath = "./apps";

// 음악 순위 서비스 라우팅 파일, 따로 routes 폴더를 만들수도 있으나 API서비스들과 같은 폴더 내에 위치 하는게 사용 경험상 더 효율적이라 생각되어 처리
const musicAppRouter = require(appPath + "/music/index");

// 음악 순위 서비스 API prefix
app.use('/music-chart', musicAppRouter);

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