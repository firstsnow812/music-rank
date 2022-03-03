'use strict';
const musicBatch = require("./musicBatch");

console.log("batch on");

const cron = require('node-cron');

// 음악 순위 파일 저장 하는 DB들은 자꾸 접근되다 보면 음원 사이트 내에서 차단 되므로 일단 주석 처리
cron.schedule("*/10 * * * *", async () => {
    //await musicBatch.crawlMelon();
});

cron.schedule("*/20 * * * *", async () => {
    //await musicBatch.crawlGenie();
});

// vibe의 경우 사이트내에서 crawling이 막힘, 일단 데이터는 생성해 뒀음(발매사, 기획사 정보는 제외)
cron.schedule("*/30 * * * *", async () => {
    //await musicBatch.crawlVibe();
});