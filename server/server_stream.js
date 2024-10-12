const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY; // OpenAI에서 발급받은 API 키
const apiUrl = 'https://api.openai.com/v1/chat/completions';



app.use(express.urlencoded({ extended: true }));
// JSON 형식의 요청 바디를 처리하기 위한 미들웨어
app.use(express.json());

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 빌드된 React 정적 파일 제공
app.use(express.static(path.join(__dirname, '../build')));

// 모든 요청에 대해 React의 index.html 반환
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});



app.post('/callGptAPI', async (req, res) => {
  const model_trans = {
  'GPT-4o mini': 'gpt-4o-mini',
  'GPT-4o': 'gpt-4o',
  'GPT-3.5 Turbo': 'gpt-3.5-turbo-0125',
};
  let msg = [{ role: 'system', content: req.body.custom }, ...req.body.conversation];
  console.log( model_trans[req.body.model]);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // 헤더를 클라이언트로 즉시 전송
  try {
    const response = await axios({
      method: 'post',
      url: apiUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: model_trans[req.body.model],
        messages: msg,
        stream: true, // 스트리밍 활성화
      },
      responseType: 'stream', // 스트리밍 응답 설정
    });

    // 스트리밍 응답을 클라이언트에게 전달
    response.data.on('data', (chunk) => {
      const payloads = chunk.toString().split('\n\n');
      payloads.forEach((payload) => {
        if (payload.includes('[DONE]')) return; // 스트리밍 완료
        if (payload.length > 0) {
          const data = JSON.parse(payload.replace('data: ', ''));
          console.log(data); // 콘솔에 출력
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
