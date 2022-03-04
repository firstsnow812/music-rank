const winston = require('winston'); // winston 모듈
const winstonDaily = require('winston-daily-rotate-file'); // 로그파일을 일자별로 생성
const appRoot = require('app-root-path'); // app root 경로 간단히 사용하기 위한 모듈

const logDir = `${appRoot}/logs`; // log 저장 위치

const {combine, timestamp, printf} = winston.format;

const logFormat = printf(({level, message, timestamp}) => {
  return `${timestamp} ${level}: ${message}`; // 로그 출력 포맷 정의
});

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({  // info 레벨 로그를 저장할 파일 설정
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30, // 최근 30일치 로그 파일만 저장
      zippedArchiv: true
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchiv: true
    })
  ],
  exceptionHandlers: [  // uncaughtException 발생시
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      zippedArchiv: true
    })
  ]
})

// 개발간 편의를 위해 logging 처리시 console 내용 찍어줌, 운영 서비스의 경우 process.env.NODE_ENV 분기를 통해 보통 개발단계에서만 보이게 함
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), // 색상
      winston.format.simple() // 간단한 포맷
    )
  }));

module.exports = logger;