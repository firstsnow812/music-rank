'use strict';

const axios = require("axios");
const cheerio = require("cheerio");
const low = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');

class musicBatchService{
  /**
   * crawling 한 정보를 file DB에 저장
   *
   * @param {String} vendor vendor사 정보(melon, genie, vibe)
   * @param {Object} data db에 저장할 구조의 object
   * @param {String} type 기본 정보 저장인지, 상세 정보 저장인지 구분('' or '_detail')
   */  
  async createFileDb(vendor, data, type = ''){
    return new Promise(function(resolve, reject) {
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
      resolve(true);
    });
  };    

  /**
   * crawling할 곳의 데이터를 가져옴, html dom 데이터 얻기 위함
   *
   * @param {String} url crawling할 페이지의 url
   */
  async getHTML(url){
    return new Promise(function(resolve, reject) {
      resolve(axios.get(url));
    });
  };

  /**
   * html dom데이터를 통해 멜론의 발매사, 기획사 정보 정보 추출(음원 순위 페이지에는 없는 내용이므로 앨범 페이지 내에서 추출할때 사용)
   *
   * @param {String} node html dom
   */  
  async getMelonDetailInfo(node){
    return new Promise(function(resolve, reject) {
      const $ = cheerio.load(node); // 파싱 가능한 구조로 로드
      // 발매사
      const publishing = $(node).find(".section_info .list dd:eq(2)").text();
      // 기획사
      const agency = $(node).find(".section_info .list dd:eq(3)").text();

      resolve({publishing: publishing, agency: agency});
    });
  }; 

  /**
   * html dom데이터를 통해 음원순위 관련 기본정보를 추출
   *
   * @param {String} node html dom
   */   
  async getMelonRankInfo(node){
    return new Promise(function(resolve, reject) {
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
      
      resolve(result);
    });
  };

  async getGenieDetailInfo(node){
    return new Promise(function(resolve, reject) {
      const $ = cheerio.load(node); // 파싱 가능한 구조로 로드
      // 발매사
      const publishing = $(node).find("ul.info-data li:eq(2) span.value").text();
      // 기획사
      const agency = $(node).find("ul.info-data li:eq(3) span.value").text();

      resolve({publishing: publishing, agency: agency});
    });
  };

  async getGenieRankInfo(node){
    return new Promise(function(resolve, reject) {
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
      
      resolve(result);
    });
  };

  async getVibeDetailInfo(node){
    return new Promise(function(resolve, reject) {
      const $ = cheerio.load(node); // 파싱 가능한 구조로 로드
      console.log($(node).find("div.ly_popup").html());
      // 발매사
      const publishing = $(node).find("div.ly_popup div.ly_contents div.ly_company_area table tbody tr:eq(0) td").text();
      // 기획사
      const agency = $(node).find("div.ly_popup div.ly_contents div.ly_company_area table tbody tr:eq(1) td").text();

      resolve({publishing: publishing, agency: agency});
    });
  };

  async getVibeRankInfo(node){
    return new Promise(function(resolve, reject) {
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
      
      resolve(result);
    });
  };    
}

module.exports = musicBatchService;