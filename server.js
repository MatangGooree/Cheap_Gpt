const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
const jwt = require('jsonwebtoken');
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

//인증 미들웨어
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 빌드된 React 정적 파일 제공
app.use(express.static(path.join(__dirname, '/build')));

// 모든 요청에 대해 React의 index.html 반환
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
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

app.post('/auth/google', async (req, res) => {
  const code = req.body.code;

  console.log(code);

  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  console.log(process.env.CLIENT_SECRET);
  try {
    // 구글 토큰 엔드포인트에 POST 요청하여 토큰 교환
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token } = response.data;

    const userInfo = await getUserInfo({ accessToken: access_token, refreshToken: refresh_token });

    const token = jwt.sign({ user: userInfo }, process.env.REACT_APP_JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});
