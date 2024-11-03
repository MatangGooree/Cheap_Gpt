FROM node:latest

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 코드 복사
COPY . .

# 클라이언트 코드 빌드
RUN npm run build

# 포트 공개
EXPOSE 58080

# 서버 시작
CMD ["node", "server.js"]