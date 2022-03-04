'use strict';

const musicBatch = require("./musicBatch");
const cron = require('node-cron');

// 음악 순위 파일 저장 하는 Batch들은 발매사, 기획사 정보 수집을 위해 어쩔수 없이 상세 페이지를 랭킹 수 만큼 접근하게 됨, 그러므로 자주 접근되어 IP BLOCK이 자주 되기 때문에 일단 주석 처리하며
// 동작에 문제 없으며 이를 통한 db file 생성해서 사용중
// crawling 함수를 하나 만들어 쓰려고 했으나, dom select 구문들을 배열로 만들고 그것들을 통해 title, singer등 공통값에 대입시켜서 넣을수 있게, 명확한 dom select를 하려면 오히려 비효율적일꺼라 생각되어 개별 함수들로 생성

let melonCrawlCnt = 0;
let genieCrawlCnt = 0;
let vibeCrawlCnt = 0;

// 멜론
// cron.schedule("*/10 * * * *", async () => {
//     melonCrawlCnt++;
//     await musicBatch.crawlMelon(melonCrawlCnt);
// });

// 지니
// cron.schedule("*/20 * * * *", async () => {
//     genieCrawlCnt++;
//     await musicBatch.crawlGenie(genieCrawlCnt);
// });

// Vibe
// cron.schedule("*/30 * * * *", async () => {
//     vibeCrawlCnt++;
//     await musicBatch.crawlVibe(vibeCrawlCnt);
// });