const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY; // OpenAI에서 발급받은 API 키
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const model_trans = {
  'GPT-4o mini': 'gpt-4o-mini',
  'GPT-4o': 'gpt-4o',
  'GPT-3.5 Turbo': 'gpt-3.5-turbo-0125',
};

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
  let msg = [{ role: 'system', content: req.body.custom }, ...req.body.conversation];
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: model_trans[req.body.model],
        messages: msg,
        max_tokens: 1500, // 응답 길이 제한
        temperature: 0.7, // 창의성 조절 (0 ~ 1 사이 값)
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ role: 'assistant', content: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return { role: 'assistant', content: error.response ? error.response.data : error.message };
  }
});
