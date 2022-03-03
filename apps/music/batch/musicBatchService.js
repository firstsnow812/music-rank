'use strict';

const axios = require("axios");
const cheerio = require("cheerio");
const low = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

class musicBatchService{
    async createFileDb(vendor, data, type = ''){
        try {
            const fileName = vendor + type;
            const fileDbPath = './file_db/' + fileName + '.json';
            const adapter = new fileSync(fileDbPath);
            const db = low(adapter);

            switch(vendor){
                case 'melon':
                    // 파일이 존재 하지 않을때 처리
                    db.defaults({melon:[]}).write();
                    db.get('melon').push(data).write();
                    break;
                case 'genie':
                    db.defaults({genie:[]}).write();
                    db.get('genie').push(data).write();                    
                    break;
                case 'vibe':                    
                default:
                    db.defaults({vibe:[]}).write();
                    db.get('vibe').push(data).write();
                    break;
            }
          } catch (err) {
            console.log(err);
            throw new Error(err);
          }
   };    


    async getHTML(url){
        try {
            return await axios.get(url);
          } catch (err) {
            console.log(err);
            throw new Error(err);
          }
   };

  async getMelonDetailInfo(node){
    try {
        const $ = cheerio.load(node); // 파싱 가능한 구조로 로드
        // 발매사
        const publishing = $(node).find(".section_info .list dd:eq(2)").text();
        // 기획사
        const agency = $(node).find(".section_info .list dd:eq(3)").text();

        return {publishing: publishing, agency: agency};
      } catch (err) {
        //console.log(err);
        //throw new Error(err);
      }
}; 

  async getMelonRankInfo(node){
    try {
        const $ = cheerio.load(node); // 파싱 가능한 구조로 로드

        const $musicList = $("table tbody tr");

        let result = []; // 결과 구조를 담을 배열
        $musicList.each((idx, node) => {
            // 요소들을 가져 올때는 id값을 기준으로 가져오면 제일 좋으나 class값이나 html element의 순번 정도로 가져올 수 밖에 없음
            // 랭킹 정보
            const rank = $(node).find("td:eq(1) .rank").text();
            // 노래 정보
            const title = $(node).find("td:eq(5) .wrap_song_info div:eq(0) span a").text();
            // 가수 정보
            const singer = $(node).find("td:eq(5) .wrap_song_info div:eq(1) span a").text();
            // 앨범 정보
            const album = $(node).find("td:eq(6) .wrap_song_info div a").text();
            // 앨범 상세 정보 파악을 위한 html 값 추출
            const albumHtml = $(node).find("td:eq(6) .wrap_song_info div a").attr("href");
            const regex = /[^0-9]/g; // 숫자만 추출하기 위한 정규식
            // 앨범 키 값 추출
            const albumKey = albumHtml.replace(regex, "");
    
            result.push({
                rank: rank,
                title: title,
                singer: singer,
                album: album,
                albumKey: albumKey
              });
        });
        
        return result;
        
      } catch (err) {
        //console.log(err);
        //throw new Error(err);
      }
  };

  async getGenieDetailInfo(node){
    try {
        const $ = cheerio.load(node); // 파싱 가능한 구조로 로드
        // 발매사
        const publishing = $(node).find("ul.info-data li:eq(2) span.value").text();
        // 기획사
        const agency = $(node).find("ul.info-data li:eq(3) span.value").text();

        return {publishing: publishing, agency: agency};
      } catch (err) {
        //console.log(err);
        //throw new Error(err);
      }
};

  async getGenieRankInfo(node){
    try {
        const $ = cheerio.load(node); // 파싱 가능한 구조로 로드

        const $musicList = $("table tbody tr");

        let result = []; // 결과 구조를 담을 배열
        $musicList.each((idx, node) => {
            // 요소들을 가져 올때는 id값을 기준으로 가져오면 제일 좋으나 class값이나 html element의 순번 정도로 가져올 수 밖에 없음
            // 랭킹 정보, replace carriage return
            const rank = $(node).find("td:eq(1) .number").contents().get(0).nodeValue.replace(/(\r\n|\n|\r|\s)/gm,"");
            // 노래 정보, replace carriage return
            const title = $(node).find("td:eq(4) a.title").text().replace(/(\r\n|\n|\r|\s)/gm,"");
            // 가수 정보
            const singer = $(node).find("td:eq(4) a.artist").text();
            // 앨범 정보
            const album = $(node).find("td:eq(4) a.albumtitle").text();
            // 앨범 상세 정보 파악을 위한 html 값 추출
            const albumHtml = $(node).find("td:eq(2) a").attr("onclick");
            const regex = /[^0-9]/g; // 숫자만 추출하기 위한 정규식
            // 앨범 키 값 추출
            const albumKey = albumHtml.replace(regex, "");
    
            result.push({
                rank: rank,
                title: title,
                singer: singer,
                album: album,
                albumKey: albumKey
              });
        });
        
        return result;
        
      } catch (err) {
        console.log(err);
        //throw new Error(err);
      }
  };

  // 해당 페이지는 crawling이 막히나 로직 구현은 해둬야 하므로 진행
  async getVibeDetailInfo(node){
    try {
        const $ = cheerio.load(node); // 파싱 가능한 구조로 로드
        console.log($(node).find("div.ly_popup").html());
        // 발매사
        const publishing = $(node).find("div.ly_popup div.ly_contents div.ly_company_area table tbody tr:eq(0) td").text();
        // 기획사
        const agency = $(node).find("div.ly_popup div.ly_contents div.ly_company_area table tbody tr:eq(1) td").text();

        return {publishing: publishing, agency: agency};
      } catch (err) {
        //console.log(err);
        //throw new Error(err);
      }
};

  async getVibeRankInfo(node){
    try {
      const $ = cheerio.load(node); // 파싱 가능한 구조로 로드
      const $musicList = $("table tbody tr");

      let result = []; // 결과 구조를 담을 배열
      $musicList.each((idx, node) => {
          // 랭킹 정보
          const rank = $(node).find("td.rank span.text").text()
          // 노래 정보
          const title = $(node).find("td.song .title_badge_wrap span.inner_cell a").text();
          // 가수 정보
          const singer = $(node).find("td.artist").attr("title");
          // 앨범 정보
          const album = $(node).find("td.album a").text();
          // 멜론, 지니 뮤직과 다르게 정규식이 오히려 가독성이 떨어질듯하여 이렇게 처리
          const albumKey = $(node).find("td.thumb img").attr("src").replace("./vibe_files/","").replace(".jpg","");
  
          result.push({
              rank: rank,
              title: title,
              singer: singer,
              album: album,
              albumKey: albumKey
            });
      });
      
      return result;
      
    } catch (err) {
      //console.log(err);
      //throw new Error(err);
    }
  };    
}

module.exports = musicBatchService;