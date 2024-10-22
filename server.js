const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mariadb = require('mariadb');

const apiKey = process.env.OPENAI_API_KEY; // OpenAI에서 발급받은 API 키
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const fs = require('fs');
const https = require('https');

const privateKey = fs.readFileSync('./Keys/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./Keys/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);


app.use(express.urlencoded({ extended: true }));
// JSON 형식의 요청 바디를 처리하기 위한 미들웨어
app.use(express.json());



//인증 미들웨어
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

//마리아DB 설정
const pool = mariadb.createPool({
  host: 'matanggooree.dsmynas.com', // 호스트
  port: 8888,
  user: 'root', // 사용자 이름
  password: 'WktTlraos1216', // 비밀번호
  database: 'Cheap', // 데이터베이스 이름
  connectionLimit: 20, // 최대 연결 수
});

httpsServer.listen(PORT, () => {
  console.log(`HTTPS 서버가  ${PORT} 포트에서 실행 중입니다.`);
});

// 빌드된 React 정적 파일 제공
app.use(express.static(path.join(__dirname, '/build')));

// 모든 요청에 대해 React의 index.html 반환
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

// GPT 응답
app.post('/callGptAPI', async (req, res) => {
  const model_trans = {
    'GPT-4o mini': 'gpt-4o-mini',
    'GPT-4o': 'gpt-4o',
    'GPT-3.5 Turbo': 'gpt-3.5-turbo-0125',
  };
  let msg = [{ role: 'system', content: req.body.custom }, ...req.body.conversation];
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // 헤더를 클라이언트로 즉시 전송
  try {
    const response = await axios({
      method: 'post',
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: model_trans[req.body.model],
        messages: msg,
        stream: true, // 스트리밍 활성화
      },
      responseType: 'stream', // 스트리밍 응답 설정
    });
    let buffer = '';
    // 스트리밍 응답을 클라이언트에게 전달
    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      const payloads = buffer.toString().split('\n\n');
      buffer = payloads.pop(); // 마지막 조각을 버퍼에 유지
      payloads.forEach((payload) => {
        if (payload.includes('[DONE]')) return; // 스트리밍 완료
        if (payload.length > 0) {
          const data = JSON.parse(payload.replace('data: ', ''));
          if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
            res.write(data.choices[0].delta.content); // 클라이언트로 전송
          }
        }
      });
    });

    // 스트림 끝났을 때
    response.data.on('end', () => {
      res.end(); // 스트리밍 응답 종료
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error calling GPT API' });
  }
});


app.post('/DBquery',authenticate, async (req,res)=>{


  
  const job = req.body.job;
  
  let result ='';
  
  if('user_id' in req.body.data){
    //아이디를 포함한 데이터를 다뤄야 할 경우
    console.log('유저아이디 있음');
    req.body.data.user_id = req.user.id;
    
    
  }
  
  console.log(req.body);
  switch (job) {
    case 'Insert':
      result = await Insert_DB(req.body.table,req.body.data);
      break;
  
    default:
      break;
  }

});


//데이터 베이스 관련 함수
async function Insert_DB(table, data) {
  let conn;
  try {
    // 데이터베이스 연결
    conn = await pool.getConnection();

    //존재 여부 확인
    const check = await conn.query(`SELECT COUNT(*) AS count FROM ${table} WHERE ${Object.keys(data)[0]} = ?`, [Object.values(data)[0]]);

    if (check[0].count > 0) {
      // 이미 존재
      return '이미 존재';
    } else {
      //없음
      const values =
        '(' +
        Object.keys(data)
          .map(() => '?')
          .join(', ') +
        ')';
      const insertQuery = `INSERT INTO ${table} (${Object.keys(data)}) VALUES ${values}`;
      const userData = Object.values(data);
      await conn.query(insertQuery, userData, (err, result) => {
        if (err) {
          console.log('err' + err);
        } else {
          console.log(result);
        }
      });
    }
  } catch (err) {
    console.error('오류 발생:', err);
  } finally {
    if (conn) conn.release(); // 반드시 연결을 반환
  }
}

//로그인 관련
app.post('/auth/google', async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  try {
    // 구글 토큰 엔드포인트에 POST 요청하여 토큰 교환
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token } = response.data;

    const userInfo = await getUserInfo({ accessToken: access_token, refreshToken: refresh_token });

    Insert_DB('users', { user_id: userInfo.id, username: userInfo.name, email: userInfo.email });

    const token = jwt.sign({ user: userInfo }, process.env.REACT_APP_JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

// 유저 정보 추출
const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    });
    return response.data; // 사용자 정보를 반환합니다.
  } catch (error) {
    // console.error('Error fetching user info:', error);
    throw error;
  }
};