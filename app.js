"use strict";

const express = require("express");
const app = express();
const port = 3000;
const logger = require("./config/winston");
const appsPath = "./apps";

// view engine 세팅
app.set("view engine", "ejs");
app.set("views", appsPath + "/music/fronts/views");

const viewsRouter = require(appsPath + "/music/fronts");
app.use("/", viewsRouter);

// 음악 순위 서비스 라우팅 파일, 따로 routes 폴더를 만들수도 있으나 API서비스들과 같은 폴더 내에 위치 하는게 더 효율적이라 생각되어 처리
const musicApiRouter = require(appsPath + "/music/api/index");

// batch index 실행
// 해당 파일 내에서 node-cron으로 음악 순위 crawling을 통한 file db 데이터 저장 진행
const musicBatchRouter = require(appsPath + "/music/batch/index");

// 음악 순위 서비스 API prefix
app.use("/music-chart", musicApiRouter);

function startServer() {
  app.listen(port, (err) => {
    if (err) {
      logger.error("Server process exit, port=>" + port);
      process.exit(1); // 비정상 종료
      return;
    }
    // 위의 error 조건에 걸리지 않았다면 서버 정상 가동, log기록
    logger.info("Server listening on port " + port);
  });
}

startServer();
