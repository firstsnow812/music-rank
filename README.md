# music-rank crawling

## Memo
* 최대한 공통 모듈화 하려 했으며, 오히려 너무 과한 모듈화로 인해 비효율적일 수 있는 부분들은 개별 함수로 만든 부분이 있음
* crawling Batch의 경우 앨범 페이지에서도 크롤링을 하는데 이때 접근 수가 쌓일 경우 IP BLOCK 되기 때문에 기본적으로는 주석 처리 해둠(crawling을 통한 file db는 테스트 했던거 생성해둠)

# LOG PATH
* /logs 에 log level별로 구분되어 파일 생성됨, 스크래핑(크롤링)에 대한 정보는 info 레벨의 log에 남게 되어 있음

## Batch
* express 서버 실행시 자동으로 실행되게 되어 있음. /apps/music/batch/index.js 가 실행됨

## Batch folder
* /apps/music/batch

## API folder
* /apps/music/api

## file DB path
* /file_db 에 있으며 vendor명_detail.json의 경우 상세 정보까지 포함된 데이터, vendor명.json 은 음원 순위와 기본 정보가 포함된 데이터

## server start
* node app 명령을 통해 실행, express 서버로 구성해둠

## API Example
* http://localhost:3000/music-chart/:vendor/song/:rank (vendor: melon|genie|vibe) - 음원 한개에 대한 상세 정보
* http://localhost:3000/music-chart/:vendor/summary (vendor: melon|genie|vibe) - 특정 음원 사이트의 순위 리스트
* http://localhost:3000/music-chart/:vendor/songs (vendor: melon|genie|vibe) - 특정 음원 사이트의 순위 리스트 및 상세 정보

